/**
 * Complexity Check Hook
 * 检测函数过长/圈复杂度过高
 */

const fs = require('fs');
const path = require('path');

const LOG_FILE = path.join(__dirname, '../logs/hook-log.jsonl');

// 阈值配置
const THRESHOLDS = {
  maxFunctionLines: 50,      // 函数最大行数
  maxCyclomaticComplexity: 10, // 最大圈复杂度
  maxFileLines: 300           // 文件最大行数
};

function countLines(content) {
  return content.split('\n').length;
}

function detectLongFunctions(content) {
  const longFunctions = [];

  // 匹配常见函数定义
  const functionPatterns = [
    /function\s+\w+\s*\([^)]*\)\s*\{[\s\S]*?\n\}/g,
    /const\s+\w+\s*=\s*\([^)]*\)\s*=>\s*\{[\s\S]*?\n\}/g,
    /async\s+function\s+\w+\s*\([^)]*\)\s*\{[\s\S]*?\n\}/g,
    /\w+\s*\([^)]*\)\s*\{[\s\S]*?\n\}\s*$/gm  // 方法
  ];

  let funcCount = 0;
  for (const pattern of functionPatterns) {
    let match;
    while ((match = pattern.exec(content)) !== null) {
      funcCount++;
      const lines = countLines(match[0]);
      if (lines > THRESHOLDS.maxFunctionLines) {
        const funcName = match[0].match(/function\s+(\w+)|const\s+(\w+)|(\w+)\s*\(/)?.[0] || 'anonymous';
        longFunctions.push({
          name: funcName,
          lines,
          threshold: THRESHOLDS.maxFunctionLines
        });
      }
    }
  }

  return { longFunctions, totalFunctions: funcCount };
}

function checkFileComplexity(content, filePath) {
  const issues = [];
  const ext = path.extname(filePath);

  // 只检查代码文件
  const codeExts = ['.js', '.ts', '.jsx', '.tsx', '.java', '.py', '.go', '.rs'];
  if (!codeExts.includes(ext)) return issues;

  const lines = countLines(content);

  // 检查文件行数
  if (lines > THRESHOLDS.maxFileLines) {
    issues.push({
      type: 'file_too_long',
      value: lines,
      threshold: THRESHOLDS.maxFileLines
    });
  }

  // 检查函数长度
  const funcAnalysis = detectLongFunctions(content);
  if (funcAnalysis.longFunctions.length > 0) {
    issues.push({
      type: 'long_functions',
      ...funcAnalysis
    });
  }

  return issues;
}

module.exports = async (ctx) => {
  const { tool_name: toolName, tool_input: input } = ctx;

  if (!['Write', 'Edit'].includes(toolName)) return;

  const content = input?.content;
  const filePath = input?.file_path;

  if (!content || !filePath) return;

  const issues = checkFileComplexity(content, filePath);

  const log = {
    timestamp: new Date().toISOString(),
    hook: 'complexity_check',
    type: 'quality',
    file: path.basename(filePath),
    issues,
    thresholds: THRESHOLDS
  };

  try {
    fs.appendFileSync(LOG_FILE, JSON.stringify(log) + '\n');
  } catch (e) {
    // ignore
  }

  if (issues.length > 0) {
    console.log('[complexity_check] ⚠️', path.basename(filePath), '-', issues.length, 'issue(s)');
  }
};

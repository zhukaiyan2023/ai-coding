/**
 * Code Quality Hook
 * 基于规则给代码变更打质量分
 */

const fs = require('fs');
const path = require('path');

const LOG_FILE = path.join(__dirname, '../logs/hook-log.jsonl');

// 质量规则
const RULES = {
  // 扣分项
  todo: { weight: -5, pattern: /\bTODO\b/i, message: 'Contains TODO' },
  fixme: { weight: -5, pattern: /\bFIXME\b/i, message: 'Contains FIXME' },
  consoleLog: { weight: -3, pattern: /console\.(log|debug|info)/, message: 'Contains console.log' },
  debugger: { weight: -10, pattern: /\bdebugger\b/, message: 'Contains debugger' },
  hardcoded: { weight: -2, pattern: /\b[A-Z]{4,}_[A-Z]{4,}\b/, message: 'Potential hardcoded constant' },

  // 加分项
  jsdoc: { weight: 5, pattern: /\/\*\*[\s\S]*?\*\//, message: 'Has JSDoc comment' },
  typescript: { weight: 3, pattern: /:\s*(string|number|boolean|any|void|never)/i, message: 'Has TypeScript types' },
  errorHandling: { weight: 5, pattern: /\b(try\s*\{|catch\s*\(|throw\s+new)/, message: 'Has error handling' },
  test: { weight: 3, pattern: /\b(test|it|describe|expect)\s*\(/, message: 'Has tests' }
};

function analyzeCode(content) {
  const scores = { total: 0, issues: [], bonuses: [] };

  if (!content) return scores;

  for (const [rule, config] of Object.entries(RULES)) {
    const matches = content.match(config.pattern);
    if (matches) {
      const issue = {
        rule,
        weight: config.weight,
        message: config.message,
        count: matches.length
      };

      if (config.weight > 0) {
        scores.bonuses.push(issue);
        scores.total += config.weight * matches.length;
      } else {
        scores.issues.push(issue);
        scores.total += config.weight * matches.length;
      }
    }
  }

  return scores;
}

module.exports = async (ctx) => {
  const { tool_name: toolName, tool_input: input } = ctx;

  // 只检查 Write/Edit
  if (!['Write', 'Edit'].includes(toolName)) return;

  const content = input?.content || input?.old_string || '';
  const filePath = input?.file_path;

  const scores = analyzeCode(content);

  const log = {
    timestamp: new Date().toISOString(),
    hook: 'code_quality',
    type: 'quality',
    file: filePath ? path.basename(filePath) : null,
    scores
  };

  try {
    fs.appendFileSync(LOG_FILE, JSON.stringify(log) + '\n');
  } catch (e) {
    // ignore
  }

  if (scores.total < 0) {
    console.log('[code_quality] ⚠️', path.basename(filePath || 'unknown'), 'score:', scores.total);
  }
};

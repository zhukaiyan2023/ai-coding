/**
 * Lint Check Hook
 * 运行项目的 lint 检查
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const LOG_FILE = path.join(__dirname, '../logs/hook-log.jsonl');

function findLintConfig(dir) {
  const configs = [
    '.eslintrc.json', '.eslintrc.js', '.eslintrc',
    '.prettierrc', '.prettierrc.json', 'prettier.config.js',
    'tslint.json'
  ];

  while (dir !== path.parse(dir).root) {
    for (const config of configs) {
      const configPath = path.join(dir, config);
      if (fs.existsSync(configPath)) {
        return { dir, config, name: config };
      }
    }
    dir = path.dirname(dir);
  }
  return null;
}

function runLint(filePath) {
  const dir = path.dirname(filePath);
  const lintConfig = findLintConfig(dir);

  if (!lintConfig) return null;

  const results = {
    config: lintConfig.name,
    file: path.basename(filePath),
    passed: true,
    errors: []
  };

  try {
    // 检测 lint 类型并运行
    if (lintConfig.name.includes('eslint')) {
      const output = execSync(`npx eslint "${filePath}" --format json 2>/dev/null`, {
        encoding: 'utf-8',
        timeout: 30000
      });
      const parsed = JSON.parse(output);
      if (parsed.length > 0 && parsed[0].messages.length > 0) {
        results.passed = false;
        results.errors = parsed[0].messages.slice(0, 5).map(m => ({
          line: m.line,
          message: m.message
        }));
      }
    } else if (lintConfig.name.includes('prettier')) {
      execSync(`npx prettier --check "${filePath}" 2>/dev/null`, { timeout: 10000 });
    }
  } catch (e) {
    results.passed = false;
    results.errors.push({ message: e.message?.substring(0, 100) });
  }

  return results;
}

module.exports = async (ctx) => {
  const { tool_name: toolName, tool_input: input } = ctx;

  if (!['Write', 'Edit'].includes(toolName)) return;

  const filePath = input?.file_path;
  if (!filePath) return;

  // 跳过非代码文件
  const skipExts = ['.md', '.json', '.yaml', '.yml', '.txt', '.lock', '.svg', '.png'];
  if (skipExts.includes(path.extname(filePath))) return;

  const results = runLint(filePath);

  const log = {
    timestamp: new Date().toISOString(),
    hook: 'lint_check',
    type: 'quality',
    ...results
  };

  try {
    fs.appendFileSync(LOG_FILE, JSON.stringify(log) + '\n');
  } catch (e) {
    // ignore
  }

  if (results && !results.passed) {
    console.log('[lint_check] ❌', path.basename(filePath), '-', results.errors.length, 'issue(s)');
  } else if (results) {
    console.log('[lint_check] ✅', path.basename(filePath), '- passed');
  }
};

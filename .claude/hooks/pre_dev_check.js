/**
 * Pre Dev Hook - 开发前检查
 *
 * 在执行开发相关操作前自动检查：
 * 1. 是否有技术设计
 * 2. 是否需要先做技术设计
 * 3. 开发环境是否就绪
 */

const fs = require('fs');
const path = require('path');

const LOG_FILE = path.join(__dirname, '../logs/hook-log.jsonl');

// 开发相关命令
const DEV_COMMANDS = [
  'implement',
  '实现',
  '开发',
  '写代码',
  '创建接口',
  'add',
  'new',
  'feature'
];

// 需要设计的关键字
const NEED_DESIGN_KEYWORDS = [
  '新功能',
  '新接口',
  '创建',
  '新增',
  '实现',
  '功能开发'
];

function hasDesignDoc() {
  const designPaths = [
    path.join(__dirname, '../../docs/design'),
    path.join(__dirname, '../../docs/technical'),
    path.join(__dirname, '../workflows')
  ];

  for (const designPath of designPaths) {
    try {
      if (fs.existsSync(designPath)) {
        const files = fs.readdirSync(designPath);
        if (files.length > 0) return true;
      }
    } catch (e) {
      // ignore
    }
  }
  return false;
}

function needsTechnicalDesign(input) {
  const text = (input.prompt || input.message || '').toLowerCase();

  // 检查是否涉及新功能开发
  const hasNewFeature = NEED_DESIGN_KEYWORDS.some(k =>
    text.includes(k.toLowerCase())
  );

  // 检查是否有现有设计
  const hasDesign = hasDesignDoc();

  return hasNewFeature && !hasDesign;
}

function checkDevEnvironment() {
  const checks = {
    java: false,
    maven: false,
    node: false
  };

  try {
    // 检查 Java
    const javaVersion = execSync('java -version 2>&1');
    checks.java = javaVersion.includes('version');
  } catch (e) {
    checks.java = false;
  }

  try {
    // 检查 Maven
    const mvnVersion = execSync('mvn -version 2>&1');
    checks.maven = mvnVersion.includes('Apache');
  } catch (e) {
    checks.maven = false;
  }

  return checks;
}

function execSync(cmd) {
  const { execSync: exec } = require('child_process');
  try {
    return exec(cmd, { encoding: 'utf-8' });
  } catch (e) {
    return '';
  }
}

module.exports = async (ctx) => {
  const { toolName, input } = ctx;

  const log = {
    timestamp: new Date().toISOString(),
    hook: 'pre_dev_check',
    toolName,
    type: 'dev_check'
  };

  const text = (input.prompt || input.message || '').toLowerCase();

  // 检查是否是开发命令
  const isDevCommand = DEV_COMMANDS.some(cmd =>
    text.includes(cmd.toLowerCase())
  );

  log.isDevCommand = isDevCommand;

  if (isDevCommand) {
    // 检查是否需要技术设计
    const needDesign = needsTechnicalDesign(input);
    log.needsTechnicalDesign = needDesign;

    if (needDesign) {
      log.suggestion = '建议先执行技术设计: /feature-dev technical-design';
      log.message = '检测到新功能开发，请先完成技术设计以确保方案可行。';
    }

    // 检查开发环境
    log.envChecks = checkDevEnvironment();
  }

  // 写入日志
  try {
    fs.appendFileSync(LOG_FILE, JSON.stringify(log) + '\n');
  } catch (e) {
    // ignore
  }

  if (log.message) {
    console.log('[pre_dev_check]', log.message);
    console.log('[pre_dev_check] suggestion:', log.suggestion);
  }
};

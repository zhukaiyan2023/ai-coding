/**
 * Post Tool Use Hook
 * 记录工具执行结果
 */

const fs = require('fs');
const path = require('path');

const LOG_FILE = path.join(__dirname, '../logs/hook-log.jsonl');

module.exports = async (ctx) => {
  const { toolName, input, output } = ctx;
  
  const log = {
    timestamp: new Date().toISOString(),
    hook: 'post_tool_use',
    toolName,
    type: 'tool_executed'
  };

  // 检查是否包含 skill 执行结果
  if (output && typeof output === 'string') {
    // 解析 SKILL_DECISION
    if (output.includes('[SKILL_DECISION]')) {
      log.type = 'skill_decision';
      log.hasDecision = true;
    }
    
    // 统计规则命中
    const rules = [
      'contains: java',
      'contains: spring', 
      'contains: react',
      'contains: ddd',
      'contains: record',
      'contains: mapstruct'
    ];
    
    log.ruleHits = rules.map(rule => {
      const keyword = rule.split(':')[1].trim();
      return {
        rule,
        hit: output.toLowerCase().includes(keyword.toLowerCase())
      };
    });
  }

  // 写入日志
  try {
    fs.appendFileSync(LOG_FILE, JSON.stringify(log) + '\n');
  } catch (e) {
    // ignore
  }

  console.log('[post_tool_use]', JSON.stringify(log));
};

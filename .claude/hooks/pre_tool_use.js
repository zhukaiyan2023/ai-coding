/**
 * Pre Tool Use Hook
 * 记录工具使用前的 skill 决策
 */

const fs = require('fs');
const path = require('path');

const LOG_FILE = path.join(__dirname, '../logs/hook-log.jsonl');

// Skills 配置
const SKILLS = [
  { name: 'java-cola-developer', keywords: ['java', 'spring', 'cola', '后端', 'jdk21'] },
  { name: 'react-developer', keywords: ['react', 'typescript', '前端', 'ts', 'tsx'] },
  { name: 'ios-developer', keywords: ['ios', 'swift', 'xcode', 'swiftui'] },
  { name: 'harmony-developer', keywords: ['harmony', '鸿蒙', 'arkts', 'arkui'] },
  { name: 'skills-monitor', keywords: ['监控', '分析', 'report', 'skills'] }
];

function matchRule(keywords, input) {
  const text = JSON.stringify(input).toLowerCase();
  return keywords.some(k => text.includes(k.toLowerCase()));
}

function analyzeSkills(input) {
  return SKILLS.map(skill => {
    const matched = matchRule(skill.keywords, input);
    return {
      skill: skill.name,
      matched,
      score: matched ? 1 : 0
    };
  }).sort((a, b) => b.score - a.score);
}

module.exports = async (ctx) => {
  const { toolName, input } = ctx;
  
  const log = {
    timestamp: new Date().toISOString(),
    hook: 'pre_tool_use',
    toolName,
    type: 'skill_decision'
  };

  // 分析应该使用哪个 skill
  if (input && (input.prompt || input.message)) {
    const text = input.prompt || input.message;
    const analysis = analyzeSkills(text);
    
    log.analysis = analysis;
    log.selected = analysis.find(s => s.score > 0)?.skill || 'default';
    log.rejected = analysis.filter(s => s.score === 0).map(s => s.skill);
  }

  // 写入日志
  try {
    fs.appendFileSync(LOG_FILE, JSON.stringify(log) + '\n');
  } catch (e) {
    // ignore
  }

  console.log('[pre_tool_use]', JSON.stringify(log));
};

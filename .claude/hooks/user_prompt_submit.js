/**
 * User Prompt Submit Hook
 * 用户提交 prompt 时分析 skill 决策
 */

const fs = require('fs');
const path = require('path');

const LOG_FILE = path.join(__dirname, '../logs/hook-log.jsonl');
const SKILLS_FILE = path.join(__dirname, '../config/skills.yaml');

// Skills 关键词配置
const SKILLS = {
  'java-cola-developer': ['java', 'spring', 'boot', 'cola', '后端', 'jdk21', 'ddd'],
  'react-developer': ['react', 'typescript', '前端', 'ts', 'tsx', 'vite'],
  'ios-developer': ['ios', 'swift', 'xcode', 'swiftui', 'uikit'],
  'harmony-developer': ['harmony', '鸿蒙', 'arkts', 'arkui', 'stage'],
  'skills-monitor': ['监控', '分析', '使用率', 'skills', 'report']
};

function matchSkills(text) {
  const lowerText = text.toLowerCase();
  
  const results = Object.entries(SKILLS).map(([skill, keywords]) => {
    const hits = keywords.filter(k => lowerText.includes(k.toLowerCase()));
    return {
      skill,
      matched: hits.length,
      total: keywords.length,
      keywords: hits
    };
  }).sort((a, b) => b.matched - a.matched);

  return results;
}

module.exports = async (ctx) => {
  const { prompt } = ctx;
  
  const log = {
    timestamp: new Date().toISOString(),
    hook: 'user_prompt_submit',
    type: 'skill_analysis'
  };

  if (prompt) {
    // 分析应该使用哪个 skill
    log.analysis = matchSkills(prompt);
    
    // 选择最佳匹配
    const best = log.analysis.find(s => s.matched > 0);
    log.selected = best?.skill || 'default';
    log.rejected = log.analysis.filter(s => s.skill !== log.selected).map(s => s.skill);
    
    // 判断是否需要强制输出 SKILL_DECISION
    log.needDecision = !prompt.includes('[SKILL_DECISION]');
  }

  // 写入日志
  try {
    fs.appendFileSync(LOG_FILE, JSON.stringify(log) + '\n');
  } catch (e) {
    // ignore
  }

  console.log('[user_prompt_submit]', JSON.stringify(log, null, 2));
};

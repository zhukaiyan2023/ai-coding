/**
 * User Prompt Submit Hook - 通用版
 * 通用 skill 分析，不限于预设
 */

const fs = require('fs');
const path = require('path');

const LOG_FILE = path.join(__dirname, '../logs/hook-log.jsonl');
const SKILLS_DIR = path.join(__dirname, '../skills');

// 通用关键词映射
const KEYWORD_MAP = {
  // 语言/框架
  'java': 'java-developer',
  'spring': 'java-developer',
  'kotlin': 'kotlin-developer',
  'python': 'python-developer',
  'go': 'go-developer',
  'rust': 'rust-developer',
  'react': 'react-developer',
  'vue': 'vue-developer',
  'angular': 'angular-developer',
  'typescript': 'typescript-developer',
  'swift': 'ios-developer',
  'ios': 'ios-developer',
  'android': 'android-developer',
  'harmony': 'harmony-developer',
  'arkts': 'harmony-developer',
  'flutter': 'flutter-developer',
  
  // 任务类型
  '开发': 'developer',
  '开发': 'developer',
  'debug': 'debug',
  'bug': 'debug',
  '测试': 'test',
  'test': 'test',
  '优化': 'optimize',
  '性能': 'performance',
  'refactor': 'refactor',
  '重构': 'refactor',
  'review': 'review',
  '审查': 'review',
  
  // 通用技能
  'skill': 'skills-monitor',
  '分析': 'analysis',
  'report': 'analysis'
};

function detectSkills(text) {
  const lowerText = text.toLowerCase();
  const detected = new Set();
  
  for (const [keyword, skill] of Object.entries(KEYWORD_MAP)) {
    if (lowerText.includes(keyword)) {
      detected.add(skill);
    }
  }
  
  return [...detected];
}

function analyzeWithSkillsDir(text) {
  const results = [];
  
  try {
    const files = fs.readdirSync(SKILLS_DIR);
    for (const file of files) {
      if (file.endsWith('.md')) {
        const skillName = file.replace('.md', '');
        const content = fs.readFileSync(path.join(SKILLS_DIR, file), 'utf-8');
        
        // 简单关键词匹配
        const keywords = [
          skillName,
          ...skillName.split('-')
        ];
        
        const hits = keywords.filter(k => 
          text.toLowerCase().includes(k.toLowerCase())
        );
        
        if (hits.length > 0) {
          results.push({
            skill: skillName,
            score: hits.length
          });
        }
      }
    }
  } catch (e) {
    // ignore
  }
  
  return results.sort((a, b) => b.score - a.score);
}

module.exports = async (ctx) => {
  const { prompt } = ctx;
  
  const log = {
    timestamp: new Date().toISOString(),
    hook: 'user_prompt_submit',
    type: 'skill_detection'
  };

  if (prompt) {
    // 方法1: 通用关键词检测
    log.keywordBased = detectSkills(prompt);
    
    // 方法2: 基于 skills 目录检测
    log.dirBased = analyzeWithSkillsDir(prompt);
    
    // 合并结果
    const allSkills = [...new Set([
      ...log.keywordBased,
      ...log.dirBased.map(s => s.skill)
    ])];
    
    log.detectedSkills = allSkills;
    log.primarySkill = allSkills[0] || null;
    
    // 判断是否需要 SKILL_DECISION
    log.needDecision = !prompt.includes('[SKILL_DECISION]');
  }

  // 写入日志
  try {
    fs.appendFileSync(LOG_FILE, JSON.stringify(log) + '\n');
  } catch (e) {
    // ignore
  }

  console.log('[user_prompt_submit] detected:', log.detectedSkills?.join(', ') || 'none');
};

/**
 * Pre Tool Use Hook - 通用版
 * 自动检测项目中的所有skills并分析决策
 */

const fs = require('fs');
const path = require('path');

const LOG_FILE = path.join(__dirname, '../logs/hook-log.jsonl');
const SKILLS_DIR = path.join(__dirname, '../skills');

// 自动扫描 skills 目录
function scanSkills() {
  const skills = [];
  
  try {
    const files = fs.readdirSync(SKILLS_DIR);
    for (const file of files) {
      if (file.endsWith('.md')) {
        const skillName = file.replace('.md', '');
        const content = fs.readFileSync(path.join(SKILLS_DIR, file), 'utf-8');
        
        // 提取关键词 (从 description 和标题)
        const keywords = extractKeywords(content, skillName);
        
        skills.push({
          name: skillName,
          keywords
        });
      }
    }
  } catch (e) {
    // skills 目录不存在，使用默认
  }
  
  return skills;
}

function extractKeywords(content, skillName) {
  const keywords = [skillName];
  
  // 从标题提取
  const titleMatch = content.match(/^#\s+Skill:\s+(.+)$/m);
  if (titleMatch) {
    keywords.push(...titleMatch[1].toLowerCase().split(/\s+/));
  }
  
  // 从描述提取
  const descMatch = content.match(/##\s+描述\n(.+)/);
  if (descMatch) {
    keywords.push(...descMatch[1].toLowerCase().split(/\s+/));
  }
  
  // 过滤并去重
  return [...new Set(keywords.filter(k => k.length > 2))];
}

function matchSkills(text, skills) {
  const lowerText = text.toLowerCase();
  
  return skills.map(skill => {
    const hits = skill.keywords.filter(k => lowerText.includes(k.toLowerCase()));
    return {
      skill: skill.name,
      matched: hits.length,
      keywords: hits
    };
  }).sort((a, b) => b.matched - a.matched);
}

module.exports = async (ctx) => {
  const { toolName, input } = ctx;
  
  const log = {
    timestamp: new Date().toISOString(),
    hook: 'pre_tool_use',
    toolName,
    type: 'skill_analysis'
  };

  // 自动扫描 skills
  const skills = scanSkills();
  log.scannedSkills = skills.map(s => s.name);

  // 分析 skill 匹配
  if (input && (input.prompt || input.message)) {
    const text = input.prompt || input.message;
    log.analysis = matchSkills(text, skills);
    log.selected = log.analysis.find(s => s.matched > 0)?.skill || null;
    log.rejected = log.analysis.filter(s => s.matched === 0).map(s => s.skill);
  }

  // 写入日志
  try {
    fs.appendFileSync(LOG_FILE, JSON.stringify(log) + '\n');
  } catch (e) {
    console.error('[pre_tool_use] Failed to write log:', e.message);
  }

  console.log('[pre_tool_use] skill analysis:', log.selected || 'none');
};

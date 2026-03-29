/**
 * User Prompt Submit Hook - 通用版
 * 自动扫描 .claude/skills/ 目录检测匹配的 skill
 */

const fs = require('fs');
const path = require('path');

const LOG_FILE = path.join(__dirname, '../logs/hook-log.jsonl');
const SKILLS_DIR = path.join(__dirname, '../skills');

function analyzeWithSkillsDir(text) {
  const results = [];

  try {
    const files = fs.readdirSync(SKILLS_DIR);
    for (const file of files) {
      if (file.endsWith('.md')) {
        const skillName = file.replace('.md', '');
        const content = fs.readFileSync(path.join(SKILLS_DIR, file), 'utf-8');

        // 提取 skill 名称和描述中的关键词进行匹配
        const keywords = new Set([
          skillName,
          ...skillName.split('-'),
          ...skillName.split('_')
        ]);

        // 从描述中提取额外关键词
        const descMatch = content.match(/##\s*描述\n(.+)/i);
        if (descMatch) {
          descMatch[1].toLowerCase().split(/\s+/).forEach(w => {
            if (w.length > 2) keywords.add(w);
          });
        }

        const lowerText = text.toLowerCase();
        const hits = [...keywords].filter(k =>
          k.length > 2 && lowerText.includes(k.toLowerCase())
        );

        if (hits.length > 0) {
          results.push({
            skill: skillName,
            score: hits.length,
            matchedKeywords: hits
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
    type: 'skill_detection',
    prompt: prompt || null,
    promptLength: prompt?.length || 0
  };

  if (prompt) {
    // 基于 skills 目录检测
    log.detectedSkills = analyzeWithSkillsDir(prompt);
    log.primarySkill = log.detectedSkills[0]?.skill || null;

    // 判断是否需要 SKILL_DECISION
    log.needDecision = !prompt.includes('[SKILL_DECISION]');
  } else {
    log.detectedSkills = [];
    log.primarySkill = null;
    log.needDecision = false;
  }

  // 写入日志（无论有无 prompt）
  try {
    fs.appendFileSync(LOG_FILE, JSON.stringify(log) + '\n');
  } catch (e) {
    console.error('[user_prompt_submit] Failed to write log:', e.message);
  }

  console.log('[user_prompt_submit] detected:', log.detectedSkills?.map(s => s.skill).join(', ') || 'none');
};

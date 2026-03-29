/**
 * User Prompt Submit Hook
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

        const keywords = new Set([
          skillName,
          ...skillName.split('-'),
          ...skillName.split('_')
        ]);

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

function readStdin() {
  return new Promise((resolve) => {
    let data = '';
    process.stdin.setEncoding('utf8');
    process.stdin.on('readable', () => {
      let chunk;
      while ((chunk = process.stdin.read()) !== null) {
        data += chunk;
      }
    });
    process.stdin.on('end', () => resolve(data));
    setTimeout(() => resolve(''), 100);
  });
}

async function runHook(ctx) {
  // Claude Code passes ctx via stdin when called as subprocess
  if (!ctx || (typeof ctx === 'object' && Object.keys(ctx).length === 0)) {
    try {
      const stdinData = await readStdin();
      if (stdinData.trim()) {
        ctx = JSON.parse(stdinData);
      }
    } catch (e) {
      // ignore parse errors
    }
  }

  const prompt = ctx?.prompt || null;

  const log = {
    timestamp: new Date().toISOString(),
    hook: 'user_prompt_submit',
    type: 'skill_detection',
    prompt,
    promptLength: prompt?.length || 0
  };

  if (prompt) {
    log.detectedSkills = analyzeWithSkillsDir(prompt);
    log.primarySkill = log.detectedSkills[0]?.skill || null;
    log.needDecision = !prompt.includes('[SKILL_DECISION]');
  } else {
    log.detectedSkills = [];
    log.primarySkill = null;
    log.needDecision = false;
  }

  try {
    fs.appendFileSync(LOG_FILE, JSON.stringify(log) + '\n');
  } catch (e) {
    console.error('[user_prompt_submit] Failed to write log:', e.message);
  }

  console.log('[user_prompt_submit] detected:', log.detectedSkills?.map(s => s.skill).join(', ') || 'none');
}

module.exports = runHook;

// 直接运行时
if (require.main === module) {
  readStdin().then(stdinData => {
    const ctx = stdinData.trim() ? JSON.parse(stdinData) : {};
    runHook(ctx);
  });
}

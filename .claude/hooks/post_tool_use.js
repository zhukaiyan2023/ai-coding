/**
 * Post Tool Use Hook
 * 自动检测规则命中情况
 */

const fs = require('fs');
const path = require('path');

const LOG_FILE = path.join(__dirname, '../logs/hook-log.jsonl');
const SKILLS_DIR = path.join(__dirname, '../skills');

function scanRules() {
  const rules = [];

  try {
    const files = fs.readdirSync(SKILLS_DIR);
    for (const file of files) {
      if (file.endsWith('.md')) {
        const skillName = file.replace('.md', '');
        const content = fs.readFileSync(path.join(SKILLS_DIR, file), 'utf-8');
        const skillRules = extractRules(content, skillName);
        rules.push({ skill: skillName, rules: skillRules });
      }
    }
  } catch (e) {
    // ignore
  }

  return rules;
}

function extractRules(content, skillName) {
  const rules = [];

  const checklistMatches = content.match(/- \[ \].+/g) || [];
  for (const match of checklistMatches) {
    const rule = match.replace('- [ ]', '').trim();
    rules.push({ type: 'checklist', rule, keyword: rule.toLowerCase() });
  }

  const annotationMatches = content.match(/@[A-Z][a-zA-Z]+/g) || [];
  for (const match of [...new Set(annotationMatches)]) {
    rules.push({ type: 'annotation', rule: match, keyword: match.toLowerCase() });
  }

  return rules;
}

function analyzeRuleHits(output, rulesData) {
  const hits = [];
  const missed = [];

  const lowerOutput = output.toLowerCase();

  for (const skillData of rulesData) {
    for (const rule of skillData.rules) {
      const hit = lowerOutput.includes(rule.keyword);
      if (hit) {
        hits.push({ skill: skillData.skill, rule: rule.rule, type: rule.type });
      } else {
        missed.push({ skill: skillData.skill, rule: rule.rule, type: rule.type });
      }
    }
  }

  return { hits, missed };
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

  const { tool_name: toolName, tool_response: output } = ctx;

  const log = {
    timestamp: new Date().toISOString(),
    hook: 'post_tool_use',
    toolName,
    type: 'rule_analysis'
  };

  const rulesData = scanRules();

  if (output && typeof output === 'string') {
    if (output.includes('[SKILL_DECISION]')) {
      log.type = 'skill_decision';
      log.hasDecision = true;
    }

    const { hits, missed } = analyzeRuleHits(output, rulesData);
    log.ruleHits = hits.slice(0, 10);
    log.ruleMissed = missed.slice(0, 10);
    log.hitCount = hits.length;
    log.missCount = missed.length;
  }

  try {
    fs.appendFileSync(LOG_FILE, JSON.stringify(log) + '\n');
  } catch (e) {
    console.error('[post_tool_use] Failed to write log:', e.message);
  }

  console.log('[post_tool_use] rules hit:', log.hitCount || 0, 'missed:', log.missCount || 0);
}

module.exports = runHook;

// 直接运行时
if (require.main === module) {
  readStdin().then(stdinData => {
    const ctx = stdinData.trim() ? JSON.parse(stdinData) : {};
    runHook(ctx);
  });
}

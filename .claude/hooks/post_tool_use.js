/**
 * Post Tool Use Hook - 通用版
 * 自动检测规则命中情况
 */

const fs = require('fs');
const path = require('path');

const LOG_FILE = path.join(__dirname, '../logs/hook-log.jsonl');
const SKILLS_DIR = path.join(__dirname, '../skills');

// 自动扫描 skills 中的规则
function scanRules() {
  const rules = [];
  
  try {
    const files = fs.readdirSync(SKILLS_DIR);
    for (const file of files) {
      if (file.endsWith('.md')) {
        const skillName = file.replace('.md', '');
        const content = fs.readFileSync(path.join(SKILLS_DIR, file), 'utf-8');
        
        // 提取规则 (从检查清单、规范等)
        const skillRules = extractRules(content, skillName);
        rules.push({
          skill: skillName,
          rules: skillRules
        });
      }
    }
  } catch (e) {
    // ignore
  }
  
  return rules;
}

function extractRules(content, skillName) {
  const rules = [];
  
  // 从检查清单提取
  const checklistMatches = content.match(/- \[ \].+/g) || [];
  for (const match of checklistMatches) {
    const rule = match.replace('- [ ]', '').trim();
    rules.push({
      type: 'checklist',
      rule,
      keyword: rule.toLowerCase()
    });
  }
  
  // 从代码示例提取 (如 @NotBlank, @Component 等)
  const annotationMatches = content.match(/@[A-Z][a-zA-Z]+/g) || [];
  for (const match of [...new Set(annotationMatches)]) {
    rules.push({
      type: 'annotation',
      rule: match,
      keyword: match.toLowerCase()
    });
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
        hits.push({
          skill: skillData.skill,
          rule: rule.rule,
          type: rule.type
        });
      } else {
        missed.push({
          skill: skillData.skill,
          rule: rule.rule,
          type: rule.type
        });
      }
    }
  }
  
  return { hits, missed };
}

module.exports = async (ctx) => {
  const { toolName, output } = ctx;
  
  const log = {
    timestamp: new Date().toISOString(),
    hook: 'post_tool_use',
    toolName,
    type: 'rule_analysis'
  };

  // 扫描规则
  const rulesData = scanRules();
  
  if (output && typeof output === 'string') {
    // 检查 SKILL_DECISION
    if (output.includes('[SKILL_DECISION]')) {
      log.type = 'skill_decision';
      log.hasDecision = true;
    }
    
    // 分析规则命中
    const { hits, missed } = analyzeRuleHits(output, rulesData);
    log.ruleHits = hits.slice(0, 10);  // 最多10个
    log.ruleMissed = missed.slice(0, 10);
    log.hitCount = hits.length;
    log.missCount = missed.length;
  }

  // 写入日志
  try {
    fs.appendFileSync(LOG_FILE, JSON.stringify(log) + '\n');
  } catch (e) {
    // ignore
  }

  console.log('[post_tool_use] rules hit:', log.hitCount || 0, 'missed:', log.missCount || 0);
};

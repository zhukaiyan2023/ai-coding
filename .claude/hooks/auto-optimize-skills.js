/**
 * Auto Optimize Skills Script
 * 根据使用情况自动优化 skills 配置
 *
 * 用法:
 *   node auto-optimize-skills.js --dry-run    # 预览优化
 *   node auto-optimize-skills.js --apply     # 执行优化
 */

const fs = require('fs');
const path = require('path');

const LOG_FILE = path.join(__dirname, '../logs/hook-log.jsonl');
const REPORT_FILE = path.join(__dirname, '../logs/skills-usage-report.json');
const SKILLS_DIR = path.join(__dirname, '../skills');
const SETTINGS_FILE = path.join(__dirname, '../settings.local.json');

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run') || !args.includes('--apply');

function readReport() {
  try {
    const content = fs.readFileSync(REPORT_FILE, 'utf-8');
    return JSON.parse(content);
  } catch (e) {
    return null;
  }
}

function getAllSkills() {
  const skills = [];
  try {
    const files = fs.readdirSync(SKILLS_DIR);
    for (const file of files) {
      if (file.endsWith('.md')) {
        const skillPath = path.join(SKILLS_DIR, file);
        const content = fs.readFileSync(skillPath, 'utf-8');
        skills.push({
          name: file.replace('.md', ''),
          path: skillPath,
          content,
          size: content.length
        });
      }
    }
  } catch (e) {
    // ignore
  }
  return skills;
}

function analyzeOptimization(report, skills) {
  const suggestions = [];

  if (!report) {
    suggestions.push({
      type: 'error',
      message: 'No usage report found. Run analyze-skills-usage.js first.'
    });
    return suggestions;
  }

  const { summary, skillUsage } = report;

  // 1. 检查未使用的 skills
  for (const skillName of summary.skillsUnused || []) {
    const skill = skills.find(s => s.name === skillName);
    if (skill) {
      suggestions.push({
        type: 'warning',
        category: 'unused',
        skill: skillName,
        message: `Skill "${skillName}" is never used (0 detections)`,
        action: skill.size < 1000 ? 'consider_delete' : 'consider_disable',
        reason: skill.size < 1000
          ? 'Small skill file, low value to keep'
          : 'Large skill file, may need better keyword detection'
      });
    }
  }

  // 2. 检查低命中率的 skills
  for (const [skillName, usage] of Object.entries(skillUsage)) {
    if (usage.detected > 0 && usage.hitRate < 0.3) {
      suggestions.push({
        type: 'warning',
        category: 'low_hit_rate',
        skill: skillName,
        message: `Skill "${skillName}" has low hit rate: ${(usage.hitRate * 100).toFixed(1)}%`,
        action: 'improve_keywords',
        hitRate: usage.hitRate,
        hitCount: usage.hitCount,
        missCount: usage.missCount
      });
    }
  }

  // 3. 检查高价值但未选中的 skills
  for (const [skillName, usage] of Object.entries(skillUsage)) {
    if (usage.detected > 2 && usage.selected === 0) {
      suggestions.push({
        type: 'info',
        category: 'not_selected',
        skill: skillName,
        message: `Skill "${skillName}" detected ${usage.detected} times but never selected`,
        action: 'check_rejection_reason',
        detected: usage.detected,
        selected: usage.selected
      });
    }
  }

  // 4. 检查 SKILL_DECISION 缺失
  if (summary.decisionRate < 0.5) {
    suggestions.push({
      type: 'warning',
      category: 'low_decision_rate',
      message: `SKILL_DECISION output rate is only ${(summary.decisionRate * 100).toFixed(1)}%`,
      action: 'remind_decision_output',
      decisionRate: summary.decisionRate
    });
  }

  // 5. 建议添加缺失的 skill
  const detectedSkills = new Set([
    ...(summary.skillsUsed || []),
    ...Object.keys(skillUsage || {}).filter(k => skillUsage[k].detected > 0)
  ]);

  // 6. 检查 skills 目录完整性
  if (skills.length === 0) {
    suggestions.push({
      type: 'error',
      category: 'no_skills',
      message: 'No skills found in .claude/skills/',
      action: 'create_skills'
    });
  }

  return suggestions;
}

function applyOptimizations(suggestions, skills) {
  const applied = [];
  const errors = [];

  for (const suggestion of suggestions) {
    if (suggestion.action === 'consider_delete' && !dryRun) {
      const skill = skills.find(s => s.name === suggestion.skill);
      if (skill) {
        try {
          const backupPath = skill.path + '.bak';
          fs.renameSync(skill.path, backupPath);
          applied.push({
            skill: suggestion.skill,
            action: 'renamed_to_backup',
            from: skill.path,
            to: backupPath
          });
        } catch (e) {
          errors.push({
            skill: suggestion.skill,
            error: e.message
          });
        }
      }
    }

    if (suggestion.action === 'improve_keywords' && !dryRun) {
      // 添加更多关键词到 skill 文件
      const skill = skills.find(s => s.name === suggestion.skill);
      if (skill && !skill.content.includes('## 触发条件')) {
        const triggerSection = `

---

## 触发条件

> 当用户请求涉及以下关键词时，自动选择此 skill：

- ${suggestion.skill.replace('-', ' ')}
${suggestion.skill.split('-').join(' ')}

`;
        const newContent = skill.content.replace(
          /(\n---\n\n## SKILL_DECISION)/,
          triggerSection + '$1'
        );
        try {
          fs.writeFileSync(skill.path, newContent);
          applied.push({
            skill: suggestion.skill,
            action: 'added_trigger_keywords'
          });
        } catch (e) {
          errors.push({
            skill: suggestion.skill,
            error: e.message
          });
        }
      }
    }
  }

  return { applied, errors };
}

function main() {
  console.log(dryRun ? '=== DRY RUN - No changes will be made ===\n' : '=== APPLY MODE - Changes will be made ===\n');

  const report = readReport();
  const skills = getAllSkills();

  console.log('Current Skills:', skills.map(s => s.name).join(', '));
  console.log('');

  const suggestions = analyzeOptimization(report, skills);

  if (suggestions.length === 0) {
    console.log('No optimization suggestions.');
    return;
  }

  console.log('Optimization Suggestions:\n');
  for (const s of suggestions) {
    const icon = s.type === 'error' ? '❌' : s.type === 'warning' ? '⚠️' : 'ℹ️';
    console.log(`${icon} [${s.category}] ${s.message}`);
    if (s.action) {
      console.log(`   Action: ${s.action}`);
    }
    console.log('');
  }

  if (dryRun) {
    console.log('Run with --apply to execute these optimizations.');
  } else {
    const { applied, errors } = applyOptimizations(suggestions, skills);
    console.log('\nApplied changes:');
    for (const a of applied) {
      console.log(`  ✓ ${a.skill}: ${a.action}`);
    }
    if (errors.length > 0) {
      console.log('\nErrors:');
      for (const e of errors) {
        console.log(`  ✗ ${e.skill}: ${e.error}`);
      }
    }
  }
}

main();

/**
 * Skills Usage Analyzer
 * 分析 hook 日志，生成 skills 使用报告 (JSON 格式)
 */

const fs = require('fs');
const path = require('path');

const LOG_FILE = path.join(__dirname, '../logs/hook-log.jsonl');
const SKILLS_DIR = path.join(__dirname, '../skills');

function readLogs() {
  const logs = [];
  try {
    const content = fs.readFileSync(LOG_FILE, 'utf-8');
    const lines = content.trim().split('\n');
    for (const line of lines) {
      if (line.trim()) {
        try {
          logs.push(JSON.parse(line));
        } catch (e) {
          // ignore invalid JSON lines
        }
      }
    }
  } catch (e) {
    console.error('Error reading logs:', e.message);
    return [];
  }
  return logs;
}

function getAllSkills() {
  const skills = [];
  try {
    const files = fs.readdirSync(SKILLS_DIR);
    for (const file of files) {
      if (file.endsWith('.md')) {
        skills.push(file.replace('.md', ''));
      }
    }
  } catch (e) {
    // ignore
  }
  return skills;
}

function analyzeLogs(logs) {
  const allSkills = getAllSkills();

  // 统计数据结构
  const stats = {
    totalSessions: 0,
    skillsUsed: new Set(),
    skillsUnused: new Set(allSkills),
    decisionRate: { yes: 0, no: 0 },
    skillUsage: {},
    ruleHits: {},
    sessions: []
  };

  // 初始化 skill 统计
  for (const skill of allSkills) {
    stats.skillUsage[skill] = {
      detected: 0,
      selected: 0,
      hitCount: 0,
      missCount: 0,
      hitRate: 0
    };
  }

  // 按 session_id 分组（如果存在）
  const sessionMap = new Map();

  for (const log of logs) {
    const sessionId = log.session_id || 'unknown';

    if (!sessionMap.has(sessionId)) {
      sessionMap.set(sessionId, {
        id: sessionId,
        detectedSkills: [],
        selectedSkill: null,
        decisions: [],
        ruleHits: []
      });
      stats.totalSessions++;
    }

    const session = sessionMap.get(sessionId);

    // user_prompt_submit: 检测到的 skills
    if (log.hook === 'user_prompt_submit' && log.detectedSkills) {
      for (const skill of log.detectedSkills) {
        session.detectedSkills.push(skill);
        if (stats.skillUsage[skill]) {
          stats.skillUsage[skill].detected++;
        }
        stats.skillsUsed.add(skill);
        stats.skillsUnused.delete(skill);
      }
    }

    // pre_tool_use: 选中的 skill
    if (log.hook === 'pre_tool_use' && log.selected) {
      session.selectedSkill = log.selected;
      if (stats.skillUsage[log.selected]) {
        stats.skillUsage[log.selected].selected++;
      }
    }

    // post_tool_use: SKILL_DECISION 和规则命中
    if (log.hook === 'post_tool_use') {
      if (log.hasDecision) {
        stats.decisionRate.yes++;
        session.decisions.push('hasDecision');
      } else {
        stats.decisionRate.no++;
      }

      if (log.ruleHits) {
        for (const hit of log.ruleHits) {
          session.ruleHits.push(hit);
          if (!stats.ruleHits[hit.skill]) {
            stats.ruleHits[hit.skill] = { hits: 0, misses: 0 };
          }
          stats.ruleHits[hit.skill].hits++;
          if (stats.skillUsage[hit.skill]) {
            stats.skillUsage[hit.skill].hitCount++;
          }
        }
      }

      if (log.ruleMissed) {
        for (const miss of log.ruleMissed) {
          if (!stats.ruleHits[miss.skill]) {
            stats.ruleHits[miss.skill] = { hits: 0, misses: 0 };
          }
          stats.ruleHits[miss.skill].misses++;
          if (stats.skillUsage[miss.skill]) {
            stats.skillUsage[miss.skill].missCount++;
          }
        }
      }
    }
  }

  // 计算命中率
  for (const skill of Object.keys(stats.skillUsage)) {
    const s = stats.skillUsage[skill];
    const total = s.hitCount + s.missCount;
    s.hitRate = total > 0 ? (s.hitCount / total) : 0;
  }

  // 转换为数组和统计
  const totalDecisions = stats.decisionRate.yes + stats.decisionRate.no;

  return {
    summary: {
      totalSessions: stats.totalSessions,
      totalLogs: logs.length,
      skillsAvailable: allSkills.length,
      skillsUsed: [...stats.skillsUsed],
      skillsUnused: [...stats.skillsUnused],
      decisionRate: totalDecisions > 0 ? stats.decisionRate.yes / totalDecisions : 0
    },
    skillUsage: stats.skillUsage,
    ruleHits: stats.ruleHits,
    sessions: [...sessionMap.values()].slice(0, 50) // 限制返回数量
  };
}

function main() {
  console.log('Analyzing skills usage...\n');

  const logs = readLogs();

  if (logs.length === 0) {
    console.log('No logs found. Run some tasks first to generate usage data.');
    console.log('Logs file:', LOG_FILE);
    process.exit(0);
  }

  const report = analyzeLogs(logs);

  // 输出 JSON 报告
  console.log(JSON.stringify(report, null, 2));

  // 同时写入报告文件
  const reportFile = path.join(__dirname, '../logs/skills-usage-report.json');
  fs.writeFileSync(reportFile, JSON.stringify(report, null, 2));
  console.log('\nReport saved to:', reportFile);
}

main();

/**
 * Stop Hook
 * Claude 停止时触发 - 生成会话总结
 */

const fs = require('fs');
const path = require('path');

const LOG_FILE = path.join(__dirname, '../logs/hook-log.jsonl');
const REPORT_FILE = path.join(__dirname, '../logs/skills-usage-report.json');

function generateSummary() {
  const summary = {
    timestamp: new Date().toISOString(),
    type: 'session_summary'
  };

  try {
    if (fs.existsSync(REPORT_FILE)) {
      const report = JSON.parse(fs.readFileSync(REPORT_FILE, 'utf-8'));
      summary.skillsUsed = report.summary?.skillsUsed || [];
      summary.skillsUnused = report.summary?.skillsUnused || [];
      summary.decisionRate = report.summary?.decisionRate || 0;
      summary.totalSessions = report.summary?.totalSessions || 0;
    }
  } catch (e) {
    // ignore
  }

  return summary;
}

module.exports = async (ctx) => {
  const stopReason = ctx?.stopReason || 'unknown';
  const log = {
    timestamp: new Date().toISOString(),
    hook: 'stop',
    type: 'session_end',
    stopReason,
    summary: generateSummary()
  };

  try {
    fs.appendFileSync(LOG_FILE, JSON.stringify(log) + '\n');
  } catch (e) {
    // ignore
  }

  console.log('[stop] Session ended. Reason:', stopReason);
  console.log('[stop] Skills used:', log.summary.skillsUsed?.join(', ') || 'none');
};

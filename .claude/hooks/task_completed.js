/**
 * Task Completed Hook
 * 任务完成时触发 - 任务耗时统计
 */

const fs = require('fs');
const path = require('path');

const LOG_FILE = path.join(__dirname, '../logs/hook-log.jsonl');

module.exports = async (ctx) => {
  const { task_id: taskId, task_description: description, duration_ms: durationMs } = ctx;

  const log = {
    timestamp: new Date().toISOString(),
    hook: 'task_completed',
    type: 'task_tracking',
    taskId,
    description: description?.substring(0, 300),
    durationMs
  };

  try {
    fs.appendFileSync(LOG_FILE, JSON.stringify(log) + '\n');
  } catch (e) {
    // ignore
  }

  console.log('[task_completed]', taskId, '- Duration:', durationMs, 'ms');
};

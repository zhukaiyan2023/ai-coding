/**
 * Post Tool Use Failure Hook
 * 工具执行失败时触发 - 错误追踪
 */

const fs = require('fs');
const path = require('path');

const LOG_FILE = path.join(__dirname, '../logs/hook-log.jsonl');

module.exports = async (ctx) => {
  const { tool_name: toolName, tool_input: input, error } = ctx;

  const log = {
    timestamp: new Date().toISOString(),
    hook: 'post_tool_use_failure',
    type: 'error_tracking',
    toolName,
    input: input ? {
      file_path: input.file_path,
      command: input.command,
      content_preview: input.content?.substring(0, 100)
    } : null,
    error: error?.substring(0, 500)
  };

  try {
    fs.appendFileSync(LOG_FILE, JSON.stringify(log) + '\n');
  } catch (e) {
    // ignore
  }

  console.log('[post_tool_use_failure]', toolName, '-', error?.substring(0, 50));
};

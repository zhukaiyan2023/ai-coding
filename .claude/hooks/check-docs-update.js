/**
 * Check Docs Update Hook
 * 检测代码变更后是否更新了对应文档
 */

const fs = require('fs');
const path = require('path');

const LOG_FILE = path.join(__dirname, '../logs/hook-log.jsonl');

function findRelatedDocs(filePath) {
  const related = [];
  const ext = path.extname(filePath);
  const basename = path.basename(filePath, ext);

  // 常见文档路径模式
  const docPatterns = [
    `${basename}.md`,
    `${basename}/README.md`,
    `docs/${basename}.md`,
    `docs/${basename}/README.md`,
    `../${basename}.md`,
    `../docs/${basename}.md`
  ];

  const dir = path.dirname(filePath);

  for (const pattern of docPatterns) {
    const docPath = path.join(dir, pattern);
    if (fs.existsSync(docPath)) {
      related.push(docPath);
    }
  }

  return related;
}

function checkDocUpdated(filePath, toolOutput) {
  const docs = findRelatedDocs(filePath);
  if (docs.length === 0) return null;

  // 检查输出中是否提到更新文档
  const outputLower = (toolOutput || '').toLowerCase();
  const mentions = docs.filter(d =>
    outputLower.includes(path.basename(d).toLowerCase())
  );

  return {
    file: filePath,
    relatedDocs: docs,
    mentioned: mentions.length > 0,
    needsUpdate: docs.length > 0 && mentions.length === 0
  };
}

module.exports = async (ctx) => {
  const { tool_name: toolName, tool_input: input, tool_response: output } = ctx;

  // 只检查 Write/Edit 操作的代码文件
  if (!['Write', 'Edit'].includes(toolName)) return;

  const filePath = input?.file_path;
  if (!filePath) return;

  // 跳过文档和配置文件
  const skipExts = ['.md', '.json', '.yaml', '.yml', '.txt', '.lock'];
  if (skipExts.includes(path.extname(filePath))) return;

  const result = checkDocUpdated(filePath, output);

  const log = {
    timestamp: new Date().toISOString(),
    hook: 'check_docs_update',
    type: 'documentation',
    result
  };

  try {
    fs.appendFileSync(LOG_FILE, JSON.stringify(log) + '\n');
  } catch (e) {
    // ignore
  }

  if (result?.needsUpdate) {
    console.log('[check_docs_update] ⚠️', path.basename(filePath), '- related docs not mentioned');
  }
};

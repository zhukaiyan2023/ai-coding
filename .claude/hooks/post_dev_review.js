/**
 * Post Dev Hook - 开发后自动 Review
 *
 * 在代码生成后自动触发：
 * 1. Code Review
 * 2. 自动修复（如果有问题）
 * 3. 循环直到 Review 通过
 */

const fs = require('fs');
const path = require('path');

const LOG_FILE = path.join(__dirname, '../logs/hook-log.jsonl');

// 代码生成工具
const CODE_WRITE_TOOLS = ['Write', 'Edit', 'Bash'];

// Review 发现的问题级别
const ISSUE_LEVELS = {
  BLOCKER: '🔴 Blocker',
  CRITICAL: '🟠 Critical',
  MAJOR: '🟡 Major',
  MINOR: '🔵 Minor'
};

function detectCodeChanges(output) {
  if (!output || typeof output !== 'string') return false;

  // 检测是否有代码写入
  const codeIndicators = [
    'created',
    'modified',
    'wrote',
    'updated',
    '.java',
    '.ts',
    '.js',
    '.py',
    '.go'
  ];

  return codeIndicators.some(indicator =>
    output.toLowerCase().includes(indicator.toLowerCase())
  );
}

function parseReviewOutput(output) {
  const issues = {
    blocker: 0,
    critical: 0,
    major: 0,
    minor: 0
  };

  if (!output) return issues;

  // 解析 Review 输出中的问题计数
  const blockerMatch = output.match(/🔴\s*Blocker[:\s]*(\d+)/i);
  const criticalMatch = output.match(/🟠\s*Critical[:\s]*(\d+)/i);
  const majorMatch = output.match(/🟡\s*Major[:\s]*(\d+)/i);
  const minorMatch = output.match(/🔵\s*Minor[:\s]*(\d+)/i);

  if (blockerMatch) issues.blocker = parseInt(blockerMatch[1]);
  if (criticalMatch) issues.critical = parseInt(criticalMatch[1]);
  if (majorMatch) issues.major = parseInt(majorMatch[1]);
  if (minorMatch) issues.minor = parseInt(minorMatch[1]);

  return issues;
}

function shouldAutoFix(issues) {
  // 如果有 Blocker 或 Critical 问题，应该自动修复
  return issues.blocker > 0 || issues.critical > 0;
}

function isReviewPassed(issues) {
  // Review 通过条件：无 Blocker，Critical <= 2
  return issues.blocker === 0 && issues.critical <= 2;
}

function getLoopCount(ctx) {
  // 从上下文获取循环次数
  return ctx.loopCount || 0;
}

function incrementLoopCount(ctx) {
  ctx.loopCount = getLoopCount(ctx) + 1;
  return ctx.loopCount;
}

module.exports = async (ctx) => {
  const { tool_name: toolName, tool_response: output } = ctx;

  const log = {
    timestamp: new Date().toISOString(),
    hook: 'post_dev_review',
    toolName,
    type: 'auto_review'
  };

  // 检查是否是代码写入操作
  const isCodeWrite = CODE_WRITE_TOOLS.includes(toolName);
  log.isCodeWrite = isCodeWrite;

  if (!isCodeWrite) {
    return;
  }

  // 检测是否有代码变更
  const hasCodeChanges = detectCodeChanges(output);
  log.hasCodeChanges = hasCodeChanges;

  if (!hasCodeChanges) {
    return;
  }

  log.codeChangesDetected = true;

  // 解析 Review 结果
  const issues = parseReviewOutput(output);
  log.issues = issues;
  log.loopCount = getLoopCount(ctx);

  // 判断是否需要修复
  const needsFix = shouldAutoFix(issues);
  const reviewPassed = isReviewPassed(issues);

  log.needsFix = needsFix;
  log.reviewPassed = reviewPassed;
  log.action = reviewPassed ? 'pass' : (needsFix ? 'fix_needed' : 'review_required');

  // 检查循环次数，防止无限循环
  const MAX_LOOPS = 3;
  const currentLoop = getLoopCount(ctx);

  if (currentLoop >= MAX_LOOPS) {
    log.action = 'max_loops_reached';
    log.message = `已达到最大自动修复次数 (${MAX_LOOPS})，请人工处理剩余问题。`;

    console.log('[post_dev_review] 警告:', log.message);
    return;
  }

  // 写入日志
  try {
    fs.appendFileSync(LOG_FILE, JSON.stringify(log) + '\n');
  } catch (e) {
    // ignore
  }

  // 输出建议
  if (reviewPassed) {
    console.log('[post_dev_review] ✅ Code Review 通过');
  } else if (needsFix) {
    console.log('[post_dev_review] ⚠️ 发现问题，建议执行: /ralph-loop fix');
    console.log('[post_dev_review] 问题统计:', issues);
  } else {
    console.log('[post_dev_review] 📝 请执行 Code Review: /pr-review-toolkit');
  }
};

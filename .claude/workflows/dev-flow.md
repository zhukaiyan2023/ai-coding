# 开发流水线 (Dev Flow)


> 多Agent协作的自动化开发流程

## 概述

本流程定义了一套完整的开发闭环：

```
需求 → 技术设计 → 功能开发 → Code Review → 自动修复 → 提交验证
              ↓                              ↑
         循环迭代直到通过                   闭环
```

## 流程阶段

### Step 1: 技术设计 (Technical Design)

触发条件：开始新功能开发时

执行方式：
```
/feature-dev technical-design
```

职责：
- 分析需求可行性
- 设计数据模型
- 定义 API 接口
- 评估技术风险
- 输出技术设计方案

### Step 2: 功能开发 (Implementation)

触发条件：技术设计通过后

执行方式：
```
/feature-dev implement
```

职责：
- 按照设计实现代码
- 保证代码可运行
- 控制复杂度
- 遵循项目规范

### Step 3: 代码评审 (Code Review)

触发条件：代码编写完成后

执行方式：
```
/pr-review-toolkit
```

职责：
- 检查空指针风险
- 检查 SQL 性能
- 检查并发问题
- 检查事务问题
- 检查安全漏洞
- 输出评审报告

### Step 4: 自动修复 (Auto Fix)

触发条件：Code Review 发现问题

执行方式：
```
/ralph-loop fix
```

或使用 commit-commands 的自动修复：
```
/commit --fix
```

职责：
- 修复 Review 发现的问题
- 不改变业务逻辑
- 保证代码通过编译
- 循环修复直到 Review 通过

### Step 5: 提交代码 (Commit)

触发条件：Review 通过后

执行方式：
```
/commit
```

或完整流程：
```
/commit-push-pr
```

职责：
- 规范提交信息
- 推送代码
- 创建 PR

## 自动化配置

### Hooks 自动触发

#### pre_tool_use Hook
在执行开发相关工具前自动检查：

```javascript
// .claude/hooks/pre_tool_use.js
const devCommands = ['Write', 'Edit', 'Bash', 'Write'];

function shouldAutoDesign(task) {
  // 检查是否需要先做技术设计
  return task.includes('implement') && !hasExistingDesign(task);
}

function shouldAutoReview(task) {
  // 检查是否需要自动 Review
  return devCommands.includes(task) && hasCodeChanges();
}
```

#### post_tool_use Hook
在代码生成后自动触发 Review：

```javascript
// .claude/hooks/post_tool_use.js
function onCodeGenerated() {
  // 1. 自动执行 Code Review
  run('/pr-review-toolkit');

  // 2. 如果有问题，自动修复
  if (hasIssues()) {
    run('/ralph-loop fix');
  }
}
```

## Agent 角色定义

| Agent | 职责 | 触发方式 |
|-------|------|----------|
| dev-agent | 技术设计 + 代码实现 | /feature-dev |
| review-agent | 代码评审 | /pr-review-toolkit |
| fix-agent | 自动修复 | /ralph-loop |
| security-agent | 安全检查 | /security-guidance |

## 使用场景

### 场景 1: 开发新功能

```
你: 实现一个订单创建接口，支持优惠券

系统自动执行:
1. feature-dev → 技术设计
2. feature-dev → 写代码
3. pr-review-toolkit → Code Review
4. ralph-loop → 修复问题
5. commit → 提交代码

你只做一件事: 提需求
```

### 场景 2: 优化旧代码

```
你: 优化这个Service，减少SQL查询次数

系统自动执行:
1. code-simplifier → 重构
2. pr-review-toolkit → 检查
3. ralph-loop → 修复
```

### 场景 3: 修 Bug

```
你: 这个接口偶尔超时，帮我分析并修复

系统自动执行:
1. 分析问题
2. 修改代码
3. pr-review-toolkit → Review
4. ralph-loop → 修复
```

## 工作目录结构

```
.claude/
├── workflows/          # 流程定义
│   └── dev-flow.md    # 本文件
├── agents/            # Agent 定义
│   ├── dev-agent.md
│   ├── review-agent.md
│   └── fix-agent.md
├── hooks/             # 自动化钩子
│   ├── pre_tool_use.js
│   └── post_tool_use.js
└── plugins/           # 插件配置
```

## 质量门禁

每个阶段都有质量检查：

| 阶段 | 质量门禁 | 检查项 |
|------|----------|--------|
| 技术设计 | design-review | 方案完整性、风险评估 |
| 代码实现 | code-quality | 复杂度、命名、规范 |
| Code Review | review-pass | 无阻塞性问题 |
| 修复 | fix-verified | 问题已解决 |
| 提交 | commit-msg | 符合 Conventional Commits |

## 循环机制

```
┌─────────────────────────────────────┐
│                                     │
│  ┌──────┐   Review   ┌────────┐    │
│  │ Code │ ────────→  │ Issues │    │
│  │ Write│            │ Found  │    │
│  └──────┘            └────────┘    │
│      ↑                    │        │
│      │      Fix           │        │
│      └────────────────────┘        │
│                                     │
│         Loop 直到 Review 通过       │
└─────────────────────────────────────┘
```

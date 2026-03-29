# AI Coding

> Claude Code 配置与多 Agent 开发工作流系统

[![CI](https://github.com/your-repo/ai-coding/actions/workflows/ci.yaml/badge.svg)](.github/workflows/ci.yaml)

## 目录

- [项目概述](#项目概述)
- [已安装插件](#已安装插件)
- [核心原理](#核心原理)
- [快速开始](#快速开始)
- [工作流程](#工作流程)
- [Skills 系统](#skills-系统)
- [质量门禁](#质量门禁)
- [常见问题](#常见问题)

---

## 项目概述

这是一个 **Claude Code 配置与多 Agent 开发工作流系统**，为 Claude Code 提供：

- **结构化开发流程** - 需求 → 技术设计 → 实现 → Code Review → 自动修复 → 提交
- **多平台支持** - Java/Spring Boot、React/iOS、HarmonyOS
- **自动化质量门禁** - Hooks 自动检查代码质量、复杂度、Lint
- **按需加载 Skills** - 根据任务类型自动匹配最佳 Skill

### 技术栈

| 平台 | 技术栈 |
|------|--------|
| Backend | Java 21, Spring Boot 4, MyBatis-Plus, Redis |
| Frontend | React, TypeScript, Vite |
| Mobile | iOS (Swift/UIKit), HarmonyOS (ArkTS) |
| Architecture | COLA DDD |

---

## 已安装插件

本项目使用以下 Claude Code 官方插件：

### 插件列表

| 插件 | 状态 | 用途 |
|------|------|------|
| `superpowers` | ✅ enabled | Superpowers Skills 最佳实践 |
| `feature-dev` | ✅ enabled | 功能开发工作流 |
| `pr-review-toolkit` | ✅ enabled | Pull Request 评审工具包 |
| `code-review` | ✅ enabled | 代码评审 |
| `code-simplifier` | ✅ enabled | 代码简化和重构 |
| `commit-commands` | ✅ enabled | Git 提交命令集 |
| `ralph-loop` | ✅ enabled | Ralph Loop 循环修复 |
| `security-guidance` | ✅ enabled | 安全指导 |
| `frontend-design` | ✅ enabled | 前端界面设计 |
| `claude-md-management` | ✅ enabled | CLAUDE.md 管理 |
| `jdtls-lsp` | ✅ enabled | Java 语言服务器协议 |
| `context7` | ⚠️ MCP failed | Context7 上下文增强 |

### 插件详情

#### superpowers

提供对齐 [superpowers](https://github.com/obra/superpowers) 最佳实践的 Skills 系统，包括：
- TDD 测试驱动开发
- 系统化调试四阶段法
- 代码评审流程

#### feature-dev

功能开发工作流，协调技术设计和代码实现。

```
触发: /feature-dev
```

#### pr-review-toolkit

Pull Request 评审工具包，自动化 Code Review 流程。

```
触发: /pr-review-toolkit
```

#### ralph-loop

Ralph Loop 循环修复，持续修复 Review 发现的问题直到通过。

```
触发: /ralph-loop fix
```

#### commit-commands

Git 提交命令集，支持规范提交、推送和 PR 创建。

```
触发: /commit, /commit-push-pr
```

#### code-simplifier

代码简化和重构工具，保持功能的同时提升代码质量。

#### code-review

代码评审插件，检查代码质量、安全性、性能等问题。

#### security-guidance

安全指导插件，提供安全编码建议和漏洞检测。

#### frontend-design

前端界面设计插件，创建高质量的 React/TypeScript 界面。

```
触发: /frontend-design
```

#### claude-md-management

CLAUDE.md 文件管理，支持审计和改进。

```
触发: /claude-md-improver
```

#### jdtls-lsp

Java 语言服务器协议支持，提供 Java 代码智能提示。

#### context7

Context7 上下文增强（注意：MCP 初始化失败，如需使用请检查配置）。

### 建议安装的工具

| 工具 | 用途 | 安装方式 |
|------|------|----------|
| ESLint | TypeScript/React Lint | `npm install -D eslint` |
| Prettier | 代码格式化 | `npm install -D prettier` |
| Checkstyle | Java 代码检查 | Maven/Gradle 插件 |
| SwiftLint | Swift 代码检查 | `brew install swiftlint` |
| Commitlint | Commit 格式验证 | `npm install -D @commitlint/{cli,config-conventional}` |

---

## 核心原理

### 1. Skills 按需加载机制

```
用户 Prompt
    │
    ▼
┌──────────────────────────────────────┐
│  user_prompt_submit Hook             │
│  自动扫描 .claude/skills/ 目录        │
│  提取关键词进行匹配                    │
└──────────────────────────────────────┘
    │
    ▼
匹配到的 Skill 列表（按分数排序）
    │
    ▼
加载优先级最高的 Skill 到 Context
```

### 2. Hooks 自动化检查

```
┌─────────────┐     ┌─────────────────┐     ┌──────────────┐
│  Write/Edit │────▶│  pre_tool_use   │────▶│  代码质量检查  │
│    操作      │     │   Hook          │     │  复杂度检查   │
└─────────────┘     └─────────────────┘     └──────────────┘
                           │
                           ▼
                    ┌─────────────────┐
                    │  post_tool_use   │
                    │   Hook          │
                    └─────────────────┘
```

### 3. 多 Agent 协作

```
┌─────────────────────────────────────────────────────────┐
│                    Dev Flow                            │
│                                                         │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐       │
│  │ dev-agent│───▶│review-   │───▶│ fix-agent │       │
│  │          │    │ agent    │    │          │       │
│  └──────────┘    └──────────┘    └──────────┘       │
│       │              │               │               │
│       │              ▼               │               │
│       │         ┌──────────┐        │               │
│       │         │ Issues   │◀───────┘               │
│       │         │ Found    │  (Loop until pass)     │
│       │         └──────────┘                         │
└─────────────────────────────────────────────────────────┘
```

---

## 快速开始

### 1. 配置 Hooks

在 `settings.local.json` 中启用 Hooks：

```json
{
  "permissions": {
    "allow": [
      ".claude/hooks/*.js"
    ]
  }
}
```

### 2. 触发 Skill

在 Claude Code 中，直接描述任务：

```
实现一个订单创建接口，支持优惠券
```

系统自动：
1. 检测到 Java 关键词 → 加载 `java-cola-developer` Skill
2. 检测到"接口" → 触发 `technical-design` 工作流
3. 执行 `dev-flow` → 技术设计 → 代码实现 → Review → 修复 → 提交

---

## 工作流程

### Dev Flow（开发流水线）

```
需求 → 技术设计 → 功能开发 → Code Review → 自动修复 → 提交验证
              ↓                              ↑
         循环迭代直到通过                   闭环
```

### 流程详解

| Step | 触发方式 | 职责 |
|------|----------|------|
| 技术设计 | `/feature-dev technical-design` | 分析需求、设计数据模型、定义 API |
| 功能开发 | `/feature-dev implement` | 按照设计实现代码、控制复杂度 |
| Code Review | `/pr-review-toolkit` | 检查 NPE、SQL、并发、事务、安全 |
| 自动修复 | `/ralph-loop fix` | 修复问题、循环直到 Review 通过 |
| 提交代码 | `/commit` 或 `/commit-push-pr` | 规范提交、推送、创建 PR |

---

## Skills 系统

### 内置 Skills

| Skill | 触发词 | 用途 |
|-------|--------|------|
| `java-cola-developer` | `.java`, `spring`, `后端` | Java 21 + Spring Boot 4 + COLA DDD |
| `react-developer` | `.tsx`, `react`, `前端` | React + TypeScript + Vite |
| `ios-developer` | `.swift`, `ios`, `xcode` | iOS/Swift 开发 |
| `harmony-developer` | `.ets`, `harmony`, `鸿蒙` | HarmonyOS 开发 |
| `test-driven-development` | `tdd`, `测试驱动` | TDD 红绿重构循环 |
| `systematic-debugging` | `debug`, `调试`, `bug` | 四阶段调试法 |
| `product-doc-writer` | `PRD`, `产品文档` | 产品需求文档 |
| `technical-doc-writer` | `技术方案`, `架构`, `API文档` | 技术文档 |
| `changelog-writer` | `CHANGELOG`, `Release` | 变更日志 |

### Skill 结构

```markdown
---
name: skill-name
description: Skill 简短描述
triggers:
  - keyword1
  - keyword2
---

# Skill Title

> 对齐 xxx 最佳实践

## 描述

简短说明...

## 工作流

### Step 1: xxx
- 任务1
- 任务2

## 检查清单

- [ ] 检查项1
- [ ] 检查项2
```

---

## 质量门禁

### 代码质量评分

| 加分项 | +分 | 扣分项 | -分 |
|--------|-----|--------|-----|
| JSDoc/TSDoc | +5 | TODO/FIXME | -5 |
| TypeScript Types | +3 | console.log | -3 |
| Error Handling | +5 | debugger | -10 |
| Tests | +3 | Hardcoded | -2 |

| 分数 | 等级 |
|------|------|
| ≥ 10 | A |
| 5-9 | B |
| 0-4 | C |
| < 0 | D |

### 复杂度阈值

| 指标 | 阈值 |
|------|------|
| 函数行数 | ≤ 50 |
| 文件行数 | ≤ 300 |
| 圈复杂度 | ≤ 10 |

### MECE + SSOT 原则

**MECE（逻辑完备）**：
- 枚举值之间无重叠
- switch/if 必须有 default 分支
- 无 OTHER/UNKNOWN 类型兜底

**SSOT（单一真理来源）**：
- 禁止 Magic Numbers
- 常量必须定义
- 业务逻辑不重复实现

---

## 常见问题

### Q: 如何添加新的 Skill？

1. 在 `.claude/skills/` 创建 `.md` 文件
2. 使用 `template.md` 模板
3. 添加 frontmatter 定义触发词
4. 重启 Claude Code session

### Q: 如何查看 Hook 执行日志？

```bash
tail -f .claude/logs/hook-log.jsonl
```

### Q: context7 MCP 失败怎么办？

检查 Context7 MCP 配置，确保服务正常运行或参考 [context7.io](https://context7.io) 配置指南。

---

## 目录结构

```
.claude/
├── agents/               # Agent 角色定义
├── skills/              # Skills 定义（按需加载）
├── rules/              # 项目规范（MECE、SSOT、质量评分）
├── hooks/              # Hooks 脚本
├── workflows/          # 工作流程定义
└── config/             # 配置文件

.github/workflows/
└── ci.yaml            # CI/CD 流水线
```

---

## 相关资源

- [Claude Code 官方文档](https://docs.anthropic.com/claude-code)
- [Superpowers Skills](https://github.com/obra/superpowers)
- [ESLint 配置](.claude/config/lint/eslintrc.js)
- [Checkstyle 配置](.claude/config/lint/checkstyle.xml)

# AI Coding 项目使用文档

> Claude Code 配置与多 Agent 开发工作流系统

## 目录

1. [项目概述](#项目概述)
2. [安装的插件](#安装的插件)
3. [核心原理](#核心原理)
4. [目录结构](#目录结构)
5. [快速开始](#快速开始)
6. [工作流程](#工作流程)
7. [Skills 系统](#skills-系统)
8. [Hooks 系统](#hooks-系统)
9. [Agents 系统](#agents-系统)
10. [质量门禁](#质量门禁)

---

## 项目概述

这是一个 **Claude Code 配置与多 Agent 开发工作流系统**，不是传统应用程序。它为 Claude Code 提供：

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

## 安装的插件

### Claude Code 原生支持

本项目**无需安装额外插件**，所有功能基于 Claude Code 原生能力：

#### 1. Hooks（内置）
Claude Code 提供以下 Hook 类型，无需安装：

| Hook | 用途 | 内置 |
|------|------|------|
| `user_prompt_submit` | 用户提交 Prompt 时分析 Skill 匹配 | ✅ |
| `pre_tool_use` | 工具执行前检查 | ✅ |
| `post_tool_use` | 工具执行后分析规则命中 | ✅ |

#### 2. Skills（配置文件）
Skills 通过 `.claude/skills/*.md` 文件定义，无需安装额外包。

### 可选工具（建议安装）

| 工具 | 用途 | 安装方式 |
|------|------|----------|
| ESLint | TypeScript/React Lint | `npm install -D eslint` |
| Prettier | 代码格式化 | `npm install -D prettier` |
| Checkstyle | Java 代码检查 | Maven/Gradle 插件 |
| SwiftLint | Swift 代码检查 | Homebrew |
| Commitlint | Commit 格式验证 | `npm install -D @commitlint/{cli,config-conventional}` |

### CI/CD 依赖

GitHub Actions 工作流使用以下镜像：

```yaml
# .github/workflows/ci.yaml
- name: Set up JDK 21
  uses: actions/setup-java@v4
  with:
    java-version: '21'
    distribution: 'temurin'

- name: Set up Node 20
  uses: actions/setup-node@v4
  with:
    node-version: '20'
```

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

**原理**：
- Skills 目录中的 `.md` 文件被自动扫描
- 从 frontmatter 的 `triggers` 提取关键词
- 用户 Prompt 包含触发词时，自动加载对应 Skill

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
                           │
                           ▼
                    ┌─────────────────┐
                    │  规则命中分析    │
                    │  日志记录        │
                    └─────────────────┘
```

**三层检查机制**：
1. **质量评分** - 代码质量 +5/-10 分
2. **复杂度阈值** - 函数 ≤50 行，文件 ≤300 行
3. **规则检查** - MECE、SSOT 原则

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

## 目录结构

```
.claude/
├── agents/               # Agent 角色定义
│   ├── dev-agent.md     # 技术设计 + 代码实现
│   ├── review-agent.md  # 代码评审
│   ├── fix-agent.md     # 自动修复
│   ├── java-cola-developer.md
│   ├── react-developer.md
│   ├── ios-developer.md
│   └── harmony-developer.md
│
├── skills/              # Skills 定义（按需加载）
│   ├── template.md     # Skill 模板
│   ├── test-driven-development.md
│   ├── systematic-debugging.md
│   ├── java-cola-developer.md
│   ├── react-developer.md
│   ├── product-doc-writer.md
│   ├── technical-doc-writer.md
│   └── ...
│
├── rules/              # 项目规范
│   ├── mece-ssot.md    # MECE + SSOT 原则
│   ├── code-quality.md # 代码质量评分
│   ├── documentation.md
│   ├── changelog.md
│   └── ...
│
├── hooks/              # Hooks 脚本
│   ├── user_prompt_submit.js  # Skill 匹配检测
│   ├── pre_tool_use.js        # 工具前检查
│   ├── post_tool_use.js       # 规则命中分析
│   ├── code-quality.js        # 质量评分
│   ├── complexity-check.js    # 复杂度检查
│   └── lint-check.js          # Lint 检查
│
├── workflows/          # 工作流程定义
│   └── dev-flow.md    # 开发流水线
│
├── config/             # 配置文件
│   ├── skills.yaml    # Skills 配置
│   ├── default.yaml    # 项目默认配置
│   └── lint/          # Lint 配置
│       ├── eslintrc.js
│       ├── prettierrc.js
│       ├── checkstyle.xml
│       └── swiftlint.yml
│
├── templates/          # 模板
│   └── skills-usage-log.md
│
└── logs/              # 日志
    └── hook-log.jsonl # Hook 执行日志

.github/workflows/
└── ci.yaml           # CI/CD 流水线

docs/
└── usage.md          # 本文档
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

### 2. 定义项目类型

在 `.claude/config/default.yaml` 中配置：

```yaml
project:
  type: multi-platform
  languages:
    - java
    - typescript
  min_java_version: "21"
  min_node_version: "20"
```

### 3. 触发 Skill

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

#### Step 1: 技术设计

```
触发: /feature-dev technical-design
或:   "实现XXX功能"（自动检测）
```

**职责**：
- 分析需求可行性
- 设计数据模型
- 定义 API 接口
- 评估技术风险

#### Step 2: 功能开发

```
触发: /feature-dev implement
或:   技术设计通过后自动继续
```

**职责**：
- 按照设计实现代码
- 保证代码可运行
- 控制复杂度
- 遵循项目规范

#### Step 3: Code Review

```
触发: /pr-review-toolkit
或:   代码编写完成后自动触发
```

**检查项**：
- 空指针风险
- SQL 性能
- 并发问题
- 事务问题
- 安全漏洞

#### Step 4: 自动修复

```
触发: /ralph-loop fix
或:   /commit --fix
```

**职责**：
- 修复 Review 发现的问题
- 不改变业务逻辑
- 循环修复直到 Review 通过

#### Step 5: 提交代码

```
触发: /commit
或:   /commit-push-pr
```

---

## Skills 系统

### Skill 结构

每个 Skill 是一个 `.md` 文件，包含：

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

### Skills 加载配置

```yaml
# .claude/config/skills.yaml
skills:
  java-cola-developer:
    name: "Java COLA Developer"
    trigger:
      - ".java"
      - "spring"
    load_priority: 1
    max_context: 2000
```

---

## Hooks 系统

### Hook 类型

#### 1. user_prompt_submit

**触发时机**：用户提交 Prompt 时

**功能**：
- 自动扫描 `.claude/skills/` 目录
- 从 frontmatter 提取关键词
- 匹配用户 Prompt 中的触发词
- 输出检测到的 Skills 列表

**日志输出**：
```javascript
[user_prompt_submit] detected: java-cola-developer, tdd
```

#### 2. pre_tool_use

**触发时机**：工具执行前

**功能**：
- 分析 Skill 匹配
- 扫描 Skills 目录
- 输出匹配分析结果

**日志输出**：
```javascript
[pre_tool_use] skill analysis: java-cola-developer
```

#### 3. post_tool_use

**触发时机**：工具执行后

**功能**：
- 扫描 Skills 中的检查清单
- 分析规则命中情况
- 记录命中/未命中规则

**日志输出**：
```javascript
[post_tool_use] rules hit: 5 missed: 3
```

### Hook 日志

所有 Hook 执行日志写入：

```
.claude/logs/hook-log.jsonl
```

日志格式：
```json
{"timestamp":"2026-03-29T10:00:00.000Z","hook":"user_prompt_submit","type":"skill_detection","detectedSkills":[{"skill":"java-cola-developer","score":2}]}
```

---

## Agents 系统

### Agent 角色定义

| Agent | 职责 | 触发方式 |
|-------|------|----------|
| `dev-agent` | 技术设计 + 代码实现 | `/feature-dev` |
| `review-agent` | 代码评审 | `/pr-review-toolkit` |
| `fix-agent` | 自动修复 | `/ralph-loop fix` |
| `java-cola-developer` | Java DDD 开发 | 触发词 |
| `react-developer` | React 开发 | 触发词 |

### Agent 协作流程

```
用户需求
    │
    ▼
┌──────────────────────────────────────┐
│  dev-agent                           │
│  1. 技术设计                          │
│  2. 代码实现                          │
└──────────────────────────────────────┘
    │
    ▼
┌──────────────────────────────────────┐
│  review-agent                        │
│  检查: NPE, SQL, 并发, 事务, 安全     │
└──────────────────────────────────────┘
    │
    ▼
┌──────────────────────────────────────┐
│  fix-agent (如有issues)              │
│  自动修复问题                         │
│  循环直到 Review 通过                 │
└──────────────────────────────────────┘
    │
    ▼
    提交代码
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

**评分等级**：
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

#### MECE（逻辑完备）

- 枚举值之间无重叠
- switch/if 必须有 default 分支
- 无 OTHER/UNKNOWN 类型兜底

#### SSOT（单一真理来源）

- 禁止 Magic Numbers
- 常量必须定义
- 业务逻辑不重复实现

### CI/CD 质量门禁

```yaml
# .github/workflows/ci.yaml
jobs:
  quality-gate:
    steps:
      - name: Code Quality Check
        run: |
          # ESLint
          npm run lint
          # Checkstyle
          mvn checkstyle:check
          # Complexity
          npm run complexity-check

      - name: Test Coverage
        run: |
          npm run test:coverage
          # 覆盖率必须 ≥ 70%
```

---

## 常见问题

### Q: 如何添加新的 Skill？

1. 在 `.claude/skills/` 创建 `.md` 文件
2. 使用 `template.md` 模板
3. 添加 frontmatter 定义触发词
4. 重启 Claude Code session

### Q: 如何禁用某个 Hook？

在 `settings.local.json` 中设置：

```json
{
  "hooks": {
    "disabled": ["pre_tool_use", "post_tool_use"]
  }
}
```

### Q: 如何查看 Hook 执行日志？

```bash
tail -f .claude/logs/hook-log.jsonl
```

### Q: 如何添加新的 Lint 规则？

在对应配置文件添加：

```yaml
# .claude/config/lint/eslintrc.js
rules:
  new-rule: ["error", { /* 配置 */ }]
```

---

## 相关资源

- [Claude Code 官方文档](https://docs.anthropic.com/claude-code)
- [Superpowers Skills](https://github.com/obra/superpowers)
- [ESLint 配置](../.claude/config/lint/eslintrc.js)
- [Checkstyle 配置](../.claude/config/lint/checkstyle.xml)

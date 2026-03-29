# Agents 索引

> 项目中定义的 Agent 角色

## 目录结构

```
agents/
├── README.md           # 本文件
├── dev-agent.md        # 主开发 Agent
├── review-agent.md     # 代码评审 Agent
├── fix-agent.md        # 自动修复 Agent
├── harmony-developer.md # HarmonyOS 开发
├── ios-developer.md    # iOS 开发
├── java-cola-developer.md # Java-Cola 开发
├── react-developer.md  # React 开发
└── skills-monitor.md    # Skills 监控
```

## Agent 角色定义

### 🖥️ Dev Agent (主开发)
- **文件**: `dev-agent.md`
- **职责**: 技术设计 + 代码实现
- **技术栈**: Spring Boot, MyBatis/MyBatis-Plus, Redis, MQ
- **触发**: `/feature-dev implement`

### 🔍 Review Agent (代码评审)
- **文件**: `review-agent.md`
- **职责**: 代码质量检查
- **检查项**: NPE, SQL性能, 并发, 事务, 安全
- **触发**: `/pr-review-toolkit`

### 🔧 Fix Agent (自动修复)
- **文件**: `fix-agent.md`
- **职责**: 自动修复 Review 问题
- **配合**: `ralph-loop`
- **触发**: `/ralph-loop fix`

## 协作流程

```
需求 → Dev Agent → Code Review → Fix Agent → 循环直到通过 → 提交
```

## 添加新 Agent

1. 在 `agents/` 目录创建 `{name}-agent.md`
2. 定义角色、职责、触发方式
3. 更新本索引文件

## 使用示例

### 开发新功能
```
/feature-dev technical-design  # 技术设计
/feature-dev implement         # 代码实现
/pr-review-toolkit             # Code Review
/ralph-loop fix                # 自动修复
/commit                        # 提交
```

### 单独使用 Review
```
/pr-review-toolkit --focus security  # 只检查安全
```

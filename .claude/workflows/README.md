# Workflows 索引

> 项目中定义的工作流程

## 目录结构

```
workflows/
├── README.md       # 本文件
└── dev-flow.md     # 开发流水线
```

## 工作流程

### 🚀 Dev Flow (开发流水线)

**文件**: `dev-flow.md`

定义了一套完整的多 Agent 协作开发闭环：

```
需求 → 技术设计 → 功能开发 → Code Review → 自动修复 → 提交验证
              ↓                              ↑
         循环迭代直到通过                   闭环
```

### 流程阶段

| 阶段 | Agent | 触发命令 |
|------|-------|----------|
| 技术设计 | dev-agent | `/feature-dev technical-design` |
| 功能开发 | dev-agent | `/feature-dev implement` |
| Code Review | review-agent | `/pr-review-toolkit` |
| 自动修复 | fix-agent | `/ralph-loop fix` |
| 提交验证 | - | `/commit` |

### 质量门禁

| 阶段 | 门禁条件 |
|------|----------|
| 技术设计 | 方案完整、风险可控 |
| 代码实现 | 复杂度达标、无编译错误 |
| Code Review | 无 Blocker、Critical ≤ 2 |
| 修复 | 问题全部解决 |
| 提交 | 符合 Conventional Commits |

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

## 自定义工作流程

如需添加新流程：

1. 在 `workflows/` 创建 `{flow-name}.md`
2. 定义流程阶段和触发条件
3. 更新本索引文件

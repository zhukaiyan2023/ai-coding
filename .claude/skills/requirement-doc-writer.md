---
name: requirement-doc-writer
description: 编写技术需求文档，引用 .claude/rules/requirement-docs.md 的 SMART 原则
triggers:
  - 需求文档
  - 功能规范
  - 需求分析
  - REQ
  - 需求
---

# Skill: Requirement Documentation Writer

> 详细规范请参考 [requirement-docs.md](../rules/requirement-docs.md)

## 描述

使用此 Skill 编写技术需求文档、需求规格说明书、功能规范等。

---

## 工作流

### Step 1: 需求调研

| 维度 | 内容 |
|------|------|
| 输入 | 原始需求、业务背景 |
| 处理 | 拆解、细化、量化 |
| 输出 | 需求规格说明书 |

### Step 2: 需求分析 (MECE)

```
用户维度 → 角色/权限/场景
功能维度 → 增删改查/审批/通知
数据维度 → 输入/输出/存储
接口维度 → API/事件/回调
```

### Step 3: 编写需求文档

```markdown
# 需求文档

## 1. 基本信息
## 2. 需求背景
## 3. 功能需求
## 4. 非功能需求
## 5. 验收标准
## 6. 依赖关系
## 7. 排期估算
```

---

## 模板引用

详细模板请参考：`.claude/rules/requirement-docs.md`

| 模板 | 路径 |
|------|------|
| 功能描述模板 | `.claude/rules/requirement-docs.md` |
| 验收条件模板 | `.claude/rules/requirement-docs.md` |
| SMART 原则 | `.claude/rules/requirement-docs.md` |

---

## 检查清单

详细清单请参考：`.claude/rules/requirement-docs.md`

- [ ] 需求描述无歧义
- [ ] 边界条件已覆盖
- [ ] 异常流程已识别
- [ ] 依赖关系已明确
- [ ] 验收标准 SMART

---

## 触发条件

| 关键词 | 说明 |
|--------|------|
| 需求文档 | 需求规格 |
| 功能规范 | 技术需求 |
| 需求分析 | 需求拆解 |
| REQ | 需求编号 |

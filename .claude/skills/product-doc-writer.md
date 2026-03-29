---
name: product-doc-writer
description: 编写产品需求文档（PRD）、产品规格文档，引用 .claude/rules/product-docs.md
triggers:
  - PRD
  - 产品需求文档
  - 产品文档
  - 用户故事
  - 需求分析
---

# Skill: Product Documentation Writer

> 详细规范请参考 [product-docs.md](../rules/product-docs.md)

## 描述

使用此 Skill 编写产品需求文档（PRD）、产品规格文档、产品白皮书等。

---

## 工作流

### Step 1: 需求收集

| 信息项 | 说明 |
|--------|------|
| 用户角色 | 谁会用 |
| 使用场景 | 什么情况下用 |
| 核心价值 | 解决什么问题 |
| 成功指标 | 如何衡量 |

### Step 2: MECE 需求分类

```
核心需求 → 必须做（止血/基础）
期望需求 → 应该做（体验提升）
兴奋需求 → 可以做（超出预期）
无差异需求 → 不做（浪费资源）
```

### Step 3: 编写 PRD

```markdown
# 产品需求文档

## 概述
## 背景与目标
## 用户故事
## 功能需求
## 非功能需求
## 竞品对比
## 附录
```

### Step 4: 定义验收标准

- 使用 SMART 原则
- 转化为可测试条件
- 明确优先级 P0/P1/P2/P3

---

## 模板引用

详细模板请参考：`.claude/rules/product-docs.md`

| 模板 | 路径 |
|------|------|
| PRD 模板 | `.claude/rules/product-docs.md` |
| 用户故事模板 | `.claude/rules/product-docs.md` |
| MECE 分类 | `.claude/rules/product-docs.md` |

---

## 检查清单

详细清单请参考：`.claude/rules/product-docs.md`

- [ ] 用户故事覆盖核心场景
- [ ] 需求符合 MECE 原则
- [ ] 优先级分配合理 (P0/P1/P2/P3)
- [ ] 验收标准可测试
- [ ] 指标定义清晰

---

## 触发条件

| 关键词 | 说明 |
|--------|------|
| PRD | 产品需求文档 |
| 产品文档 | 产品规格 |
| 用户故事 | 需求分析 |
| 需求分析 | 需求收集 |

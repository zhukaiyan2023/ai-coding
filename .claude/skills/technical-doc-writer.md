---
name: technical-doc-writer
description: 编写技术方案、架构文档、API 文档、技术决策记录 (ADR)
triggers:
  - 技术方案
  - 架构文档
  - API 文档
  - ADR
  - 技术决策
  - data dictionary
---

# Skill: Technical Documentation Writer

> 对齐 [writing-plans](https://github.com/obra/superpowers) 最佳实践

## 描述

使用此 Skill 编写技术方案、架构文档、API 文档、技术决策记录等。

---

## 工作流

### Step 1: 技术方案设计

| 章节 | 内容 |
|------|------|
| 概述 | 方案简介 |
| 背景 | 问题描述 |
| 目标 | 要达成什么 |
| 非目标 | 明确不包括 |
| 方案设计 | 核心内容 |

### Step 2: 架构设计

```
┌─────────────┐
│   Client    │
└──────┬──────┘
       │
┌──────▼──────┐
│   Gateway   │
└──────┬──────┘
       │
┌──────▼──────┐
│   Service   │
└──────┬──────┘
       │
┌──────▼──────┐
│   Storage   │
└─────────────┘
```

### Step 3: 编写 API 文档

```yaml
paths:
  /resource/{id}:
    get:
      summary: 获取资源
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: integer
      responses:
        '200':
          description: 成功
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Resource'
        '404':
          description: 不存在
```

### Step 4: 数据字典

| 字段 | 类型 | 说明 |
|------|------|------|
| id | bigint | 主键 |
| status | tinyint | 状态 0-禁用 1-启用 |
| created_at | datetime | 创建时间 |
| updated_at | datetime | 更新时间 |

### Step 5: ADR 技术决策

```markdown
# ADR-XXX: 决策标题

## 状态
 Accepted

## 背景
描述问题和上下文

## 决策
我们决定...

## 后果
正面...
负面...
```

---

## 模板引用

详细模板请参考：`.claude/rules/technical-docs.md`

| 模板 | 路径 |
|------|------|
| 技术方案模板 | `.claude/rules/technical-docs.md` |
| API 文档模板 | `.claude/rules/technical-docs.md` |
| ADR 模板 | `.claude/rules/technical-docs.md` |
| 数据字典 | `.claude/rules/technical-docs.md` |

---

## 检查清单

详细清单请参考：`.claude/rules/technical-docs.md`

- [ ] 架构图清晰
- [ ] 接口定义完整
- [ ] 错误码覆盖全
- [ ] 数据字典准确
- [ ] 风险评估到位
- [ ] 替代方案已考虑

---

## 触发条件

| 关键词 | 说明 |
|--------|------|
| 技术方案 | 方案设计 |
| 架构文档 | 架构说明 |
| API 文档 | 接口规范 |
| ADR | 技术决策 |
| 数据字典 | 数据定义 |

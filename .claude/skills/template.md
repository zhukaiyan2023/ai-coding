---
name: skill-template
description: Skill 模板，用于创建新的 Skill
triggers:
  - skill
  - 模板
  - new skill
---

# Skill Template

> 参考 [skill-creator](https://github.com/anthropics/skills) 最佳实践

## 描述

简短说明此 Skill 的用途。

---

## 工作流

### Step 1: [阶段名称]

- 任务1
- 任务2

### Step 2: [阶段名称]

- 任务1
- 任务2

---

## 检查清单

- [ ] 检查项1
- [ ] 检查项2

---

## 触发条件

| 关键词 | 说明 |
|--------|------|
| keyword | 何时触发此 skill |

---

## YAML Frontmatter

```yaml
---
name: skill-name          # 技能名称（必须唯一）
description: 简短描述     # 触发条件描述
triggers:                 # 触发关键词列表
  - keyword1
  - keyword2
---
```

**注意**：所有 Skill 必须包含 YAML frontmatter 以便被正确识别。

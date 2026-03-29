# Skill Template

## SKILL_DECISION (每个skill必须输出)

完成每个任务后，必须输出以下格式：

```
[SKILL_DECISION]
selected_skill: {skill_name}
reason: {选择原因}
rejected_skills:
  - {other_skill}: {拒绝原因}

rules_hit:
  - {rule_name}: {命中说明}

rules_missed:
  - {rule_name}: {未使用原因}
```

## 通用规则追踪

每个 skill 应该追踪以下类型规则：

### 1. 代码规范规则
- 命名规范
- 代码格式
- 注释要求

### 2. 技术选型规则
- 使用框架/库
- 架构模式
- 设计模式

### 3. 质量规则
- 测试覆盖
- 错误处理
- 性能考虑

### 4. 安全规则
- 输入校验
- 敏感数据处理
- 权限控制

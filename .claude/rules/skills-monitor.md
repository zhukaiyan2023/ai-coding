# Skills Monitor Rule

## 监控目标
追踪和记录所有skills的使用情况，分析哪些规则/流程被使用或未被使用。

## 监控规则

### 1. Skills加载监控
每当加载一个skill时，记录：
- 技能名称 (name)
- 加载时间
- 触发原因 (用户请求/自动触发/上下文触发)

### 2. 规则/流程使用追踪
追踪skills中定义的具体规则是否被使用：

#### Java COLA Developer Rules
| 规则/流程 | 追踪方式 | 未使用原因分析 |
|----------|---------|---------------|
| JDK 21 新特性 | 代码中使用VirtualThreads/Record/PatternMatching | 需要检查是否主动推荐 |
| Record使用 | 检查是否使用record定义DTO | 记录未使用原因 |
| MapStruct映射 | 检查是否使用MapStruct | 禁止BeanUtils检查 |
| 三智能体架构 | Planner/Generator/Evaluator流程 | 检查是否分离 |
| Sprint Contract | 实现前协商完成标准 | 检查是否执行 |
| Build-Verify循环 | 每次实现后的验证 | 检查迭代次数 |

#### React Developer Rules
| 规则/流程 | 追踪方式 | 未使用原因分析 |
|----------|---------|---------------|
| 项目结构规范 | features/{module}结构 | 检查目录规范 |
| 状态管理方案 | Zustand/React Query使用 | 检查选型合理性 |
| TypeScript严格模式 | 无any检查 | 代码审查 |
| 组件懒加载 | React.lazy使用 | 性能考虑 |
| 任务分解顺序 | 类型→API→Hook→组件 | 检查依赖关系 |

#### iOS Developer Rules
| 规则/流程 | 追踪方式 | 未使用原因分析 |
|----------|---------|---------------|
| Swift API Guidelines | 代码规范检查 | 检查命名 |
| Protocol依赖注入 | 检查注入方式 | 检查解耦 |
| Combine异步处理 | 检查响应式使用 | 检查必要性 |
| MVVM+Coordinator | 检查架构分离 | 检查复杂度 |

#### HarmonyOS Developer Rules
| 规则/流程 | 追踪方式 | 未使用原因分析 |
|----------|---------|---------------|
| ArkUI规范 | 代码规范检查 | 检查组件化 |
| @Observed状态 | 检查响应式 | 检查必要性 |
| LazyForEach优化 | 列表性能检查 | 检查数据量 |

## 日志格式

### Skills使用日志
```
[SKILL_LOADED] java-cola-developer | 2024-01-01 10:00:00 | user_request
[RULE_APPLIED] JDK21 VirtualThreads | 2024-01-01 10:01:00 | 代码中使用了Thread.ofVirtual()
[RULE_SKIPPED] MapStruct映射 | 2024-01-01 10:02:00 | 理由: 简单对象直接赋值更快
[DOOM_LOOP_DETECTED] user.java | 3次修改 | 建议重新评估方案
```

### 分析报告结构
```markdown
# Skills使用分析报告

## 总体使用率
- Java COLA Developer: 75%
- React Developer: 60%
- iOS Developer: 0% (未触发)
- HarmonyOS Developer: 0% (未触发)

## 详细分析

### Java COLA Developer
✅ 已使用:
- JDK 21 Record (3次)
- 三智能体架构 (2次)
- Build-Verify循环 (5次)

❌ 未使用:
- MapStruct对象映射 (原因: 简单映射场景使用copy)
- Sprint Contract协商 (原因: 小改动未启用)

### React Developer
✅ 已使用:
- TypeScript严格模式 (10次)
- 组件懒加载 (2次)

❌ 未使用:
- React Query (原因: 全部使用useEffect)
- 任务分解流程 (原因: 快速实现跳过)

## 问题诊断

### 高频未使用规则
1. Sprint Contract - 需要强制启用
2. MapStruct - 建议添加自动化检查

### Doom Loop预警
- user.java: 5次修改，建议重新设计
- UserForm.tsx: 3次修改，建议重构
```

## 强制执行

1. **每次任务开始**: 记录当前激活的skills
2. **每次代码生成**: 记录使用的规则
3. **每次验证失败**: 记录重试次数和原因
4. **任务结束**: 生成使用分析报告

## 输出位置
- 日志: `.claude/logs/skills-usage.log`
- 报告: `.claude/reports/skills-analysis-{date}.md`

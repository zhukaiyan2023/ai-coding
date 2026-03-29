# Skills 使用分析规则

## 追踪目的
分析 skills 规则是否被使用，找出未使用原因，持续改进。

## 追踪规则

### 日志格式
```
[SKILL_LOADED] {skill} | {time} | {trigger}
[RULE_APPLIED] {rule} | {time} | {detail}
[RULE_SKIPPED] {rule} | {time} | {reason}
```

### 追踪的规则

#### Java COLA
| 规则 | 未使用原因 |
|------|-----------|
| Record DTO | 需主动推荐 |
| MapStruct | 简单映射直接赋值 |
| Sprint Contract | 小改动跳过 |
| 三智能体 | 简单任务不需要 |

#### React
| 规则 | 未使用原因 |
|------|-----------|
| TypeScript 严格 | 遗留代码 |
| React Query | useEffect 更简单 |
| 懒加载 | 首次加载必要 |

## 分析报告

生成位置: `.claude/reports/skills-analysis-{date}.md`

```markdown
## 总体使用率
- Java: 75%
- React: 60%

## 未使用规则及原因
| 规则 | 原因 |
|------|------|
| Sprint Contract | 小改动跳过 |
```

## Doom Loop 检测
- 同一文件修改 > 3 次 → 建议重新设计
- 验证失败 > 2 次 → 暂停重新分析

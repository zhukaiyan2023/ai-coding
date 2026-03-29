# Skills使用日志模板

## 使用说明
每次使用Claude Code时，在此文件中记录skills的使用情况。

## 日志格式
```
[SKILL_LOADED] {skill_name} | {timestamp} | {trigger_reason}
[RULE_APPLIED] {rule_name} | {timestamp} | {detail}
[RULE_SKIPPED] {rule_name} | {timestamp} | {reason}
[DOOM_LOOP_DETECTED] {file} | {edit_count}次修改 | {suggestion}
```

## Trigger Reason 类型
- user_request: 用户明确请求
- auto_context: 上下文自动触发
- file_detected: 文件类型检测触发

---

## 使用记录

### 2024-


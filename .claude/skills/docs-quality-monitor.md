# Skill: Docs-Quality Monitor

## 描述
监控代码质量和文档完整性的 Skill，包含 lint 检查、复杂度分析、文档同步检测。

---

## 工作流

### Step 1: 代码变更检测

触发条件：Write/Edit 操作

```
检查文件类型 → 跳过非代码文件 → 分析内容
```

### Step 2: 质量评分

| 加分项 | 分数 | 扣分项 | 分数 |
|--------|------|--------|------|
| JSDoc/TSDoc | +5 | TODO/FIXME | -5 |
| TypeScript Types | +3 | console.log | -3 |
| Error Handling | +5 | debugger | -10 |
| Tests | +3 | Hardcoded | -2 |

### Step 3: 复杂度检测

| 指标 | 阈值 |
|------|------|
| 函数行数 | ≤ 50 |
| 文件行数 | ≤ 300 |
| 圈复杂度 | ≤ 10 |

### Step 4: Lint 检查

自动运行项目 lint 配置：
- ESLint → JSON 格式输出
- Prettier → --check 模式
- SwiftLint → YAML 配置

### Step 5: 文档同步检测

检测相关文档是否被提及：
- `{basename}.md`
- `docs/{basename}.md`
- `{basename}/README.md`

---

## 检查清单

### 代码质量
- [ ] 质量评分 ≥ 0
- [ ] 函数 ≤ 50 行
- [ ] 文件 ≤ 300 行
- [ ] 无 console.log/debugger
- [ ] 有错误处理
- [ ] 有类型标注（TS）

### 文档同步
- [ ] 相关文档已更新
- [ ] CHANGELOG 已记录
- [ ] JSDoc 完整

### Lint
- [ ] ESLint 通过
- [ ] Prettier 通过

---

## 触发条件

| 关键词 | 说明 |
|--------|------|
| 质量 | 代码质量相关 |
| lint | lint 检查 |
| 文档 | 文档同步 |
| 重构 | 复杂度检查 |
| 评分 | 评分相关 |

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

### Step 6: 测试验证

**单元测试覆盖率**：
| 项目类型 | 最低覆盖率 |
|----------|-----------|
| 核心业务 | ≥ 70% |
| 工具类 | ≥ 80% |
| 新增代码 | ≥ 60% |

**接口测试**：
- REST API 全覆盖 CRUD
- 边界条件和错误码必测

**运行命令**：
| 框架 | 命令 |
|------|------|
| Java (Maven) | `mvn test` + `mvn jacoco:report` |
| JS/TS (Jest) | `npm test -- --coverage` |
| Python (pytest) | `pytest --cov` |

---

## 检查清单

### 代码质量
- [ ] 质量评分 ≥ 0
- [ ] 函数 ≤ 50 行
- [ ] 文件 ≤ 300 行
- [ ] 无 console.log/debugger
- [ ] 有错误处理
- [ ] 有类型标注（TS）

### 测试覆盖
- [ ] 单元测试通过
- [ ] 覆盖率达标（核心≥70%, 工具≥80%）
- [ ] 核心接口有测试

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

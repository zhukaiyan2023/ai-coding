---
name: docs-quality-monitor
description: 监控代码质量和文档完整性，包含 lint 检查、复杂度分析、测试覆盖率验证、测试反模式检测
triggers:
  - 质量
  - lint
  - 文档
  - 重构
  - 评分
  - coverage
  - 测试覆盖率
  - code quality
  - 测试
  - test
---

# Skill: Docs-Quality Monitor

> 对齐 [verification-before-completion](https://github.com/obra/superpowers) 最佳实践

## 描述

监控代码质量和文档完整性的 Skill，包含 lint 检查、复杂度分析、测试覆盖率验证、测试反模式检测。

---

## 工作流

### Step 1: 代码变更检测

**触发条件**：Write/Edit 操作

```
检查文件类型 → 跳过非代码文件 → 分析内容
```

**检测文件类型**：
- Java: `.java`
- TypeScript: `.ts`, `.tsx`
- JavaScript: `.js`, `.jsx`
- Python: `.py`

### Step 2: 质量评分

| 加分项 | 分数 | 扣分项 | 分数 |
|--------|------|--------|------|
| JSDoc/TSDoc | +5 | TODO/FIXME | -5 |
| TypeScript Types | +3 | console.log | -3 |
| Error Handling | +5 | debugger | -10 |
| Tests | +3 | Hardcoded | -2 |

**评分等级**：

| 分数 | 等级 | 行动 |
|------|------|------|
| ≥ 10 | A | ✅ 通过 |
| 5-9 | B | ⚠️ 建议优化 |
| 0-4 | C | 🔶 需要改进 |
| < 0 | D | 🔴 必须修复 |

### Step 3: 复杂度检测

| 指标 | 阈值 | 超过则 |
|------|------|--------|
| 函数行数 | ≤ 50 | 重构 |
| 文件行数 | ≤ 300 | 拆分 |
| 圈复杂度 | ≤ 10 | 简化 |

**检测命令**：
```bash
# Java/Maven
mvn pmd:pmd

# JS/TS - ESLint
npx eslint --format json src/

# Python
flake8 --select=E,W,F src/
```

### Step 4: Lint 检查

**自动运行项目 lint 配置**：

| 工具 | 命令 | 配置 |
|------|------|------|
| ESLint | `eslint --check` | `.eslintrc.json` |
| Prettier | `prettier --check` | `.prettierrc` |
| SwiftLint | `swiftlint` | `.swiftlint.yml` |
| Checkstyle | `checkstyle` | `checkstyle.xml` |
| ALE (Vim) | `:ALE lint` | `.ale.rc` |

### Step 5: 测试覆盖率验证

**单元测试覆盖率要求**：

| 项目类型 | 最低覆盖率 |
|----------|-----------|
| 核心业务 | ≥ 70% |
| 工具类 | ≥ 80% |
| 新增代码 | ≥ 60% |

**运行命令**：

| 框架 | 命令 |
|------|------|
| Java (Maven) | `mvn test` + `mvn jacoco:report` |
| Java (Gradle) | `gradle test` + `gradle jacocoTestReport` |
| JS/TS (Jest) | `npm test -- --coverage` |
| Python (pytest) | `pytest --cov=src --cov-report=html` |

**测试覆盖率检查项**：
- [ ] 行覆盖率 (Line Coverage) ≥ 70%
- [ ] 分支覆盖率 (Branch Coverage) ≥ 60%
- [ ] 函数覆盖率 (Function Coverage) ≥ 80%
- [ ] 核心模块覆盖率 ≥ 80%

### Step 6: 测试反模式检测

> 对齐 [testing-anti-patterns](https://github.com/obra/superpowers)

**检测常见测试反模式**：

#### 6.1 脆弱断言 (Brittle Assertions)
```java
// ❌ 脆弱 - 过度精确
assertEquals("User{name='John', age=30}", user.toString());

// ✅ 健壮 - 只测关键属性
assertEquals("John", user.getName());
assertEquals(30, user.getAge());
```

#### 6.2 测试相互依赖 (Test Interdependence)
```java
// ❌ 错误 - 测试间共享状态
static User sharedUser;

@Test
void test1() { sharedUser = createUser(); }

@Test
void test2() { sharedUser.setName("Changed"); } // 可能影响 test1
```

#### 6.3 孤立性差 (Poor Isolation)
```java
// ❌ 错误 - 依赖外部数据库
@Test
void testUserQuery() {
    User user = db.query("SELECT * FROM users WHERE id=1");
    assertNotNull(user);
}
```

#### 6.4 断言不足 (Insufficient Assertions)
```java
// ❌ 错误 - 只检查不抛异常
@Test
void testUserCreation() {
    userService.createUser(cmd);
    // 什么都没验证！
}

// ✅ 正确 - 验证结果
@Test
void testUserCreation() {
    User user = userService.createUser(cmd);
    assertNotNull(user.getId());
    assertEquals(cmd.email(), user.getEmail());
}
```

#### 6.5 Magic Numbers
```java
// ❌ 错误
assertEquals(86400000, user.getSessionTimeout());

// ✅ 正确
private static final long ONE_DAY_MS = 86400000;
assertEquals(ONE_DAY_MS, user.getSessionTimeout());
```

**测试反模式检查清单**：
- [ ] 无脆弱断言 (不测试 toString() 完整格式)
- [ ] 测试间无共享状态
- [ ] 使用 Mock/Stub 隔离外部依赖
- [ ] 每个测试有足够的断言
- [ ] 无 Magic Numbers

### Step 7: 文档同步检测

**检测相关文档**：

```bash
# 检查是否存在相关文档
docs/{basename}.md
docs/{category}/{basename}.md
{category}/README.md
```

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
- [ ] 边界条件已测试
- [ ] 异常流程已测试

### 测试反模式
- [ ] 无脆弱断言
- [ ] 测试间无依赖
- [ ] 外部依赖已 Mock
- [ ] 断言充分
- [ ] 无 Magic Numbers

### 文档同步
- [ ] 相关文档已更新
- [ ] CHANGELOG 已记录
- [ ] JSDoc 完整

### Lint
- [ ] ESLint / Checkstyle 通过
- [ ] Prettier 通过

---

## 验证前置条件

> 对齐 [verification-before-completion](https://github.com/obra/superpowers)

**完成前必须验证**：

1. **证据优先于断言**
   ```
   ❌ "代码看起来没问题"
   ✅ "运行测试通过，输出为..."
   ```

2. **验证清单**
   - [ ] `mvn test` / `npm test` 通过
   - [ ] 覆盖率报告已生成
   - [ ] 无新增 lint 错误
   - [ ] 文档已更新

3. **验证命令**
   ```bash
   # Java
   mvn clean verify && mvn jacoco:report

   # JS/TS
   npm run test:ci && npm run coverage

   # Python
   pytest --cov=src --cov-report=term-missing
   ```

---

## 触发场景

| 场景 | 触发关键词 |
|------|-----------|
| 代码写完后 | "实现完了" / "写好了" / "done" |
| 提交前检查 | "检查质量" / "verify" / "提交" |
| 重构前 | "重构" / "优化" / "refactor" |
| PR 创建前 | "创建 PR" / "review" / "pull request" |
| 测试审查 | "检查测试" / "测试反模式" |

---

## 验证命令速查

```bash
# 完整质量检查
npm run quality-check

# 只跑 lint
npm run lint

# 只跑测试
npm test

# 生成覆盖率报告
npm run coverage

# 完整 CI 检查
npm run test:ci && npm run lint && npm run coverage
```

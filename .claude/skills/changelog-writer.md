---
name: changelog-writer
description: 编写代码变更日志、版本发布说明、Git Commit 规范
triggers:
  - CHANGELOG
  - Release
  - 版本
  - commit
  - changelog
  - release-notes
---

# Skill: Changelog Writer

> 遵循 [Conventional Commits](https://www.conventionalcommits.org/) 规范

## 描述

使用此 Skill 编写代码变更日志、版本发布说明、Git Commit 规范等。

---

## 工作流

### Step 1: 分类变更

| Type | 说明 | 示例 |
|------|------|------|
| `feat` | 新功能 | 新增用户模块 |
| `fix` | Bug 修复 | 修复登录问题 |
| `docs` | 文档更新 | 更新 API 文档 |
| `style` | 代码格式 | 格式化代码 |
| `refactor` | 重构 | 优化性能 |
| `perf` | 性能优化 | 提升查询速度 |
| `test` | 测试 | 添加单元测试 |
| `chore` | 构建/工具 | 更新依赖 |
| `ci` | CI 配置 | 修改 GitHub Actions |
| `revert` | 回滚 | 回滚上次提交 |

### Step 2: 版本规划

```
主版本.次版本.修订号
 MAJOR  MINOR  PATCH

MAJOR: 不兼容变更 (Breaking Changes)
MINOR: 向后兼容新增
PATCH: 向后兼容修复
```

### Step 3: Commit 格式

```bash
<type>(<scope>): <subject>

[optional body]

[optional footer(s)]
```

**规则**：
- `type` 必填，scope 可选
- `subject` 简短描述，不超过 72 字符
- 使用祈使语气："add" 而不是 "added"
- `body` 详细说明改了什么和为什么
- `footer` 引用 Issue 或 Breaking Changes

**Breaking Changes**：
```
feat(api)!: 改变认证方式

BREAKING CHANGE: 旧的 token 格式不再支持

Closes #123
```

### Step 4: 编写 CHANGELOG

```markdown
# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-01-01

### Added
- 新增用户注册功能 (#1)
- 新增短信验证 (#2)

### Changed
- 优化用户查询性能 (#3)

### Fixed
- 修复登录超时问题 (#4)

### Security
- 升级加密算法至 AES-256

### Breaking Changes
- 认证方式从 Session 改为 JWT
```

---

## Commit 示例

```bash
# 新功能
git commit -m "feat(user): 添加短信验证码登录

- 新增 SMS 发送接口
- 添加防抖限制
- 验证码 5 分钟有效期

Closes #123"

# Bug 修复
git commit -m "fix(auth): 修复 token 过期后未自动刷新

- 添加 token 刷新机制
- 优化错误处理

Fixes #456"

# Breaking Change
git commit -m "feat(api)!: 废弃 v1 API

迁移至 v2 API，支持:
- 分页参数变更
- 响应格式统一

BREAKING CHANGE: v1 API 将于 2024-06-01 移除
Closes #789"
```

---

## 检查清单

- [ ] Type 选择正确（feat/fix/docs/...）
- [ ] 描述清晰简洁，不超过 72 字符
- [ ] Breaking Changes 已标注（`!` 或 `BREAKING CHANGE:`）
- [ ] 版本号符合 SemVer
- [ ] Issue/PR 已引用（Closes #xxx / Fixes #xxx）
- [ ] 使用祈使语气

---

## 触发条件

| 关键词 | 说明 |
|--------|------|
| CHANGELOG | 变更日志 |
| Release | 发布说明 |
| 版本 | 版本规划 |
| commit | Git 规范 |
| Conventional Commits | 提交格式 |

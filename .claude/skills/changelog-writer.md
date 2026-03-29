# Skill: Changelog Writer

## 描述
使用此 Skill 编写代码变更日志、版本发布说明、Git Commit 规范等。

---

## 工作流

### Step 1: 分类变更

| Type | 说明 | 示例 |
|------|------|------|
| Added | 新功能 | 新增用户模块 |
| Changed | 变更功能 | 优化性能 |
| Deprecated | 废弃功能 | 标记 v2 移除 |
| Fixed | Bug 修复 | 修复登录问题 |
| Removed | 移除功能 | 移除旧 API |
| Security | 安全修复 | 升级加密 |

### Step 2: 版本规划

```
主版本.次版本.修订号
 MAJOR  MINOR  PATCH

MAJOR: 不兼容变更
MINOR: 向后兼容新增
PATCH: 向后兼容修复
```

### Step 3: 编写 CHANGELOG

```markdown
# Changelog

## [1.0.0] - 2024-01-01

### Added
- 新增用户注册功能
- 新增短信验证

### Fixed
- 修复登录超时问题
```

### Step 4: 编写 Release Notes

```markdown
# Release Notes v1.0.0

## 🎉 新功能
## 🔧 改进
## 🐛 修复
## ⚠️  Breaking Changes
## 📖 文档

## 升级指南
## 已知问题
```

---

## Git Commit 规范

### 格式
```
<type>(<scope>): <subject>

<body>

<footer>
```

### 示例

```
feat(user): 添加短信验证码登录

- 新增 SMS 发送接口
- 添加防抖限制
- 验证码 5 分钟有效期

Closes #123
```

---

## 检查清单

- [ ] Type 选择正确
- [ ] 描述清晰简洁
- [ ] Breaking Changes 已标注
- [ ] 版本号符合 SemVer
- [ ] 关联 Issue 已引用

---

## 触发条件

| 关键词 | 说明 |
|--------|------|
| CHANGELOG | 变更日志 |
| Release | 发布说明 |
| 版本 | 版本规划 |
| Commit | Git 规范 |

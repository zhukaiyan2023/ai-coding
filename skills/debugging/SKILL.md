---
name: debugging
description: 系统性调试技能，用于识别和修复错误。在调查问题、崩溃或代码库中的意外行为时使用。
---

# 调试技能

## 概述

此技能提供系统的调试方法，帮助高效地识别根本原因。它遵循科学方法：观察、假设、实验和结论。

## 使用场景

- 调查崩溃或错误
- 修复意外行为
- 性能问题
- 内存泄漏
- 竞态条件
- 任何需要发现和修复的错误

## 调试过程

### 阶段 1：理解问题

```
1. 收集信息
   - 预期行为是什么？
   - 实际行为是什么？
   - 何时发生？（复现步骤）
   - 什么环境？（浏览器、操作系统、版本）
   - 有错误消息吗？

2. 隔离问题
   - 你能一致地复现它吗？
   - 它在特定条件下发生吗？
   - 范围是什么？（单个用户、所有用户）
```

### 阶段 2：收集证据

```
1. 检查日志
   - 应用日志
   - 浏览器控制台
   - 服务器日志
   - 错误追踪（Sentry 等）

2. 使用调试工具
   - 浏览器 DevTools
   - IDE 调试器
   - 网络检查器
   - 数据库查询日志
```

### 阶段 3：形成假设

```
根据证据，形成假设：
- "API 对用户 ID 返回 null"
- "异步流程中存在竞态条件"
- "组件中的内存没有被释放"
```

### 阶段 4：测试假设

```
1. 创建最小复现
2. 添加日志验证假设
3. 使用断点检查状态
4. 运行针对性测试
```

### 阶段 5：修复和验证

```
1. 实现修复
2. 运行测试验证修复
3. 检查边界情况
4. 在生产环境中监控
```

## 常见错误模式

### 1. 空值/未定义错误

```typescript
// ❌ 问题：无空值检查
const userName = user.profile.name;

// ✅ 修复：可选链
const userName = user?.profile?.name;

// ✅ 修复：默认值
const userName = user?.profile?.name ?? '未知';
```

### 2. 异步问题

```typescript
// ❌ 问题：未等待
async function getData() {
  fetchData(); // 返回 promise，未等待
  render(); // 数据到达前运行
}

// ✅ 修复：正确使用 async/await
async function getData() {
  const data = await fetchData();
  render(data);
}
```

### 3. 竞态条件

```typescript
// ❌ 问题：竞态条件
let user;
fetchUser().then(u => user = u);
console.log(user); // 可能未定义

// ✅ 修复：正确的异步流程
async function loadUser() {
  const user = await fetchUser();
  console.log(user); // 总是已定义
}
```

### 4. 内存泄漏

```typescript
// ❌ 问题：未清理的事件监听器
useEffect(() => {
  window.addEventListener('resize', handleResize);
}, []);

// ✅ 修复：在返回中清理
useEffect(() => {
  window.addEventListener('resize', handleResize);
  return () => window.removeEventListener('resize', handleResize);
}, []);
```

### 5. 闭包陈旧值

```typescript
// ❌ 问题：闭包陈旧值
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100); // 打印 3,3,3
}

// ✅ 修复：使用 let 或闭包
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100); // 打印 0,1,2
}
```

## 调试工具

### 浏览器 DevTools

| 标签页 | 用途 |
|--------|------|
| Console | 日志输出、错误 |
| Network | API 请求、计时 |
| Sources | 断点、逐步调试 |
| Elements | DOM 检查 |
| Performance | 性能问题 |
| Memory | 内存泄漏 |

### VS Code 调试

```json
// launch.json 配置
{
  "type": "node",
  "request": "launch",
  "name": "调试测试",
  "program": "${workspaceFolder}/node_modules/jest/bin/jest.js",
  "args": ["--runInBand"],
  "console": "integratedTerminal"
}
```

### 日志最佳实践

```typescript
// ✅ 好：结构化日志
logger.info('用户已创建', {
  userId: user.id,
  email: user.email,
  duration: performance.now() - start
});

// ✅ 好：错误中包含上下文
throw new Error(`获取用户 ${userId} 失败`, {
  cause: error
});

// ❌ 不好：console.log 轰炸
console.log('here1');
console.log('here2');
console.log(user);
```

## 调试命令

### Git 调试

```bash
# 找到引入问题的提交
git bisect start
git bisect bad
git bisect good v1.0.0

# 查看谁添加了这一行
git blame -L 10,20 file.ts

# 查看函数的历史
git log -p --follow functionName

# 查看提交中的更改
git show <commit>
```

### Node.js 调试

```bash
# 使用 Node 调试
node --inspect index.js

# 使用 Chrome DevTools 调试
chrome://inspect

# 调试测试
node --inspect-brk node_modules/.bin/jest

# 内存分析
node --prof app.js
```

## 常见错误消息

### "Cannot read property of undefined"

```typescript
// 检查：属性是否已定义？
// 修复：使用可选链或空值检查
```

### "Promise rejected"

```typescript
// 检查：你是否处理了 promise 拒绝？
// 修复：添加 .catch() 或使用 try/catch 和 await
```

### "Maximum call stack exceeded"

```typescript
// 检查：无限递归？
// 修复：向递归函数添加基准情况
```

### "CORS error"

```typescript
// 检查：服务器允许来源？
// 修复：在服务器上配置 CORS 头
```

### "ECONNREFUSED"

```typescript
// 检查：服务是否运行？
// 修复：启动所需服务
```

## 测试修复

### 错误的单元测试

```typescript
it('优雅处理空用户', () => {
  // 安排
  const user = null;

  // 执行
  const result = getUserDisplayName(user);

  // 断言
  expect(result).toBe('访客');
});
```

### 回归测试

```typescript
it('不应回归错误 #123', () => {
  // 复现错误报告中的确切场景
  const input = { /* 错误报告场景 */ };
  expect(processInput(input)).not.toBeNull();
});
```

## 反模式

### 不要做

- ❌ 使用 console.log 而不是适当的调试
- ❌ 猜测并尝试随机修复
- ❌ 忽略错误消息
- ❌ 在理解问题之前做更改
- ❌ 修复症状而不是根本原因

### 应该做

- ✅ 仔细阅读错误消息
- ✅ 创建最小复现
- ✅ 有效使用调试工具
- ✅ 修复根本原因，而不是症状
- ✅ 编写测试防止回归

## 调试清单

- [ ] 一致地复现问题
- [ ] 收集相关日志
- [ ] 确定了根本原因
- [ ] 实现了修复
- [ ] 验证修复有效
- [ ] 检查了边界情况
- [ ] 添加了回归测试
- [ ] 记录了修复

---

## 参考资料

- VS Code 调试：https://code.visualstudio.com/docs/editor/debugging
- Chrome DevTools：https://developer.chrome.com/docs/devtools
- Node.js 调试：https://nodejs.org/en/docs/guides/debugging-getting-started/

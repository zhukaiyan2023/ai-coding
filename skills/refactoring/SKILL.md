---
name: refactoring
description: 安全的代码重构技能，用于在不改变行为的情况下提高代码质量。在改进现有代码、减少复杂性或应用设计模式时使用。
---

# 重构技能

## 概述

此技能提供安全的重构技术，在保持现有行为的同时提高代码质量。它强调小的、增量式的更改，并由测试支持。

## 使用场景

- 提高代码可读性
- 减少复杂性
- 应用设计模式
- 消除代码重复
- 技术债务清理
- 在添加新功能之前

## 重构原则

### 1. 童子军规则

> "始终让代码比发现时更好"

```
✅ 小改进：重命名、提取、内联
✅ 删除死代码
✅ 修复命名
❌ 不改变行为
```

### 2. 小步骤

```
✅ 做小的、增量式的更改
✅ 每次更改后运行测试
✅ 频繁提交

❌ 不重写整个模块
❌ 不合并多个重构
```

### 3. 测试优先

```
✅ 重构前确保测试存在
✅ 运行测试验证行为不变
✅ 为未覆盖的代码添加测试

❌ 不删除测试
❌ 不在没有测试的情况下重构
```

## 常见重构

### 1. 提取函数

```typescript
// ❌ 之前：长函数
function processOrder(order) {
  validateOrder(order);
  calculateTotal(order);
  applyDiscount(order);
  sendEmail(order);
  updateInventory(order);
  logOrder(order);
  return order;
}

// ✅ 之后：提取的函数
function processOrder(order) {
  validateOrder(order);
  calculateOrderTotal(order);
  await sendOrderConfirmation(order);
  await updateInventory(order);
  logOrder(order);
  return order;
}
```

### 2. 重命名变量

```typescript
// ❌ 之前：名称不清晰
const d = new Date();
const x = users.filter(u => u.a > 18);

// ✅ 之后：描述性名称
const currentDate = new Date();
const adultUsers = users.filter(user => user.age > 18);
```

### 3. 提取常量

```typescript
// ❌ 之前：魔数
if (user.score > 100) {
  setTimeout(() => update(user), 86400000);
}

// ✅ 之后：命名的常量
const MAX_SCORE = 100;
const ONE_DAY_MS = 86400000;

if (user.score > MAX_SCORE) {
  setTimeout(() => update(user), ONE_DAY_MS);
}
```

### 4. 使用可选链

```typescript
// ❌ 之前：嵌套条件
let city = '未知';
if (user && user.profile && user.profile.address) {
  city = user.profile.address.city;
}

// ✅ 之后：可选链
const city = user?.profile?.address?.city ?? '未知';
```

### 5. 提取为 Hook

```typescript
// ❌ 之前：组件中的逻辑
function UserProfile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUser().then(data => {
      setUser(data);
      setLoading(false);
    });
  }, []);

  // ... 组件其余部分
}

// ✅ 之后：自定义 Hook
function useUser() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUser().then(data => {
      setUser(data);
      setLoading(false);
    });
  }, []);

  return { user, loading };
}

function UserProfile() {
  const { user, loading } = useUser();
  // ... 组件其余部分
}
```

### 6. 用多态替换条件

```typescript
// ❌ 之前：switch 语句
class PaymentProcessor {
  process(payment) {
    switch (payment.type) {
      case 'credit':
        return this.processCredit(payment);
      case 'debit':
        return this.processDebit(payment);
      case 'paypal':
        return this.processPaypal(payment);
    }
  }
}

// ✅ 之后：多态
abstract class Payment {
  abstract process(): PaymentResult;
}

class CreditPayment extends Payment {
  process(): PaymentResult { /* ... */ }
}

class DebitPayment extends Payment {
  process(): PaymentResult { /* ... */ }
}
```

### 7. 引入参数对象

```typescript
// ❌ 之前：许多参数
function createUser(name, email, age, address, phone, company) {
  // ...
}

// ✅ 之后：参数对象
interface UserDetails {
  name: string;
  email: string;
  age: number;
  address: string;
  phone: string;
  company: string;
}

function createUser(details: UserDetails) {
  // ...
}
```

## 代码异味

### 1. 长函数

```
症状：函数 > 30 行
解决方案：提取为更小的函数
```

### 2. 大类

```
症状：类 > 200 行
解决方案：使用单一职责原则拆分为更小的类
```

### 3. 重复代码

```
症状：多处相同代码
解决方案：提取到共享函数/模块
```

### 4. 魔数

```
症状：数字没有解释
解决方案：提取为命名的常量
```

### 5. 上帝对象

```
症状：对象知道/接触太多
解决方案：使用依赖注入
```

### 6. 特性羡慕

```
症状：类过多使用另一个类的数据
解决方案：将方法移到该类
```

## 重构清单

### 重构前

- [ ] 测试存在且通过
- [ ] 代码在版本控制中
- [ ] 你理解当前行为
- [ ] 已创建备份分支

### 重构期间

- [ ] 小的、增量式的更改
- [ ] 每次更改后测试仍然通过
- [ ] 无新的 linting 错误
- [ ] TypeScript 无错误编译

### 重构后

- [ ] 所有测试通过
- [ ] 行为未改变（已验证）
- [ ] 无重复代码
- [ ] 代码更可读
- [ ] 复杂性降低

## 安全重构顺序

1. **重命名** - 低风险，高清晰度
2. **提取** - 低风险，改进结构
3. **移动** - 中等风险，重新组织
4. **内联** - 低风险，移除间接层
5. **替换** - 较高风险，改变模式

## 何时不重构

- ❌ 截止日期临近时
- ❌ 在功能分支上（除非是目的）
- ❌ 没有测试时（先创建测试）
- ❌ 当你不理解代码时
- ❌ 生产紧急情况（先修复错误）

## Git 重构工作流

```bash
# 创建重构分支
git checkout -b refactor/user-service

# 做小提交
git commit -m "refactor: 将验证提取到单独函数"
git commit -m "refactor: 重命名变量提高清晰度"
git commit -m "refactor: 提取自定义 useUser Hook"

# 运行完整测试套件
npm test

# 创建带有清晰描述的 PR
```

## 反模式

### 不要做

- ❌ 同时重构和添加功能
- ❌ 在重构期间留下失败的测试
- ❌ 改变行为的同时重构
- ❌ 重构你不理解的代码
- ❌ 做大的、彻底的更改

### 应该做

- ✅ 保持重构专注且小
- ✅ 每次更改后运行测试
- ✅ 为未覆盖的代码写测试
- ✅ 使用 linters 和 formatters
- ✅ 记录重大更改

## 重构工具

| 工具 | 用途 |
|------|------|
| VS Code | 重命名、提取、内联 |
| ESLint | 检测代码异味 |
| Prettier | 格式化代码 |
| Jest | 验证行为 |
| Git | 版本控制 |

---

## 参考资料

- Martin Fowler 的重构：https://refactoring.com/
- 《代码整洁之道》Robert Martin
- 《有效处理遗留代码》

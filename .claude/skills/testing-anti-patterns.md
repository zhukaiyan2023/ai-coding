---
name: testing-anti-patterns
description: 检测常见测试反模式，如脆弱断言、测试依赖、孤立性差等，对齐 superpowers
triggers:
  - 测试反模式
  - anti-pattern
  - 测试质量
  - test anti
  - 测试审查
---

# Skill: Testing Anti-Patterns

> 对齐 [testing-anti-patterns](https://github.com/obra/superpowers)

## 描述

检测和修复常见测试反模式，提高测试套件的可维护性和可靠性。

---

## 反模式分类

| 严重级别 | 反模式 | 影响 |
|----------|--------|------|
| 🔴 高 | 测试相互依赖 | 测试结果不稳定 |
| 🔴 高 | 脆弱断言 | 重构即崩溃 |
| 🟠 中 | 孤立性差 | 环境污染 |
| 🟠 中 | 断言不足 | 假阳性 |
| 🟡 低 | Magic Numbers | 可读性差 |

---

## 1. 脆弱断言 (Brittle Assertions)

### 问题描述
过度依赖具体的实现细节，导致任何微小变化都会让测试失败。

### 示例

```java
// ❌ 脆弱 - 测试 toString() 格式
@Test
void testUserCreation() {
    User user = userService.createUser(cmd);
    assertEquals("User{id=1, name=John, email=john@example.com, age=30}",
                 user.toString());
}

// ✅ 健壮 - 只测试关键属性
@Test
void testUserCreation() {
    User user = userService.createUser(cmd);
    assertEquals(1L, user.getId());
    assertEquals("John", user.getName());
    assertEquals("john@example.com", user.getEmail());
}
```

```typescript
// ❌ 脆弱 - 测试完整 JSON
test('should return user', () => {
  expect(JSON.stringify(user)).toBe('{"id":"1","name":"John"}');
});

// ✅ 健壮 - 使用对象匹配器
test('should return user', () => {
  expect(user).toEqual({ id: '1', name: 'John' });
});
```

### 检测规则
- [ ] 不测试 `toString()` 格式
- [ ] 不测试完整对象相等
- [ ] 使用部分匹配器 (`.toMatchObject`, `.toContainEqual`)

---

## 2. 测试相互依赖 (Test Interdependence)

### 问题描述
测试之间共享状态，导致测试顺序影响结果。

### 示例

```java
// ❌ 错误 - 静态共享状态
static User sharedUser;

@Test
void testCreateUser() {
    sharedUser = userService.createUser(cmd);
    assertNotNull(sharedUser);
}

@Test
void testUpdateUser() {
    sharedUser.setName("Updated"); // 可能受上一个测试影响
    userService.updateUser(sharedUser);
}
```

```java
// ❌ 错误 - 共享数据库状态
@Test
void testUserCount() {
    int count = userRepository.count();
    assertEquals(5, count); // 如果其他测试插入了数据就失败
}
```

### 正确做法

```java
// ✅ 正确 - 每个测试独立
@Test
void testCreateUser() {
    User user = userService.createUser(cmd);
    assertNotNull(user.getId());
}

@Test
void testUpdateUser() {
    User user = userService.createUser(cmd); // 自己创建测试数据
    user.setName("Updated");
    User updated = userService.updateUser(user);
    assertEquals("Updated", updated.getName());
}
```

### 检测规则
- [ ] 无 `static` 字段共享状态
- [ ] 每个测试创建自己的测试数据
- [ ] 不依赖其他测试的执行顺序

---

## 3. 孤立性差 (Poor Isolation)

### 问题描述
测试依赖外部系统（真实数据库、网络、文件系统），导致测试慢且不稳定。

### 示例

```java
// ❌ 错误 - 真实数据库
@Test
void testUserQuery() {
    User user = jdbcTemplate.queryForObject(
        "SELECT * FROM users WHERE id = 1");
    assertNotNull(user);
}
```

```java
// ❌ 错误 - 真实 HTTP 调用
@Test
void testPaymentGateway() {
    PaymentResult result = paymentService.charge(
        new PaymentRequest(cardNumber, amount)
    );
    // 依赖外部服务，可能失败
}
```

### 正确做法

```java
// ✅ 正确 - 使用 Mock
@Test
void testUserQuery() {
    when(userRepository.findById(1L))
        .thenReturn(Optional.of(testUser));

    User user = userService.getUser(1L);

    assertNotNull(user);
    verify(userRepository).findById(1L);
}

// ✅ 正确 - 使用 Testcontainers
@Test
void testWithRealDatabase() {
    @Container
    static MySQLContainer<?> mysql = new MySQLContainer<>("mysql:8");

    UserRepository repo = new JdbcUserRepository(mysql.getJdbcUrl());
    // 测试使用真实数据库，但与外部隔离
}
```

### 检测规则
- [ ] 外部依赖 (DB/API) 使用 Mock
- [ ] 避免真实网络调用
- [ ] 使用 Testcontainers 进行集成测试

---

## 4. 断言不足 (Insufficient Assertions)

### 问题描述
测试只检查"不抛异常"或部分结果，不验证实际行为。

### 示例

```java
// ❌ 错误 - 只验证不抛异常
@Test
void testUserCreation() {
    User user = userService.createUser(cmd);
    // 什么都没验证！
}

// ❌ 错误 - 验证不完整
@Test
void testOrderCalculation() {
    Order order = createOrder();
    Money total = calculator.calculateTotal(order);
    assertNotNull(total); // 只验证不为空
}
```

### 正确做法

```java
// ✅ 正确 - 充分断言
@Test
void testUserCreation() {
    User user = userService.createUser(cmd);

    assertNotNull(user.getId());
    assertEquals(cmd.getEmail(), user.getEmail());
    assertEquals(cmd.getName(), user.getName());
    assertNotNull(user.getCreatedAt());
    assertTrue(passwordEncoder.matches(cmd.getPassword(), user.getPassword()));
}

// ✅ 正确 - 验证所有重要属性
@Test
void testOrderCalculation() {
    Order order = createOrder(List.of(
        new OrderItem("A", new Money(100), 2),
        new OrderItem("B", new Money(50), 1)
    ));

    Money total = calculator.calculateTotal(order);

    assertEquals(new Money(250), total);
    assertEquals(2, total.getCurrency()); // 验证货币
}
```

### 检测规则
- [ ] 每个测试至少 2 个断言
- [ ] 验证返回值和副作用
- [ ] 验证异常类型和消息

---

## 5. Magic Numbers

### 问题描述
测试中使用硬编码数字，不解释其含义。

### 示例

```java
// ❌ 错误 - Magic Number
@Test
void testSessionTimeout() {
    assertEquals(86400000, user.getSessionTimeout());
}

// ✅ 正确 - 有名称的常量
@Test
void testSessionTimeout() {
    assertEquals(TimeUnit.DAYS.toMillis(1), user.getSessionTimeout());
    // 或
    assertEquals(ONE_DAY_IN_MILLIS, user.getSessionTimeout());
}
```

```typescript
// ❌ 错误
test('should validate age', () => {
  expect(validateAge(13)).toBe(false);
  expect(validateAge(18)).toBe(true);
  expect(validateAge(25)).toBe(true);
});

// ✅ 正确
test('should validate age', () => {
  expect(validateAge(MINOR_AGE - 1)).toBe(false); // 17
  expect(validateAge(ADULT_AGE)).toBe(true); // 18
  expect(validateAge(ADULT_AGE + 7)).toBe(true); // 25
});
```

### 检测规则
- [ ] 使用命名常量
- [ ] 数字有注释说明
- [ ] 边界值用变量提取

---

## 6. 断言顺序依赖 (Assertion Order Dependence)

### 问题描述
依赖 assertAll 中的顺序来验证，或 expect 顺序敏感。

### 示例

```java
// ❌ 错误 - 顺序敏感
assertEquals(a, first());
assertEquals(b, second());
assertEquals(c, third());
```

### 正确做法

```java
// ✅ 正确 - 无顺序
assertEquals(a, result.getFirst());
assertEquals(b, result.getSecond());
assertEquals(c, result.getThird());

// ✅ 正确 - 使用 assertAll
assertAll("user fields",
    () -> assertEquals("John", user.getName()),
    () -> assertEquals("john@example.com", user.getEmail()),
    () -> assertEquals(30, user.getAge())
);
```

---

## 7. 错误处理缺失 (Missing Error Handling)

### 问题描述
只测试 happy path，不测试异常情况。

### 示例

```java
// ❌ 错误 - 只测成功路径
@Test
void testUserCreation() {
    User user = userService.createUser(cmd);
    assertNotNull(user);
}
```

### 正确做法

```java
// ✅ 正确 - 覆盖异常路径
@Test
void shouldThrowWhenEmailInvalid() {
    CreateUserCmd invalidCmd = new CreateUserCmd("invalid-email", "password");

    IllegalArgumentException exception = assertThrows(
        IllegalArgumentException.class,
        () -> userService.createUser(invalidCmd)
    );

    assertEquals("Invalid email format", exception.getMessage());
}

@Test
void shouldThrowWhenUserNotFound() {
    assertThrows(UserNotFoundException.class,
        () -> userService.getUser(999L)
    );
}
```

### 检测规则
- [ ] Happy path 有测试
- [ ] 异常路径有测试
- [ ] 验证异常类型和消息

---

## 8. Time-Sensitive 测试

### 问题描述
测试依赖当前时间，导致时间变化时测试失败。

### 示例

```java
// ❌ 错误 - 使用当前时间
@Test
void testTokenExpiry() {
    Token token = tokenService.createToken(user);
    assertTrue(token.getExpiresAt().isAfter(LocalDateTime.now()));
}
```

### 正确做法

```java
// ✅ 正确 - 使用固定时间
@Test
void testTokenExpiry() {
    Clock fixedClock = Clock.fixed(
        Instant.parse("2024-01-01T00:00:00Z"),
        ZoneId.of("UTC")
    );
    TokenService service = new TokenService(clock);
    Token token = service.createToken(user);

    assertEquals(
        Instant.parse("2024-01-01T01:00:00Z"),
        token.getExpiresAt()
    );
}
```

---

## 检查清单

### 脆弱断言
- [ ] 不测试 toString() 格式
- [ ] 使用部分匹配器
- [ ] 不测试完整对象相等

### 测试独立性
- [ ] 无静态共享状态
- [ ] 每个测试创建自己的数据
- [ ] 无执行顺序依赖

### 测试孤立性
- [ ] 外部依赖使用 Mock
- [ ] 无真实网络调用
- [ ] 使用 Testcontainers 做集成测试

### 断言充分性
- [ ] 每个测试 ≥ 2 个断言
- [ ] 验证返回值和副作用
- [ ] 验证异常类型和消息

### 代码可读性
- [ ] 无 Magic Numbers
- [ ] 使用命名常量
- [ ] 断言有描述信息

---

## 修复流程

```
识别反模式 → 分析影响 → 制定修复计划 → 重构测试 → 验证通过
```

### 修复优先级

1. **P0 - 必须修复**: 测试相互依赖（导致 CI 不稳定）
2. **P1 - 应该修复**: 脆弱断言（阻碍重构）
3. **P2 - 建议修复**: 孤立性差（测试慢）
4. **P3 - 可选修复**: Magic Numbers（可读性）

---

## 验证命令

```bash
# 运行测试
mvn test
npm test
pytest

# 检查测试覆盖率
mvn jacoco:report
npm run coverage
pytest --cov

# 检查测试质量
mvn pitest    # Java 突变测试
npm run test:coverage  # 检查覆盖率
```

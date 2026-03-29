---
name: test-driven-development
description: TDD 测试驱动开发，红绿重构循环，对齐 superpowers
triggers:
  - tdd
  - 测试驱动
  - 红绿重构
  - test driven
  - red green
---

# Skill: Test Driven Development

> 对齐 [test-driven-development](https://github.com/obra/superpowers) 最佳实践

## 描述

TDD (Test-Driven Development) 测试驱动开发，通过快速迭代实现高质量代码。

---

## 核心循环

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│    ┌───────┐    写失败测试    ┌─────────┐                  │
│    │  RED  │ ──────────────▶ │  GREEN  │                  │
│    │ (失败) │                 │  (通过) │                  │
│    └───────┘                 └─────────┘                  │
│         ▲                          │                       │
│         │                          ▼                       │
│         │                   ┌───────────┐                   │
│         │                   │ REFACTOR  │                   │
│         │                   │   (重构)  │                   │
│         │                   └───────────┘                   │
│         │                          │                       │
│         └──────────────────────────┘                       │
│                      循环                                  │
└─────────────────────────────────────────────────────────────┘
```

## 三定律

1. **定律 1**：在编写能通过的代码前，先编写一个失败测试
2. **定律 2**：只编写刚好导致测试失败的单行代码
3. **定律 3**：只编写刚好让失败测试通过的代码

---

## 开发流程

### Step 1: RED - 编写失败测试

**目标**：编写一个描述期望行为的失败测试

```java
// Java/JUnit 5
@Test
void shouldReturnUserWhenValidIdProvided() {
    // Arrange - 准备测试数据
    Long userId = 1L;
    UserDTO expectedUser = new UserDTO(1L, "John", "john@example.com");

    // Act - 执行被测方法
    UserDTO actualUser = userService.getUser(userId);

    // Assert - 验证结果（此时测试应该失败）
    assertEquals(expectedUser.getId(), actualUser.getId());
    assertEquals(expectedUser.getEmail(), actualUser.getEmail());
}
```

```typescript
// TypeScript/Jest
describe('UserService', () => {
  it('should return user when valid id provided', async () => {
    // Arrange
    const userId = '1';
    const expectedUser = { id: '1', name: 'John', email: 'john@example.com' };

    // Act
    const actualUser = await userService.getUser(userId);

    // Assert
    expect(actualUser).toEqual(expectedUser);
  });
});
```

### Step 2: GREEN - 通过实现

**目标**：用最小代码让测试通过

```java
// 最小实现 - 让测试通过即可
public UserDTO getUser(Long id) {
    return new UserDTO(id, "John", "john@example.com"); // 硬编码数据通过测试
}
```

**原则**：
- 不要过度实现
- 测试通过后立即停止
- 可以暂时忽略最佳实践

### Step 3: REFACTOR - 重构

**目标**：在保持测试通过的同时改进代码

```java
// 重构后 - 真正的实现
public UserDTO getUser(Long id) {
    User user = userRepository.findById(id)
        .orElseThrow(() -> new UserNotFoundException(id));
    return userMapper.toDTO(user);
}
```

**重构检查清单**：
- [ ] 测试仍然通过
- [ ] 代码更清晰
- [ ] 无重复代码
- [ ] 遵循命名规范

---

## 测试结构 (AAA 模式)

```
┌─────────────────────────────────────────────────────────────┐
│                    Arrange (准备)                            │
│  - 设置测试数据                                              │
│  - 配置 mock 对象                                            │
│  - 准备预期结果                                              │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                      Act (执行)                              │
│  - 调用被测方法                                              │
│  - 触发被测事件                                              │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                    Assert (断言)                             │
│  - 验证返回值                                                │
│  - 验证副作用                                                │
│  - 验证 Mock 调用                                            │
└─────────────────────────────────────────────────────────────┘
```

---

## 测试分层

### 单元测试 (Unit Test)
- 测试单个类/方法
- 使用 Mock 隔离依赖
- 执行速度快

```java
@Test
void shouldCalculateOrderTotal() {
    // 单元测试 - 只测计算逻辑
    OrderCalculator calculator = new OrderCalculator();
    Order order = new Order(List.of(
        new OrderItem("Product A", 100, 2),
        new OrderItem("Product B", 50, 1)
    ));

    Money total = calculator.calculateTotal(order);

    assertEquals(new Money(250), total);
}
```

### 集成测试 (Integration Test)
- 测试多个组件协作
- 使用真实依赖或 Testcontainers
- 验证数据库/API 交互

```java
@Test
void shouldPersistUserWhenCreated() {
    // 集成测试 - 使用真实数据库
    @Container
    static MySQLContainer<?> mysql = new MySQLContainer<>("mysql:8");

    UserRepository repository = new JdbcUserRepository(dataSource);
    UserService service = new UserService(repository);

    User user = service.createUser(new CreateUserCmd("test@example.com"));

    assertNotNull(user.getId());
    assertTrue(repository.findById(user.getId()).isPresent());
}
```

### 端到端测试 (E2E Test)
- 测试完整业务流程
- 使用真实环境或 Selenium/Playwright
- 验证用户旅程

```typescript
// Playwright E2E
test('user can register and login', async ({ page }) => {
  await page.goto('/register');
  await page.fill('#email', 'test@example.com');
  await page.fill('#password', 'SecurePass123!');
  await page.click('#submit');

  await expect(page.locator('.success-message'))
    .toContainText('Registration successful');

  await page.goto('/login');
  await page.fill('#email', 'test@example.com');
  await page.fill('#password', 'SecurePass123!');
  await page.click('#submit');

  await expect(page).toHaveURL('/dashboard');
});
```

---

## 测试覆盖策略

### 覆盖优先级

| 优先级 | 测试内容 | 覆盖率目标 |
|--------|----------|-----------|
| P0 | 核心业务逻辑 | ≥ 90% |
| P1 | API 接口 | ≥ 80% |
| P2 | 边界条件 | ≥ 70% |
| P3 | 异常处理 | ≥ 60% |

### 边界条件测试

```java
@Test
void shouldThrowWhenEmailIsInvalid() {
    assertThrows(IllegalArgumentException.class,
        () -> userService.createUser(
            new CreateUserCmd("invalid-email", "password")
        )
    );
}

@Test
void shouldThrowWhenPasswordIsTooShort() {
    assertThrows(IllegalArgumentException.class,
        () -> userService.createUser(
            new CreateUserCmd("test@example.com", "123")
        )
    );
}

@Test
void shouldHandleNullUserGracefully() {
    UserDTO result = userService.getUser(null);
    assertNull(result);
}
```

---

## 测试命名规范

### 方法命名

```
should[ExpectedBehavior]When[Condition]
```

```java
@Test
void shouldReturnUserWhenValidIdProvided() { }

@Test
void shouldThrowExceptionWhenUserNotFound() { }

@Test
void shouldReturnEmptyListWhenNoUsersExist() { }
```

### 类命名

```
[ClassName]Tests
[ClassName]IT (集成测试)
[ClassName]E2E (端到端测试)
```

```
UserServiceTest.java
UserServiceIntegrationTest.java
UserRegistrationE2E.java
```

---

## 常见问题

### Q: 什么时候写测试？

**A**: TDD 流程要求先写测试。如果是修复 Bug，先写一个能复现 Bug 的测试。

### Q: 测试写多少就够了？

**A**: 遵循测试覆盖策略，核心业务 ≥ 90%，边界条件和异常 ≥ 70%。

### Q: 如何处理难以测试的代码？

**A**:
1. 考虑重构以提高可测试性
2. 使用依赖注入
3. 提取接口进行 Mock

### Q: 什么时候跳过 TDD？

**A**:
- 探索性编程/原型
- 简单的 getter/setter
- 明确的配置修改

---

## 检查清单

### TDD 流程
- [ ] 先写失败测试 (RED)
- [ ] 再写通过实现 (GREEN)
- [ ] 最后重构 (REFACTOR)
- [ ] 循环直到完成

### 测试质量
- [ ] 每个测试只测一个行为
- [ ] 使用 AAA 模式组织
- [ ] 断言清晰明确
- [ ] 无测试间依赖
- [ ] Mock 使用恰当

### 覆盖率
- [ ] 核心业务 ≥ 90%
- [ ] API 接口 ≥ 80%
- [ ] 边界条件 ≥ 70%
- [ ] 异常处理 ≥ 60%

---

## 验证命令

```bash
# Java/Maven
mvn test                           # 运行测试
mvn test -Dtest=*Test              # 运行特定测试
mvn jacoco:report                  # 生成覆盖率报告

# JS/TS/Jest
npm test                           # 运行测试
npm test -- --coverage             # 运行测试并显示覆盖率
npm test -- --watch                # 监听模式

# Python/pytest
pytest                             # 运行测试
pytest --cov=src --cov-report=html # 生成覆盖率报告
```

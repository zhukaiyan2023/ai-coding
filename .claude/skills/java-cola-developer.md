---
name: java-cola-developer
description: Java 21 + Spring Boot 4 + COLA DDD 开发，使用 TDD 驱动开发
triggers:
  - java
  - spring
  - cola
  - ddd
  - backend
  - 后端开发
  - 创建接口
  - 实现功能
---

# Skill: Java COLA Developer

> 对齐 [test-driven-development](https://github.com/obra/superpowers) 最佳实践

## 描述

使用此 Skill 进行后端 Java 21 + Spring Boot 4 + COLA DDD 开发，遵循 TDD 原则。

---

## TDD 开发流程

```
RED (失败测试) → GREEN (通过实现) → REFACTOR (重构)
```

### Step 1: 编写失败测试 (RED)

```java
@Test
void shouldCreateUserWhenValid() {
    // Arrange
    CreateUserCmd cmd = new CreateUserCmd("test@example.com", "password123");

    // Act
    UserDTO result = userService.createUser(cmd);

    // Assert
    assertNotNull(result.getId());
    assertEquals("test@example.com", result.getEmail());
}
```

### Step 2: 通过实现 (GREEN)

```java
public UserDTO createUser(CreateUserCmd cmd) {
    // 简单实现，满足测试即可
    User user = new User(cmd.email(), encrypt(cmd.password()));
    return userRepository.save(user).toDTO();
}
```

### Step 3: 重构 (REFACTOR)

```java
// 提取校验逻辑
private void validateCommand(CreateUserCmd cmd) {
    if (cmd.email() == null || cmd.email().isBlank()) {
        throw new IllegalArgumentException("Email is required");
    }
    // ... 更多校验
}
```

---

## JDK 21 新特性 (优先使用)

| 特性 | JEP | 使用场景 |
|------|-----|----------|
| Virtual Threads | JEP 444 | 高并发场景，使用 `Thread.ofVirtual()` |
| Pattern Matching for switch | JEP 441 | switch 表达式匹配对象类型 |
| Sequenced Collections | JEP 431 | 使用 `SequencedCollection` |
| Record | JEP 395 | **优先使用 Record** 作为 DTO、VO |
| Record Patterns | JEP 440 | `instanceof` 和 `switch` 中使用 record 解构 |
| Scoped Values | JEP 446 | 优先使用 `ScopedValue` 代替 `ThreadLocal` |
| String Templates | JEP 430 | 使用 `STR."..."` 模板字符串 |

### Record 使用规范

```java
// ✅ 使用 Record 作为 DTO/VO（不可变、安全）
public record UserDTO(Long id, String name, String email) {}

// ✅ Record 作为 Cmd/Qry
public record CreateUserCmd(
    @NotBlank String name,
    @Email String email
) {}

// ✅ 带校验的 Record
public record CreateUserCmd(
    @NotBlank String name,
    @Email String email,
    @Size(min = 8) String password
) {}
```

### 对象映射规范

```java
// ✅ 使用 MapStruct（编译时生成，性能好）
@Mapper(componentModel = "spring")
public interface UserMapper {
    UserEntity toEntity(UserDTO dto);
    UserDTO toDTO(UserEntity entity);
    UserVO toVO(UserEntity entity);
}

// ❌ 禁止使用 BeanUtils / BeanCopy
```

---

## COLA 架构

```
┌─────────────────────────────────────────────────────────────┐
│                         API Layer                           │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │ Controller  │  │    ROC      │  │    CmdHandler      │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
├─────────────────────────────────────────────────────────────┤
│                         App Layer                          │
│  ┌─────────────────────────────────────────────────────┐    │
│  │                   Domain Service                      │    │
│  └─────────────────────────────────────────────────────┘    │
├─────────────────────────────────────────────────────────────┤
│                       Domain Layer                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │ Aggregate   │  │   Entity    │  │    Value Object     │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
├─────────────────────────────────────────────────────────────┤
│                   Infrastructure Layer                     │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │ Repository  │  │    Mapper    │  │    External Svc    │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## 开发流程

### Step 1: 规划与发现

1. 理解需求，识别验收标准
2. 扫描代码库，了解现有结构
3. 构建计划（文件列表、依赖关系）
4. 输出：任务拆解 + 验证方案

### Step 2: 构建 (Build)

1. **TDD 驱动**：先写测试，再实现
2. **按序实现**：Domain → Infrastructure → App → API
3. **验证驱动**：每实现一个模块，运行单元测试

### Step 3: 验证 (Verify)

```bash
# 运行单元测试
mvn test

# 运行集成测试
mvn verify

# 生成覆盖率报告
mvn jacoco:report
```

### Step 4: 修复 (Fix)

1. 分析错误信息
2. 回溯原始需求
3. 修复问题
4. 重新验证

---

## Build-Verify 循环

```
while (任务未完成) {
    Build(实现当前步骤)
    if (!Verify(运行测试)) {
        Fix(修复问题)
    }
}
```

**关键原则**：
- 测试驱动开发 (TDD)
- 每个聚合根必须有对应测试
- 验证时对比需求规范，不是对比自己的代码

---

## 检查清单

### 代码质量
- [ ] Domain 层无外部依赖
- [ ] 聚合根包含领域方法
- [ ] 统一异常处理
- [ ] 日志记录关键节点
- [ ] 参数校验

### Build-Verify 循环
- [ ] 每个聚合根有对应单元测试
- [ ] 测试包含 happy path 和 edge cases
- [ ] 运行 `mvn test` 验证通过

### TDD 流程
- [ ] 先写失败测试 (RED)
- [ ] 再写通过实现 (GREEN)
- [ ] 最后重构 (REFACTOR)

### 时间分配
| 阶段 | 建议时间占比 |
|------|-------------|
| 规划与发现 | 20% |
| 构建 | 40% |
| 验证 | 30% |
| 修复 | 10% |

---

## 触发条件

| 关键词 | 说明 |
|--------|------|
| java | Java 开发 |
| spring | Spring 开发 |
| cola | COLA 架构 |
| ddd | 领域驱动设计 |
| 后端开发 | 后端接口 |
| 创建接口 | REST API 开发 |

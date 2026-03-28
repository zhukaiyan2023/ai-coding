# Skill: Java COLA Developer

## 描述
使用此 Skill 进行后端 Java 21 + Spring Boot 4 + COLA DDD 开发。

## JDK 21 新特性 (优先使用)

| 特性 | JEP | 使用场景 |
|------|-----|----------|
| Virtual Threads | JEP 444 | 高并发场景，使用 `Thread.ofVirtual()` |
| Pattern Matching for switch | JEP 441 | switch 表达式匹配对象类型 |
| Sequenced Collections | JEP 431 | 使用 `SequencedCollection`, `SequencedSet`, `SequencedMap` |
| Record | JEP 395 | **优先使用 Record** 作为 DTO、VO、DTO 组装 |
| Record Patterns | JEP 440 | `instanceof` 和 `switch` 中使用 record 解构 |
| Unnamed Patterns | JEP 443 | 不使用的变量用 `_` 替代 |
| Scoped Values | JEP 446 | 优先使用 `ScopedValue` 代替 `ThreadLocal` |
| String Templates | JEP 430 | 使用 `STR."..."` 模板字符串 |

### Record 使用规范

```java
// ✅ 使用 Record 作为 DTO/VO（不可变、安全）
public record UserDTO(Long id, String name, String email) {}

// ✅ Record 作为 Cmd/Qry
public record CreateUserCmd(String name, String email) {}

// ✅ 带校验的 Record
public record CreateUserCmd(
    @NotBlank String name,
    @Email String email
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

## 适用场景
- 创建新的 COLA 模块
- 实现领域实体和聚合根
- 开发 RESTful API 接口
- 实现响应式编程（WebFlux）

---

## 工作流

### Step 1: 需求分析 (必须)

1. 分析需求，确定 Bounded Context
2. 确定涉及的 COLA 层：API / APP / Domain / Infrastructure
3. 识别领域对象：实体、值对象、仓储接口
4. **输出**：模块结构 + 对象列表

### Step 2: 代码生成 (按顺序)

#### 2.1 Domain 层 (最核心)

```
创建顺序：值对象 → 实体 → 聚合根 → 仓储接口 → 领域服务
```

- 值对象：不可变，使用 `@ValueObject` 或 JSR-303 注解
- 聚合根：包含 `@Entity` + `@Id` + `version` + 领域方法
- 仓储接口：定义 `Mono<Entity>` / `Flux<Entity>` 返回类型

#### 2.2 Infrastructure 层

- 实现仓储接口
- Mapper / Converter
- **禁止**在此层写业务逻辑

#### 2.3 Application 层

- Cmd / Qry 定义
- Executor 处理
- 调用 Domain Service

#### 2.4 API 层

- **使用 Record 定义** DTO (Cmd, Qry, ROC, VO)
- Facade 接口
- Controller 实现

### Step 3: 响应式适配

- Controller → `Mono<ResponseEntity<ROC>>` / `Flux<ResponseEntity<List<VO>>>`
- Service → `Mono<Entity>` / `Flux<Entity>`
- Repository → `Mono<Entity>` / `Flux<Entity>`

### Step 4: 验证

1. 编译检查：`mvn compile`
2. 单元测试：Domain Service 100% 覆盖
3. 接口测试：关键路径覆盖

---

## 任务分解示例

### 场景：创建用户模块

**分解任务**（并行执行）：

| 任务 | 层 | 依赖 |
|------|-----|------|
| UserStatus 值对象 | Domain | - |
| UserAggregate | Domain | UserStatus |
| UserRepository 接口 | Domain | UserAggregate |
| UserRepositoryImpl | Infrastructure | UserRepository |
| CreateUserCmd | API | - |
| UserROC | API | - |
| CreateUserCmdHandler | App | CreateUserCmd, UserAggregate |
| UserController | API | CreateUserCmdHandler |

---

## 检查清单

- [ ] Domain 层无外部依赖
- [ ] 聚合根包含领域方法
- [ ] 响应式方法返回 Mono/Flux
- [ ] 统一异常处理
- [ ] 日志记录关键节点
- [ ] 参数校验

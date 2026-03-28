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

## Agent 工作流 (Harness Engineering)

> 参考: [Anthropic: Harness design for long-running apps](https://www.anthropic.com/engineering/harness-design-long-running-apps)

### 三智能体架构 (GAN-style)

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Planner   │────▶│  Generator  │────▶│  Evaluator  │
│   (规划)    │     │   (生成)    │     │   (评估)    │
└─────────────┘     └─────────────┘     └─────────────┘
      │                   │                   │
      │                   │                   │
      └───────────────────┴───────────────────┘
                    迭代循环
```

**核心原则**：
- **Evaluator 必须独立于 Generator**：不要让生成者评估自己的代码
- **分离"做事"和"挑错"**：独立的 Evaluator 更客观
- **Sprint Contract**：实现前协商完成标准

---

### Planner: 需求 → 详细规范

**输入**：简单需求 (1-4 句话)

**输出**：完整产品规范，包含：
- 功能列表（拆分为多个 Sprint）
- 高中级技术设计
- 每个 Sprint 的验收标准
- AI 增强功能的机会

**Prompt 策略**：
- 保持高目标，鼓励更大功能范围
- 关注产品上下文和高级设计
- 避免过度详细的实现细节

---

### Generator: 一次实现一个功能

**原则**：
- 一次只实现一个功能/Sprint
- 完成后自评
- 交接给 QA 前确保代码可运行

---

### Evaluator: 独立 QA 测试

**评估标准**（参考 Anthropic 前端设计实验）：

| 维度 | 描述 |
|------|------|
| **Product Depth** | 功能是否完整可用，还是 stub？ |
| **Functionality** | 核心功能是否真正工作？ |
| **Visual Design** | 界面是否美观一致？ |
| **Code Quality** | 代码是否清晰可维护？ |

**评估方式**：
- 使用 JUnit + MockMvc 测试 API
- 使用 Testcontainers 测试数据库
- 检查边界条件和错误处理

---

### Sprint Contract 协商流程

```
Generator: "我计划实现用户注册功能，完成标准是：
  1. POST /api/users 返回 201
  2. 用户名重复返回 400
  3. 密码加密存储"

Evaluator: "同意完成标准。建议补充：
  - 邮箱格式验证
  - 密码强度要求"

双方达成一致 → 开始实现
```

---

### Step 1: 规划与发现 (Planning & Discovery)

1. **读取任务需求**，理解验收标准
2. **扫描代码库**，了解现有结构和依赖
3. **构建初始计划**，包含：
   - 需要创建/修改的文件
   - COLA 各层实现顺序
   - 如何验证解决方案
4. **输出**：任务拆解 + 验证方案

### Step 2: 构建 (Build)

1. **按序实现**：Domain → Infrastructure → App → API
2. **编写测试**：包含 happy path 和 edge cases
3. **验证驱动开发**：每实现一个模块，运行单元测试

### Step 3: 验证 (Verify)

1. **运行测试**：`mvn test`
2. **检查输出**：对比实际结果与需求是否一致
3. **不要只读自己的代码确认"看起来对"**

### Step 4: 修复 (Fix)

1. 分析错误信息
2. 回溯原始需求
3. 修复问题
4. 重新验证

---

### Build-Verify 循环 (核心)

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

### 时间预算分配

| 阶段 | 建议时间占比 | 说明 |
|------|-------------|------|
| 规划与发现 | 20% | 充分理解需求和代码库 |
| 构建 | 40% | 实现核心功能 |
| 验证 | 30% | 运行测试，确保正确 |
| 修复 | 10% | 快速修复问题 |

**时间紧张时**：优先保证验证通过，交付可工作的代码

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

### 代码质量
- [ ] Domain 层无外部依赖
- [ ] 聚合根包含领域方法
- [ ] 响应式方法返回 Mono/Flux
- [ ] 统一异常处理
- [ ] 日志记录关键节点
- [ ] 参数校验

### Build-Verify 循环
- [ ] 每个聚合根有对应单元测试
- [ ] 测试包含 happy path 和 edge cases
- [ ] 运行 `mvn test` 验证通过
- [ ] 不要在代码"看起来对"就停止

### Doom Loop 预防
- [ ] 同一文件修改超过 3 次？考虑重新评估方案
- [ ] 遇到重复错误？回溯需求，重新设计
- [ ] 验证失败超过 2 次？暂停并重新分析问题

### Evaluator 检查
- [ ] 独立 Evaluator 已运行测试
- [ ] 核心 API 端点已验证
- [ ] 数据库操作已验证
- [ ] 边界条件已测试
- [ ] 错误处理已验证
- [ ] Sprint Contract 中的所有标准已满足

# Java COLA Core Rules

## 核心规范 (必须遵守)

### 1. DTO/VO 使用 Record
```java
// ✅ 正确
public record UserDTO(Long id, String name) {}

// ❌ 错误
public class UserDTO { ... }
```

### 2. 对象映射用 MapStruct
```java
// ✅ 正确
@Mapper
public interface UserMapper { }

// ❌ 错误
BeanUtils.copyProperties()
```

### 3. 参数校验
```java
public record CreateCmd(
    @NotBlank String name,
    @Email String email
) {}
```

### 4. 响应式返回
```java
Mono<UserDTO> createUser(CreateCmd cmd);
Flux<UserDTO> listUsers();
```

### 5. COLA 分层
- `domain/` - 领域层，无外部依赖
- `infrastructure/` - 基础设施层
- `app/` - 应用层
- `api/` - 接口层

## 快速检查清单
- [ ] 使用 Record 代替 class 作为 DTO
- [ ] 禁止 BeanUtils
- [ ] 有 @NotBlank/@Email 校验
- [ ] 聚合根有领域方法
- [ ] 异常统一处理

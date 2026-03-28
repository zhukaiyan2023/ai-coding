---
name: tdd-development
description: 测试驱动开发工作流，使用红-绿-重构循环。在实现新功能或修复错误时使用，以确保测试覆盖率和代码质量。
---

# TDD 开发技能

## 概述

此技能强制执行测试驱动开发（TDD）方法，采用严格的红-绿-重构循环。它确保所有代码更改都有测试支持并保持高质量的代码。

## 使用场景

- 实现新功能
- 修复错误
- 添加 API 端点
- 创建数据库操作
- 任何应该有测试覆盖率的代码更改

## TDD 工作流

### 1. 红 - 编写失败的测试

```typescript
// 步骤 1：先写测试（必须失败）
// tests/user.service.spec.ts

describe('UserService', () => {
  it('应该创建新用户', async () => {
    // Arrange - 安排测试数据和条件
    const userData = {
      name: '张三',
      email: 'zhangsan@example.com'
    };

    // Act - 执行被测试的函数
    const result = await userService.create(userData);

    // Assert - 验证预期结果
    expect(result).toBeDefined();
    expect(result.id).toBeDefined();
    expect(result.name).toBe('张三');
  });
});
```

### 2. 绿 - 编写最少代码

```typescript
// 步骤 2：只写足够通过测试的代码
// src/services/user.service.ts

class UserService {
  async create(data: CreateUserDto): Promise<User> {
    return {
      id: 'temp-id',
      name: data.name,
      email: data.email,
      createdAt: new Date()
    };
  }
}
```

### 3. 重构 - 改进代码

```typescript
// 步骤 3：在保持测试通过的同时重构
// src/services/user.service.ts

import { Injectable } from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';
import { CreateUserDto } from '../dto/create-user.dto';
import { User } from '../entities/user.entity';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async create(dto: CreateUserDto): Promise<User> {
    const user = new User({
      name: dto.name,
      email: dto.email
    });
    return this.userRepository.save(user);
  }
}
```

## 测试结构

### AAA 模式

```
A - Arrange: 设置测试数据和条件
A - Act: 执行被测试的函数
A - Assert: 验证预期结果
```

### 测试命名

```typescript
// 好：描述性强且具体
describe('UserService', () => {
  it('当邮箱无效时抛出 BadRequestException');
  it('创建成功时返回带有生成 ID 的用户');
  it('使用正确参数调用 userRepository.save');
});

// 不好：模糊且笼统
describe('UserService', () => {
  it('应该工作');
  it('测试创建用户');
});
```

## 测试覆盖率要求

| 模块类型 | 最低覆盖率 |
|---------|-----------|
| 核心业务逻辑 | 90% |
| 服务层 | 80% |
| 控制器 | 70% |
| 工具函数 | 80% |
| 边界情况 | 100% |

## 运行测试

```bash
# 监听模式运行测试
npm run test:watch

# 带覆盖率运行测试
npm run test:cov

# 运行特定测试文件
npm run test -- user.service.spec.ts

# CI 模式运行测试
npm run test:ci
```

## 质量门禁

- 所有测试必须通过
- 覆盖率必须达到最低阈值
- 测试文件中无 console.log
- 无测试跳过注释（已知问题除外）
- 测试必须独立（无执行顺序依赖）

## 常见模式

### Mock 依赖

```typescript
// 使用 Jest mocks
const mockUserRepository = {
  save: jest.fn(),
  findOne: jest.fn(),
  delete: jest.fn()
};

beforeEach(() => {
  jest.clearAllMocks();
});
```

### 异步测试

```typescript
it('处理异步操作', async () => {
  const mockUser = { id: '1', name: '张三' };
  mockUserRepository.save.mockResolvedValue(mockUser);

  const result = await userService.create({ name: '张三' });

  expect(result).toEqual(mockUser);
  expect(mockUserRepository.save).toHaveBeenCalledTimes(1);
});
```

### 错误测试

```typescript
it('未找到用户时抛出错误', async () => {
  mockUserRepository.findOne.mockResolvedValue(null);

  await expect(userService.findById('invalid-id'))
    .rejects.toThrow(NotFoundException);
});
```

## 反模式

### 不要做

- 在实现后写测试（跳过 TDD）
- 删除失败的测试来"通过"
- 写没有断言的测试
- 使用 `as any` 绕过类型检查
- 创建依赖执行顺序的测试
- 留下 console.log 语句

### 应该做

- 先写测试（红阶段）
- 保持测试专注和原子性
- 使用描述性测试名称
- Mock 外部依赖
- 测试边界情况和错误场景
- 自信地重构（测试保护你）

## 与开发工作流的集成

1. **理解需求** → 分解为可测试的单元
2. **写失败的测试（红）** → 运行测试，验证失败
3. **写最少代码（绿）** → 实现刚好通过的内容
4. **重构** → 改进代码同时保持测试绿色
5. **提交** → 原子性提交并描述性消息
6. **重复** → 下一个功能/修复

---

## 参考资料

- Jest 文档：https://jestjs.io/
- 测试最佳实践：https://testing-library.com/
- TDD 循环：https://martinfowler.com/bliki/TestDrivenDevelopment.html

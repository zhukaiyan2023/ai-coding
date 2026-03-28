---
name: tdd-development
description: Test-driven development workflow with RED-GREEN-REFACTOR cycle. Use when implementing new features or fixing bugs to ensure test coverage and code quality.
---

# TDD Development Skill

## Overview

This skill enforces Test-Driven Development (TDD) methodology with a strict RED-GREEN-REFACTOR cycle. It ensures all code changes are backed by tests and maintain high code quality.

## When to Use

- Implementing new features
- Fixing bugs
- Adding API endpoints
- Creating database operations
- Any code change that should have test coverage

## TDD Workflow

### 1. RED - Write Failing Test

```typescript
// Step 1: Write the test first (it MUST fail)
// tests/user.service.spec.ts

describe('UserService', () => {
  it('should create a new user', async () => {
    // Arrange
    const userData = {
      name: 'John Doe',
      email: 'john@example.com'
    };

    // Act
    const result = await userService.create(userData);

    // Assert
    expect(result).toBeDefined();
    expect(result.id).toBeDefined();
    expect(result.name).toBe('John Doe');
  });
});
```

### 2. GREEN - Write Minimum Code

```typescript
// Step 2: Write ONLY enough code to pass the test
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

### 3. REFACTOR - Improve Code

```typescript
// Step 3: Refactor while keeping tests passing
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

## Test Structure

### AAA Pattern

```
A - Arrange: Set up test data and conditions
A - Act: Execute the function being tested
A - Assert: Verify the expected outcome
```

### Test Naming

```typescript
// Good: Descriptive and specific
describe('UserService', () => {
  it('should throw BadRequestException when email is invalid');
  it('should return user with generated id on successful creation');
  it('should call userRepository.save with correct parameters');
});

// Bad: Vague and generic
describe('UserService', () => {
  it('should work');
  it('test create user');
});
```

## Test Coverage Requirements

| Module Type | Minimum Coverage |
|-------------|------------------|
| Core Business Logic | 90% |
| Services | 80% |
| Controllers | 70% |
| Utilities | 80% |
| Edge Cases | 100% |

## Running Tests

```bash
# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:cov

# Run specific test file
npm run test -- user.service.spec.ts

# Run tests in CI mode
npm run test:ci
```

## Quality Gates

- All tests must pass
- Coverage must meet minimum thresholds
- No console.log in test files
- No test skip comments (except for known issues)
- Tests must be independent (no order dependency)

## Common Patterns

### Mocking Dependencies

```typescript
// Use Jest mocks
const mockUserRepository = {
  save: jest.fn(),
  findOne: jest.fn(),
  delete: jest.fn()
};

beforeEach(() => {
  jest.clearAllMocks();
});
```

### Async Testing

```typescript
it('should handle async operations', async () => {
  const mockUser = { id: '1', name: 'John' };
  mockUserRepository.save.mockResolvedValue(mockUser);

  const result = await userService.create({ name: 'John' });

  expect(result).toEqual(mockUser);
  expect(mockUserRepository.save).toHaveBeenCalledTimes(1);
});
```

### Error Testing

```typescript
it('should throw error when user not found', async () => {
  mockUserRepository.findOne.mockResolvedValue(null);

  await expect(userService.findById('invalid-id'))
    .rejects.toThrow(NotFoundException);
});
```

## Anti-Patterns

### DO NOT

- Write tests after implementation (skip TDD)
- Delete failing tests to "pass"
- Write tests without assertions
- Use `as any` to bypass type checking
- Create tests that depend on execution order
- Leave console.log statements in tests

### DO

- Write tests first (RED phase)
- Keep tests focused and atomic
- Use descriptive test names
- Mock external dependencies
- Test edge cases and error scenarios
- Refactor with confidence (tests protect you)

## Integration with Development Flow

1. **Understand Requirements** → Break down into testable units
2. **Write Failing Test (RED)** → Run test, verify it fails
3. **Write Minimum Code (GREEN)** → Implement just enough to pass
4. **Refactor** → Improve code while keeping tests green
5. **Commit** → Atomic commit with descriptive message
6. **Repeat** → Next feature/fix

---

## References

- Jest Documentation: https://jestjs.io/
- Testing Best Practices: https://testing-library.com/
- TDD Cycle: https://martinfowler.com/bliki/TestDrivenDevelopment.html

---
name: ios-developer
description: iOS 原生开发 (Swift)，遵循 TDD 原则
triggers:
  - ios
  - swift
  - iphone
  - app
  - xcode
---

# Skill: iOS Developer

> 对齐 [test-driven-development](https://github.com/obra/superpowers) 最佳实践

## 描述

使用此 Skill 进行 iOS 原生开发 (Swift)。

---

## TDD 开发流程

```
RED (失败测试) → GREEN (通过实现) → REFACTOR (重构)
```

### Step 1: 编写失败测试 (RED)

```swift
// 测试 ViewModel
final class UserViewModelTests: XCTestCase {
    func test_shouldLoadUser_WhenValidId() async {
        // Arrange
        let sut = UserViewModel(service: MockUserService())

        // Act
        await sut.loadUser(id: 1)

        // Assert
        XCTAssertNotNil(sut.user)
        XCTAssertEqual(sut.user?.id, 1)
    }
}
```

### Step 2: 通过实现 (GREEN)

```swift
// 简单实现
@MainActor
class UserViewModel: ObservableObject {
    @Published var user: User?

    private let service: UserServiceProtocol

    init(service: UserServiceProtocol = UserService()) {
        self.service = service
    }

    func loadUser(id: Int) async {
        user = try? await service.getUser(id: id)
    }
}
```

### Step 3: 重构 (REFACTOR)

```swift
// 提取协议
protocol UserServiceProtocol {
    func getUser(id: Int) async throws -> User
}
```

---

## 架构 (MVVM + Coordinator)

```
Features/{Module}/
├── Views/          # SwiftUI / UIKit
├── ViewModels/     # MVVM
├── Models/         # 数据模型
├── Services/       # 网络服务
└── Coordinators/   # 导航协调
```

---

## 状态管理

| 场景 | 方案 |
|------|------|
| 全局状态 | @Published in ObservableObject |
| 服务端状态 | Combine Publisher |
| 局部状态 (SwiftUI) | @State / @StateObject |
| 局部状态 (UIKit) | @Published in 本地 ObservableObject |
| 持久化状态 | @AppStorage / UserDefaults |

---

## 任务分解

| 任务 | 依赖 |
|------|------|
| Model 定义 | - |
| Service Protocol | - |
| Service 实现 | Service Protocol |
| ViewModel | Service |
| View | ViewModel |
| Cell / Component | - |

---

## 开发流程

### Step 1: 规划

1. 理解需求，识别验收标准
2. 设计数据模型
3. 确定 API 接口
4. 输出任务分解

### Step 2: 构建 (Build)

1. **TDD 驱动**：先写测试，再实现
2. **按序实现**：Model → Service → ViewModel → View
3. **验证驱动**：运行单元测试

### Step 3: 验证 (Verify)

```bash
# 运行测试
xcodebuild test -scheme YourScheme

# 检查覆盖率
xcodebuild test -scheme YourScheme -enableCodeCoverage YES
```

---

## Swift 最佳实践

### Protocol 依赖注入

```swift
// ✅ 正确
class UserViewModel {
    private let service: UserServiceProtocol

    init(service: UserServiceProtocol) {
        self.service = service
    }
}

// ❌ 错误 - 直接依赖具体实现
class UserViewModel {
    private let service = UserService()
}
```

### Combine 处理异步

```swift
// ✅ 使用 Combine
func loadUser() -> AnyPublisher<User, Error> {
    service.fetchUser()
        .receive(on: DispatchQueue.main)
        .eraseToAnyPublisher()
}
```

---

## 检查清单

### 代码质量
- [ ] 遵循 Swift API Design Guidelines
- [ ] Protocol 依赖注入
- [ ] Combine 处理异步
- [ ] 错误处理完整 (Result Type)
- [ ] 值类型优先 (struct over class)

### TDD 流程
- [ ] 先写失败测试 (RED)
- [ ] 再写通过实现 (GREEN)
- [ ] 最后重构 (REFACTOR)

### 性能
- [ ] 列表懒加载
- [ ] 图片缓存
- [ ] 避免主线程阻塞

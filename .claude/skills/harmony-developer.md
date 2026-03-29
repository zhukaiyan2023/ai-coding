---
name: harmony-developer
description: 鸿蒙应用开发 (ArkTS + ArkUI)，遵循 TDD 原则
triggers:
  - harmonyos
  - 鸿蒙
  - arkts
  - arkui
  - harmony
---

# Skill: HarmonyOS Developer

> 对齐 [test-driven-development](https://github.com/obra/superpowers) 最佳实践

## 描述

使用此 Skill 进行鸿蒙应用开发 (ArkTS + ArkUI)。

---

## TDD 开发流程

```
RED (失败测试) → GREEN (通过实现) → REFACTOR (重构)
```

### Step 1: 编写失败测试 (RED)

```typescript
// 测试 ViewModel
@Extend(Test)
class UserViewModelTest {
  @Test
  async shouldLoadUserWhenValid() {
    // Arrange
    const vm = new UserViewModel();

    // Act
    await vm.loadUser(1);

    // Assert
    expect(vm.user).not().toBeNull();
  }
}
```

### Step 2: 通过实现 (GREEN)

```typescript
// 简单实现
@Observable
class UserViewModel {
  user: User | null = null;

  async loadUser(id: number) {
    const user = await UserService.getUser(id);
    this.user = user;
  }
}
```

### Step 3: 重构 (REFACTOR)

```typescript
// 提取服务
class UserViewModel {
  private userService: UserService;

  constructor(userService: UserService = new UserService()) {
    this.userService = userService;
  }
}
```

---

## 架构

```
features/{module}/
├── pages/        # 页面
├── components/   # 组件
├── viewmodel/    # ViewModel
├── model/        # 数据模型
└── services/     # 服务
```

---

## 状态管理

| 场景 | 方案 |
|------|------|
| 全局状态 | AppStorage / LocalStorage |
| 服务端状态 | httpRequest + Fetch |
| 响应式状态 | @State / @Link / @Prop |
| Observable | @Observed / @ObjectLink |

---

## 任务分解

| 任务 | 依赖 |
|------|------|
| Model 定义 | - |
| Service | - |
| ViewModel | Service |
| Page | ViewModel |
| Component | - |

---

## 开发流程

### Step 1: 规划

1. 理解需求，识别验收标准
2. 设计数据模型
3. 确定 API 接口
4. 输出任务分解

### Step 2: 构建 (Build)

1. **TDD 驱动**：先写测试，再实现
2. **按序实现**：Model → Service → ViewModel → Page
3. **验证驱动**：运行单元测试

### Step 3: 验证 (Verify)

```bash
# 运行测试
hdc shell test

# 编译检查
hb build
```

---

## 检查清单

### 代码质量
- [ ] 遵循 ArkUI 开发规范
- [ ] @Observed 响应式状态
- [ ] @Component 组件化
- [ ] LazyForEach 优化列表
- [ ] 错误处理完整

### TDD 流程
- [ ] 先写失败测试 (RED)
- [ ] 再写通过实现 (GREEN)
- [ ] 最后重构 (REFACTOR)

### 性能
- [ ] 列表懒加载
- [ ] 图片按需加载
- [ ] 避免过度渲染

# Skill: iOS Developer

## 描述
使用此 Skill 进行 iOS 原生开发 (Swift)。

---

## 工作流

### Step 1: 需求分析
1. 分析功能模块
2. 确定 API 接口
3. 确定架构模式 (MVVM + Coordinator)

### Step 2: 架构搭建

```
Features/{Module}/
├── Views/        # UIKit / SwiftUI
├── ViewModels/   # MVVM
├── Models/       # 数据模型
└── Services/     # 网络服务
```

### Step 3: 状态管理

| 场景 | 方案 |
|------|------|
| 全局状态 | @Published in ObservableObject |
| 服务端状态 | Combine Publisher |
| 局部状态 (SwiftUI) | @State |
| 局部状态 (UIKit) | @Published in 本地 ObservableObject |

### Step 4: 任务分解

| 任务 | 依赖 |
|------|------|
| Model 定义 | - |
| Service | - |
| ViewModel | Service |
| View | ViewModel |
| Cell / Component | - |

### 检查清单

- [ ] 遵循 Swift API Design Guidelines
- [ ] Protocol 依赖注入
- [ ] Combine 处理异步
- [ ] 错误处理完整

---

## SKILL_DECISION (必须输出)

```
[SKILL_DECISION]
selected_skill: ios-developer
reason: 涉及iOS/Swift开发
rejected_skills:
  - java-cola-developer: 不是后端任务
  - react-developer: 不是前端任务
  - harmony-developer: 不是鸿蒙任务

rules_hit:
  - Swift API Guidelines: 遵循命名规范
  - Protocol依赖注入: 使用了协议

rules_missed:
  - Combine: 简单场景不需要
```

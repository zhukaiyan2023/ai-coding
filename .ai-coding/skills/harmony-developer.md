# Skill: HarmonyOS Developer

## 描述
使用此 Skill 进行鸿蒙应用开发 (ArkTS + ArkUI)。

---

## 工作流

### Step 1: 需求分析
1. 分析功能模块
2. 确定 API 接口
3. 确定状态管理方案

### Step 2: 架构搭建

```
features/{module}/
├── pages/        # 页面
├── components/   # 组件
├── viewmodel/    # ViewModel
└── services/     # 服务
```

### Step 3: 状态管理

| 场景 | 方案 |
|------|------|
| 全局状态 | AppStorage |
| 服务端状态 | httpRequest |
| 局部状态 | @State / @Link |

### Step 4: 任务分解

| 任务 | 依赖 |
|------|------|
| Model 定义 | - |
| Service | - |
| ViewModel | Service |
| Page | ViewModel |
| Component | - |

### 检查清单

- [ ] 遵循 ArkUI 开发规范
- [ ] @Observed 响应式状态
- [ ] @Component 组件化
- [ ] LazyForEach 优化列表

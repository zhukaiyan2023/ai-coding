# Skill: Reactor Developer

## 描述
使用此 Skill 进行 Reactor (React) 前端开发。

---

## 工作流

### Step 1: 需求分析
1. 分析功能模块
2. 确定 API 接口
3. 确定状态管理方案

### Step 2: 架构搭建

```
features/{module}/
├── components/    # UI 组件
├── hooks/         # 业务 Hooks
├── services/      # API 调用
└── types.ts       # 类型定义
```

### Step 3: 状态管理

| 场景 | 方案 |
|------|------|
| 全局状态 | Zustand / Recoil |
| 服务端状态 | React Query |
| 局部状态 | useState |

### Step 4: 任务分解

| 任务 | 依赖 |
|------|------|
| 类型定义 | - |
| API 方法 | 类型 |
| 业务 Hook | API |
| 组件 | Hook |
| 页面组装 | 组件 |

### 检查清单

- [ ] TypeScript 严格模式
- [ ] 组件懒加载
- [ ] 统一错误处理
- [ ] 敏感数据不硬编码

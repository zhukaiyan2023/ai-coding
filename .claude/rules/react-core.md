# React Core Rules

## 核心规范 (必须遵守)

### 1. TypeScript 严格模式
```typescript
// ✅ 正确
const name: string = "test";

// ❌ 错误
const name: any = "test";
```

### 2. 状态管理选型
| 场景 | 方案 |
|------|------|
| 服务端数据 | React Query |
| 全局UI状态 | Zustand |
| 局部状态 | useState |

### 3. 组件结构
```typescript
// features/{module}/
// ├── components/
// ├── hooks/
// ├── services/
// └── types.ts
```

### 4. 必做检查
- [ ] 无 `any` 类型
- [ ] 大组件用 `React.lazy`
- [ ] 错误边界处理
- [ ] 敏感数据不硬编码

### 5. 任务分解顺序
1. 类型定义
2. API 服务
3. 自定义 Hook
4. 组件实现
5. 页面组装

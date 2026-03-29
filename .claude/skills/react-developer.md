---
name: react-developer
description: React 前端开发，TypeScript + TDD，对齐 artifacts-builder
triggers:
  - react
  - frontend
  - typescript
  - 前端
  - component
---

# Skill: React Developer

> 对齐 [artifacts-builder](https://github.com/anthropics/skills) 最佳实践

## 描述

使用此 Skill 进行 React 前端开发。

---

## TDD 开发流程

```
RED (失败测试) → GREEN (通过实现) → REFACTOR (重构)
```

### Step 1: 编写失败测试 (RED)

```typescript
// 测试 Component
describe('UserList', () => {
  it('should render users when loaded', async () => {
    // Arrange
    const users = [{ id: 1, name: 'John' }];
    render(<UserList users={users} />);

    // Act & Assert
    expect(screen.getByText('John')).toBeInTheDocument();
  });

  it('should show loading state', () => {
    render(<UserList loading={true} />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });
});
```

### Step 2: 通过实现 (GREEN)

```typescript
// 简单实现
function UserList({ users, loading }: UserListProps) {
  if (loading) {
    return <Spinner />;
  }

  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

### Step 3: 重构 (REFACTOR)

```typescript
// 提取 Hook
function useUserList() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchUsers().then(setUsers).finally(() => setLoading(false));
  }, []);

  return { users, loading };
}
```

---

## 架构

```
features/{module}/
├── components/    # UI 组件
├── hooks/         # 业务 Hooks
├── services/      # API 调用
├── types.ts       # 类型定义
└── index.ts       # 导出
```

---

## 状态管理

| 场景 | 方案 |
|------|------|
| 全局状态 | Zustand / Redux Toolkit |
| 服务端状态 | React Query / SWR |
| 表单状态 | React Hook Form |
| 局部状态 | useState / useReducer |

---

## 任务分解

| 任务 | 依赖 |
|------|------|
| 类型定义 | - |
| API 方法 | 类型 |
| 业务 Hook | API |
| 组件 | Hook |
| 页面组装 | 组件 |

---

## 开发流程

### Step 1: 规划

1. 理解需求，识别验收标准
2. 设计组件结构
3. 确定 API 接口
4. 确定状态管理方案
5. 输出任务分解

### Step 2: 构建 (Build)

1. **TDD 驱动**：先写测试，再实现
2. **按序实现**：类型 → API → Hook → 组件
3. **验证驱动**：运行单元测试

### Step 3: 验证 (Verify)

```bash
# 运行测试
npm test

# 类型检查
npm run typecheck

# Lint 检查
npm run lint
```

---

## React 最佳实践

### 组件设计原则

```typescript
// ✅ 受控组件
function Input({ value, onChange }: InputProps) {
  return <input value={value} onChange={onChange} />;
}

// ✅ 组合优先
function Dialog({ children }: { children: React.ReactNode }) {
  return <div className="dialog">{children}</div>;
}

// ✅ 提取副作用
function UserProfile({ userId }: { userId: string }) {
  const { data: user, isLoading } = useUser(userId);
  // ...
}
```

### TypeScript 严格模式

```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true
  }
}
```

---

## 检查清单

### 代码质量
- [ ] TypeScript 严格模式
- [ ] 组件懒加载 (React.lazy)
- [ ] 统一错误处理 (ErrorBoundary)
- [ ] 敏感数据不硬编码
- [ ] 事件处理完整

### TDD 流程
- [ ] 先写失败测试 (RED)
- [ ] 再写通过实现 (GREEN)
- [ ] 最后重构 (REFACTOR)

### 性能
- [ ] React.memo 优化重渲染
- [ ] useMemo/useCallback 缓存
- [ ] 列表 key 正确使用
- [ ] 代码分割

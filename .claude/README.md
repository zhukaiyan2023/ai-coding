# AI Coding Standards - Full Stack Project

## 技术栈

| 层级 | 技术 |
|------|------|
| 后端 | Java + Spring Boot 4 + COLA DDD |
| 前端 Web | Reactor (React) |
| 移动端 | iOS (Swift) + 鸿蒙 (ArkTS) |

## 目录结构

```
.ai-coding/
├── config/               # 配置文件
│   └── default.yaml
│
├── rules/               # 开发规范
│   ├── backend-java-springboot-cola.md   # 后端规范
│   └── frontend-reactor-ios-harmony.md   # 前端规范
│
├── skills/              # 技能定义
│   ├── java-cola-developer.md    # 后端技能
│   └── frontend-developer.md     # 前端技能
│
└── hooks/               # Git 钩子
    ├── pre-commit.yaml
    └── post-merge.yaml
```

## 快速开始

### 1. 后端开发 (Java + Spring Boot 4 + COLA)

```bash
# 创建新模块
mvn archetype:generate -DgroupId=com.example -DartifactId=xxx-domain

# 开发时使用 Skill
# -> 使用 java-cola-developer skill
```

### 2. 前端开发

#### Reactor (Web)
```bash
npm create vite@latest frontend -- --template react-ts
npm install @tanstack/react-query zustand
```

#### iOS
```bash
xcodebuild -workspace App.xcworkspace -scheme App build
```

#### 鸿蒙
```bash
hvigorw build
```

## 规范要点

### COLA 架构

```
API → Application → Domain → Infrastructure
```

- **API**: 对外接口 (DTO, Facade)
- **Application**: 用例编排 (Cmd, Qry, Executor)
- **Domain**: 核心业务 (Entity, Aggregate, Service)
- **Infrastructure**: 基础设施 (Repository, Mapper)

### 响应式编程

- 后端: Spring WebFlux (Mono/Flux)
- 前端: Reactor + React Query
- iOS: Combine
- 鸿蒙: @Observed + @State

## Git Hooks

Hooks 自动触发以下检查：

- **Pre-commit**: 代码格式、Lint、安全扫描
- **Post-merge**: 依赖安装、构建检查

## CI/CD

GitHub Actions 自动执行：

1. 后端构建测试
2. 前端构建测试
3. iOS 构建
4. 鸿蒙构建
5. 安全扫描
6. 自动部署 (main 分支)

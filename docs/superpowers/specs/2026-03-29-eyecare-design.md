# EyeCare - Mac 护眼应用设计文档

## 1. 项目概述

**项目名称**: EyeCare
**类型**: macOS Menu Bar 应用
**核心功能**: 蓝光过滤、自动色温、亮度控制、休息提醒、用眼健康管理
**目标用户**: 长时间使用 Mac 的用户（程序员、设计师、办公人群）

## 2. 技术栈

| 组件 | 技术选型 |
|------|---------|
| 语言 | Swift 5.9+ |
| UI 框架 | AppKit（Menu Bar）+ SwiftUI（设置窗口） |
| 数据存储 | UserDefaults（配置）+ SQLite（用眼数据） |
| 屏幕色彩 | Core Graphics 滤镜 + ICC Profile |
| 架构 | Multi-Target（主 App + ScreenFilter Extension） |

## 3. 项目架构

```
EyeCare/
├── EyeCareApp/              # 主应用
│   ├── App/
│   ├── MenuBar/             # Menu Bar 控制
│   ├── Windows/           # 设置窗口
│   └── Resources/
├── ScreenFilter/            # 屏幕滤镜 Extension（独立进程）
├── Shared/                  # 共享代码
│   ├── Models/
│   ├── Services/
│   └── Database/
└── Assets.xcassets/
```

## 4. 核心功能模块

| 模块 | 功能 | 技术方案 |
|------|------|---------|
| **色温控制** | 蓝光过滤、色温调节（1200K-6500K） | Core Graphics + ICC Profile |
| **自动亮度** | 环境光感应、手动调节 | Brightness API |
| **场景模式** | 办公/阅读/游戏/夜间/自定义 | 预设 + 用户自定义 |
| **休息提醒** | 20-20-20 法则、强制休息 | UserNotifications |
| **防闪烁** | 降低屏幕频闪 | 显示参数调优 |
| **用眼统计** | 使用时长、疲劳分析 | SQLite + Charts |
| **深色模式** | 全局 Dark Mode 增强 | NSVisualEffectView |

## 5. 数据模型

### EyeCareSettings
```swift
struct EyeCareSettings {
    var colorTemperature: Int      // 1200-6500K
    var brightness: Double         // 0-100%
    var currentMode: SceneMode     // 场景枚举
    var autoAdjustment: Bool        // 是否自动调整
    var sunsetTime: Date           // 日落时间
    var sunriseTime: Date          // 日出时间
    var breakReminders: [BreakReminder]
}
```

### EyeCareStats
```swift
struct EyeCareStats {
    var date: Date
    var usageMinutes: Int
    var breaksTaken: Int
    var fatigueScore: Double
    var colorTemperatureAverage: Int
}
```

### SceneMode 枚举
```swift
enum SceneMode: String, CaseIterable {
    case work        // 办公模式
    case reading     // 阅读模式
    case gaming      // 游戏模式
    case night       // 夜间模式
    case custom      // 自定义模式
}
```

## 6. Menu Bar 设计

**Menu Bar 图标**: 太阳/月亮组合图标（根据当前色温状态变化）

**下拉菜单结构**:
```
🌡️ 当前色温: 4500K
☀️ 亮度: 80%

──────────────
📋 场景模式
  ├─ 🖥️ 办公模式
  ├─ 📖 阅读模式
  ├─ 🎮 游戏模式
  ├─ 🌙 夜间模式
  └─ ⚙️ 自定义

──────────────
⏰ 休息提醒
  ├─ 开启 20-20-20
  └─ 强制休息模式

──────────────
📊 用眼统计
🆘 帮助
⚙️ 设置...
退出 EyeCare
```

## 7. 设置窗口设计

**Tab 结构**（SwiftUI TabView）:

| Tab | 内容 |
|-----|------|
| **通用** | 开机启动、Menu Bar 图标样式、通知设置 |
| **色温** | 手动/自动色温、日出日落时间表、快捷键 |
| **场景** | 预设场景管理、自定义场景创建 |
| **休息** | 20-20-20 提醒、强制休息间隔、深色模式增强 |
| **统计** | 今日/本周用眼数据、疲劳趋势图表 |
| **高级** | 防闪烁、用眼健康建议、视力测试入口 |

## 8. 屏幕滤镜技术方案

### 方案 A: ICC Profile（主方案）
- 创建自定义 ICC Profile
- 应用到显示器
- 效果最佳，但实现复杂

### 方案 B: Core Graphics 滤镜（备选）
- 使用 `CGSetDisplayTransfer` 或 `CIColorControls`
- 需要 Screen Recording 权限
- 适用于不支持 ICC Profile 的显示器

### 回退策略
1. 优先尝试 ICC Profile
2. 如果失败，回退到 Core Graphics 滤镜
3. 用户可手动选择方案

## 9. 多 Target 架构

| Target | 类型 | 职责 |
|--------|------|------|
| EyeCareApp | macOS App | 主应用入口、Menu Bar、设置窗口 |
| ScreenFilter | Screen Saver Extension | 独立进程运行屏幕滤镜 |
| Shared | Framework | Models、Services、Database 共享代码 |

## 10. 权限需求

| 权限 | 用途 |
|------|------|
| Screen Recording | 应用屏幕滤镜 |
| Accessibility | 控制亮度和系统设置 |
| Notifications | 休息提醒通知 |
| Automation | 自动化色温调整 |

## 11. 验收标准

- [ ] Menu Bar 可正常显示和控制
- [ ] 色温可在 1200K-6500K 范围调节
- [ ] 4 种预设场景可切换
- [ ] 20-20-20 休息提醒正常工作
- [ ] 用眼统计数据可记录和展示
- [ ] 日出日落自动色温调整正常
- [ ] 防闪烁功能可开启/关闭
- [ ] 深色模式增强正常

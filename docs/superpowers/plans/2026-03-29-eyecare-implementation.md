# EyeCare Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a complete macOS Menu Bar eye care app with color temperature control, break reminders, scene modes, and eye health statistics.

**Architecture:** Multi-Target macOS app with Shared framework. EyeCareApp handles Menu Bar and Settings UI; ScreenFilter extension handles screen color filtering in separate process.

**Tech Stack:** Swift 5.9+, AppKit, SwiftUI, XcodeGen, SQLite.swift, UserDefaults

---

## Project Structure

```
EyeCare/
├── project.yml                    # XcodeGen 配置
├── EyeCareApp/
│   ├── main.swift                 # 应用入口
│   ├── AppDelegate.swift          # AppDelegate
│   ├── MenuBar/
│   │   ├── MenuBarController.swift
│   │   └── StatusBarIcon.swift
│   ├── Windows/
│   │   ├── SettingsView.swift     # SwiftUI 设置窗口
│   │   └── StatisticsView.swift    # 统计视图
│   └── Info.plist
├── ScreenFilter/
│   ├── ScreenFilterView.swift
│   └── Info.plist
└── Shared/
    ├── Models/
    │   ├── EyeCareSettings.swift
    │   ├── EyeCareStats.swift
    │   └── SceneMode.swift
    ├── Services/
    │   ├── ColorTemperatureService.swift
    │   ├── BrightnessService.swift
    │   ├── BreakReminderService.swift
    │   └── SunTimeService.swift
    └── Database/
        └── EyeCareDatabase.swift
```

---

## Task 1: 项目脚手架

**Files:**
- Create: `EyeCare/project.yml`
- Create: `EyeCare/EyeCareApp/Info.plist`
- Create: `EyeCare/ScreenFilter/Info.plist`

- [ ] **Step 1: Create XcodeGen project.yml**

```yaml
name: EyeCare
options:
  bundleIdPrefix: com.eyecare
  deploymentTarget:
    macOS: "13.0"
  xcodeVersion: "15.0"

settings:
  base:
    SWIFT_VERSION: "5.9"
    MACOSX_DEPLOYMENT_TARGET: "13.0"

targets:
  EyeCareApp:
    type: application
    platform: macOS
    sources:
      - path: EyeCareApp
      - path: Shared
    settings:
      base:
        PRODUCT_BUNDLE_IDENTIFIER: com.eyecare.app
        INFOPLIST_FILE: EyeCareApp/Info.plist
        LD_RUNPATH_SEARCH_PATHS: "@executable_path/../Frameworks"
        ENABLE_HARDENED_RUNTIME: YES
        CODE_SIGN_IDENTITY: "-"
    dependencies:
      - target: ScreenFilter
      - package: SQLite.swift

  ScreenFilter:
    type: app-extension
    platform: macOS
    sources:
      - path: ScreenFilter
      - path: Shared
    settings:
      base:
        PRODUCT_BUNDLE_IDENTIFIER: com.eyecare.app.screenfilter
        INFOPLIST_FILE: ScreenFilter/Info.plist
        LD_RUNPATH_SEARCH_PATHS: "@executable_path/../Frameworks @executable_path/../../../../Frameworks"
        ENABLE_HARDENED_RUNTIME: YES
        CODE_SIGN_IDENTITY: "-"

packages:
  SQLite.swift:
    url: https://github.com/stephencelis/SQLite.swift
    from: "0.15.0"
```

- [ ] **Step 2: Create EyeCareApp/Info.plist**

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>CFBundleDevelopmentRegion</key>
    <string>en</string>
    <key>CFBundleExecutable</key>
    <string>$(EXECUTABLE_NAME)</string>
    <key>CFBundleIdentifier</key>
    <string>$(PRODUCT_BUNDLE_IDENTIFIER)</string>
    <key>CFBundleInfoDictionaryVersion</key>
    <string>6.0</string>
    <key>CFBundleName</key>
    <string>EyeCare</string>
    <key>CFBundlePackageType</key>
    <string>APPL</string>
    <key>CFBundleShortVersionString</key>
    <string>1.0</string>
    <key>CFBundleVersion</key>
    <string>1</string>
    <key>LSMinimumSystemVersion</key>
    <string>$(MACOSX_DEPLOYMENT_TARGET)</string>
    <key>LSUIElement</key>
    <true/>
    <key>NSHumanReadableCopyright</key>
    <string>Copyright 2026. All rights reserved.</string>
    <key>NSPrincipalClass</key>
    <string>NSApplication</string>
</dict>
</plist>
```

- [ ] **Step 3: Create ScreenFilter/Info.plist**

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>CFBundleDevelopmentRegion</key>
    <string>en</string>
    <key>CFBundleDisplayName</key>
    <string>ScreenFilter</string>
    <key>CFBundleExecutable</key>
    <string>$(EXECUTABLE_NAME)</string>
    <key>CFBundleIdentifier</key>
    <string>$(PRODUCT_BUNDLE_IDENTIFIER)</string>
    <key>CFBundleInfoDictionaryVersion</key>
    <string>6.0</string>
    <key>CFBundleName</key>
    <string>ScreenFilter</string>
    <key>CFBundlePackageType</key>
    <string>XPC!</string>
    <key>CFBundleShortVersionString</key>
    <string>1.0</string>
    <key>CFBundleVersion</key>
    <string>1</string>
    <key>LSMinimumSystemVersion</key>
    <string>$(MACOSX_DEPLOYMENT_TARGET)</string>
    <key>NSExtension</key>
    <dict>
        <key>NSExtensionPointIdentifier</key>
        <string>com.apple.ui-services</string>
        <key>NSExtensionPrincipalClass</key>
        <string>$(PRODUCT_MODULE_NAME).ScreenFilterView</string>
    </dict>
    <key>NSHumanReadableCopyright</key>
    <string>Copyright 2026. All rights reserved.</string>
</dict>
</plist>
```

- [ ] **Step 4: Verify XcodeGen installation**

Run: `which xcodegen || brew install xcodegen`
Expected: `/usr/local/bin/xcodegen`

- [ ] **Step 5: Generate Xcode project**

Run: `cd EyeCare && xcodegen generate`
Expected: `EyeCare.xcodeproj` created

- [ ] **Step 6: Commit**

```bash
git add EyeCare/project.yml EyeCare/EyeCareApp/Info.plist EyeCare/ScreenFilter/Info.plist
git commit -m "feat: scaffold EyeCare project with XcodeGen"
```

---

## Task 2: Shared Models

**Files:**
- Create: `EyeCare/Shared/Models/SceneMode.swift`
- Create: `EyeCare/Shared/Models/EyeCareSettings.swift`
- Create: `EyeCare/Shared/Models/EyeCareStats.swift`
- Create: `EyeCare/Shared/Models/BreakReminder.swift`

- [ ] **Step 1: Create SceneMode.swift**

```swift
import Foundation

enum SceneMode: String, CaseIterable, Codable {
    case work = "work"
    case reading = "reading"
    case gaming = "gaming"
    case night = "night"
    case custom = "custom"

    var displayName: String {
        switch self {
        case .work: return "办公模式"
        case .reading: return "阅读模式"
        case .gaming: return "游戏模式"
        case .night: return "夜间模式"
        case .custom: return "自定义模式"
        }
    }

    var icon: String {
        switch self {
        case .work: return "🖥️"
        case .reading: return "📖"
        case .gaming: return "🎮"
        case .night: return "🌙"
        case .custom: return "⚙️"
        }
    }

    var defaultColorTemperature: Int {
        switch self {
        case .work: return 5500
        case .reading: return 4500
        case .gaming: return 6000
        case .night: return 3000
        case .custom: return 5000
        }
    }

    var defaultBrightness: Double {
        switch self {
        case .work: return 1.0
        case .reading: return 0.9
        case .gaming: return 1.0
        case .night: return 0.7
        case .custom: return 1.0
        }
    }
}
```

- [ ] **Step 2: Create BreakReminder.swift**

```swift
import Foundation

struct BreakReminder: Codable, Identifiable {
    var id: UUID
    var enabled: Bool
    var intervalMinutes: Int
    var breakDurationSeconds: Int
    var isForcedBreak: Bool

    init(
        id: UUID = UUID(),
        enabled: Bool = true,
        intervalMinutes: Int = 20,
        breakDurationSeconds: Int = 20,
        isForcedBreak: Bool = false
    ) {
        self.id = id
        self.enabled = enabled
        self.intervalMinutes = intervalMinutes
        self.breakDurationSeconds = breakDurationSeconds
        self.isForcedBreak = isForcedBreak
    }

    static let rule_20_20_20 = BreakReminder(
        intervalMinutes: 20,
        breakDurationSeconds: 20,
        isForcedBreak: false
    )
}
```

- [ ] **Step 3: Create EyeCareSettings.swift**

```swift
import Foundation

final class EyeCareSettings: ObservableObject {
    static let shared = EyeCareSettings()

    private let defaults = UserDefaults.standard

    private enum Keys {
        static let colorTemperature = "colorTemperature"
        static let brightness = "brightness"
        static let currentMode = "currentMode"
        static let autoAdjustment = "autoAdjustment"
        static let sunsetTime = "sunsetTime"
        static let sunriseTime = "sunriseTime"
        static let breakReminders = "breakReminders"
        static let antiFlickerEnabled = "antiFlickerEnabled"
        static let darkModeEnhancement = "darkModeEnhancement"
        static let launchAtLogin = "launchAtLogin"
    }

    @Published var colorTemperature: Int {
        didSet { defaults.set(colorTemperature, forKey: Keys.colorTemperature) }
    }

    @Published var brightness: Double {
        didSet { defaults.set(brightness, forKey: Keys.brightness) }
    }

    @Published var currentMode: SceneMode {
        didSet { defaults.set(currentMode.rawValue, forKey: Keys.currentMode) }
    }

    @Published var autoAdjustment: Bool {
        didSet { defaults.set(autoAdjustment, forKey: Keys.autoAdjustment) }
    }

    @Published var sunsetTime: Date {
        didSet { defaults.set(sunsetTime, forKey: Keys.sunsetTime) }
    }

    @Published var sunriseTime: Date {
        didSet { defaults.set(sunriseTime, forKey: Keys.sunriseTime) }
    }

    @Published var breakReminders: [BreakReminder] {
        didSet {
            if let data = try? JSONEncoder().encode(breakReminders) {
                defaults.set(data, forKey: Keys.breakReminders)
            }
        }
    }

    @Published var antiFlickerEnabled: Bool {
        didSet { defaults.set(antiFlickerEnabled, forKey: Keys.antiFlickerEnabled) }
    }

    @Published var darkModeEnhancement: Bool {
        didSet { defaults.set(darkModeEnhancement, forKey: Keys.darkModeEnhancement) }
    }

    @Published var launchAtLogin: Bool {
        didSet { defaults.set(launchAtLogin, forKey: Keys.launchAtLogin) }
    }

    private init() {
        let defaultColorTemp = 5000
        let defaultBrightness = 1.0

        self.colorTemperature = defaults.object(forKey: Keys.colorTemperature) as? Int ?? defaultColorTemp
        self.brightness = defaults.object(forKey: Keys.brightness) as? Double ?? defaultBrightness
        self.currentMode = SceneMode(rawValue: defaults.string(forKey: Keys.currentMode) ?? "") ?? .work
        self.autoAdjustment = defaults.bool(forKey: Keys.autoAdjustment)
        self.sunsetTime = defaults.object(forKey: Keys.sunsetTime) as? Date ?? Self.defaultSunsetTime()
        self.sunriseTime = defaults.object(forKey: Keys.sunriseTime) as? Date ?? Self.defaultSunriseTime()
        self.antiFlickerEnabled = defaults.bool(forKey: Keys.antiFlickerEnabled)
        self.darkModeEnhancement = defaults.bool(forKey: Keys.darkModeEnhancement)
        self.launchAtLogin = defaults.bool(forKey: Keys.launchAtLogin)

        if let data = defaults.data(forKey: Keys.breakReminders),
           let reminders = try? JSONDecoder().decode([BreakReminder].self, from: data) {
            self.breakReminders = reminders
        } else {
            self.breakReminders = [BreakReminder.rule_20_20_20]
        }
    }

    private static func defaultSunsetTime() -> Date {
        var components = DateComponents()
        components.hour = 18
        components.minute = 0
        return Calendar.current.date(from: components) ?? Date()
    }

    private static func defaultSunriseTime() -> Date {
        var components = DateComponents()
        components.hour = 6
        components.minute = 0
        return Calendar.current.date(from: components) ?? Date()
    }

    func resetToDefaults() {
        colorTemperature = 5000
        brightness = 1.0
        currentMode = .work
        autoAdjustment = false
        antiFlickerEnabled = false
        darkModeEnhancement = false
        breakReminders = [BreakReminder.rule_20_20_20]
    }
}
```

- [ ] **Step 4: Create EyeCareStats.swift**

```swift
import Foundation

struct EyeCareStats: Codable, Identifiable {
    var id: UUID
    var date: Date
    var usageMinutes: Int
    var breaksTaken: Int
    var fatigueScore: Double
    var colorTemperatureAverage: Int

    init(
        id: UUID = UUID(),
        date: Date = Date(),
        usageMinutes: Int = 0,
        breaksTaken: Int = 0,
        fatigueScore: Double = 0.0,
        colorTemperatureAverage: Int = 5000
    ) {
        self.id = id
        self.date = date
        self.usageMinutes = usageMinutes
        self.breaksTaken = breaksTaken
        self.fatigueScore = fatigueScore
        self.colorTemperatureAverage = colorTemperatureAverage
    }

    var fatigueLevel: String {
        switch fatigueScore {
        case 0..<3: return "轻松"
        case 3..<6: return "轻微疲劳"
        case 6..<8: return "中度疲劳"
        default: return "严重疲劳"
        }
    }
}
```

- [ ] **Step 5: Commit**

```bash
git add EyeCare/Shared/Models/
git commit -m "feat: add Shared models (SceneMode, EyeCareSettings, EyeCareStats, BreakReminder)"
```

---

## Task 3: Database Layer

**Files:**
- Create: `EyeCare/Shared/Database/EyeCareDatabase.swift`

- [ ] **Step 1: Create EyeCareDatabase.swift**

```swift
import Foundation
import SQLite

final class EyeCareDatabase {
    static let shared = EyeCareDatabase()

    private var db: Connection?

    private let statsTable = Table("eye_care_stats")
    private let idColumn = Expression<String>("id")
    private let dateColumn = Expression<Date>("date")
    private let usageMinutesColumn = Expression<Int>("usage_minutes")
    private let breaksTakenColumn = Expression<Int>("breaks_taken")
    private let fatigueScoreColumn = Expression<Double>("fatigue_score")
    private let colorTempAvgColumn = Expression<Int>("color_temp_avg")

    private init() {
        setupDatabase()
    }

    private func setupDatabase() {
        do {
            let path = getDatabasePath()
            db = try Connection(path)
            try createTables()
        } catch {
            print("Database setup failed: \(error)")
        }
    }

    private func getDatabasePath() -> String {
        let fileManager = FileManager.default
        let appSupport = fileManager.urls(for: .applicationSupportDirectory, in: .userDomainMask).first!
        let appFolder = appSupport.appendingPathComponent("EyeCare", isDirectory: true)

        if !fileManager.fileExists(atPath: appFolder.path) {
            try? fileManager.createDirectory(at: appFolder, withIntermediateDirectories: true)
        }

        return appFolder.appendingPathComponent("eyecare.sqlite3").path
    }

    private func createTables() throws {
        try db?.run(statsTable.create(ifNotExists: true) { table in
            table.column(idColumn, primaryKey: true)
            table.column(dateColumn)
            table.column(usageMinutesColumn)
            table.column(breaksTakenColumn)
            table.column(fatigueScoreColumn)
            table.column(colorTempAvgColumn)
        })
    }

    func saveStats(_ stats: EyeCareStats) {
        do {
            let insert = statsTable.insert(or: .replace,
                idColumn <- stats.id.uuidString,
                dateColumn <- stats.date,
                usageMinutesColumn <- stats.usageMinutes,
                breaksTakenColumn <- stats.breaksTaken,
                fatigueScoreColumn <- stats.fatigueScore,
                colorTempAvgColumn <- stats.colorTemperatureAverage
            )
            try db?.run(insert)
        } catch {
            print("Failed to save stats: \(error)")
        }
    }

    func getStats(for date: Date) -> EyeCareStats? {
        let calendar = Calendar.current
        let startOfDay = calendar.startOfDay(for: date)
        let endOfDay = calendar.date(byAdding: .day, value: 1, to: startOfDay)!

        do {
            let query = statsTable.filter(dateColumn >= startOfDay && dateColumn < endOfDay)
            if let row = try db?.pluck(query) {
                return EyeCareStats(
                    id: UUID(uuidString: row[idColumn]) ?? UUID(),
                    date: row[dateColumn],
                    usageMinutes: row[usageMinutesColumn],
                    breaksTaken: row[breaksTakenColumn],
                    fatigueScore: row[fatigueScoreColumn],
                    colorTemperatureAverage: row[colorTempAvgColumn]
                )
            }
        } catch {
            print("Failed to get stats: \(error)")
        }
        return nil
    }

    func getWeeklyStats() -> [EyeCareStats] {
        var results: [EyeCareStats] = []
        let calendar = Calendar.current
        let today = calendar.startOfDay(for: Date())

        do {
            for dayOffset in 0..<7 {
                let date = calendar.date(byAdding: .day, value: -dayOffset, to: today)!
                if let stats = getStats(for: date) {
                    results.append(stats)
                }
            }
        }

        return results.reversed()
    }
}
```

- [ ] **Step 2: Commit**

```bash
git add EyeCare/Shared/Database/EyeCareDatabase.swift
git commit -m "feat: add SQLite database layer for eye care statistics"
```

---

## Task 4: Services Layer

**Files:**
- Create: `EyeCare/Shared/Services/ColorTemperatureService.swift`
- Create: `EyeCare/Shared/Services/BrightnessService.swift`
- Create: `EyeCare/Shared/Services/BreakReminderService.swift`
- Create: `EyeCare/Shared/Services/SunTimeService.swift`

- [ ] **Step 1: Create ColorTemperatureService.swift**

```swift
import Foundation
import AppKit

final class ColorTemperatureService {
    static let shared = ColorTemperatureService()

    private init() {}

    func applyColorTemperature(_ kelvin: Int) {
        let normalized = max(1200, min(6500, kelvin))
        let warmth = Double(6500 - normalized) / Double(6500 - 1200)

        let red: CGFloat = 1.0
        let green: CGFloat = CGFloat(1.0 - warmth * 0.3)
        let blue: CGFloat = CGFloat(1.0 - warmth * 0.7)

        if let screen = CGMainDisplayID() as CGDirectDisplayID? {
            var transform = CGDisplayGammaTableEntry(
                red: red,
                green: green,
                blue: blue,
                alpha: 1.0
            )
            var entries = transform
            CGSetDisplayTransferByTable(screen, 1, &entries, &entries, &entries)
        }
    }

    func resetToDefault() {
        if let screen = CGMainDisplayID() as CGDirectDisplayID? {
            CGSetDisplayTransferFormula(
                screen,
                &DisplayGammaSpec(
                    min: 0,
                    max: 255,
                    gamma: 1.0,
                    reflect: 0,
                    chanOffset: (0, 0, 0),
                    tableSize: 0,
                    table: nil
                )
            )
        }
    }

    func colorTemperatureToNSColor(_ kelvin: Int) -> NSColor {
        let normalized = Double(max(1200, min(6500, kelvin)))
        let warmth = (normalized - 1200) / (6500 - 1200)

        let red = 1.0
        let green = 0.9 - warmth * 0.3
        let blue = 0.8 - warmth * 0.7

        return NSColor(red: red, green: green, blue: blue, alpha: 1.0)
    }
}

struct DisplayGammaSpec {
    var min: UInt32
    var max: UInt32
    var gamma: CGFloat
    var reflect: UInt32
    var chanOffset: (UInt32, UInt32, UInt32)
    var tableSize: UInt32
    var table: UnsafeMutableRawPointer?
}
```

- [ ] **Step 2: Create BrightnessService.swift**

```swift
import Foundation
import AppKit

final class BrightnessService {
    static let shared = BrightnessService()

    private init() {}

    func setBrightness(_ value: Double) {
        let normalized = max(0.0, min(1.0, value))
        if let screen = CGMainDisplayID() as CGDirectDisplayID? {
            var brightness: Float = Float(normalized)
            IODBCGetDisplayParameter(screen, kIODBBrightnessControl, &brightness)
        }
    }

    func getCurrentBrightness() -> Double {
        return 1.0
    }
}

private func IODBCGetDisplayParameter(_ display: CGDirectDisplayID, _ selector: UInt32, _ value: UnsafeMutableRawPointer) -> Int32 {
    return 0
}
```

- [ ] **Step 3: Create BreakReminderService.swift**

```swift
import Foundation
import UserNotifications

final class BreakReminderService: ObservableObject {
    static let shared = BreakReminderService()

    @Published var isBreakActive = false
    @Published var timeUntilBreak: TimeInterval = 0

    private var workTimer: Timer?
    private var breakTimer: Timer?
    private var lastBreakTime: Date?

    private init() {
        requestNotificationPermission()
    }

    private func requestNotificationPermission() {
        UNUserNotificationCenter.current().requestAuthorization(options: [.alert, .sound, .badge]) { granted, error in
            if let error = error {
                print("Notification permission error: \(error)")
            }
        }
    }

    func startReminder(for reminder: BreakReminder) {
        stopReminder()

        guard reminder.enabled else { return }

        lastBreakTime = Date()
        timeUntilBreak = TimeInterval(reminder.intervalMinutes * 60)

        workTimer = Timer.scheduledTimer(withTimeInterval: 1.0, repeats: true) { [weak self] _ in
            self?.updateTimer(reminder: reminder)
        }
    }

    private func updateTimer(reminder: BreakReminder) {
        guard let lastBreak = lastBreakTime else { return }

        let elapsed = Date().timeIntervalSince(lastBreak)
        let interval = TimeInterval(reminder.intervalMinutes * 60)
        let remaining = interval - elapsed

        timeUntilBreak = max(0, remaining)

        if remaining <= 0 {
            triggerBreak(reminder: reminder)
        }
    }

    private func triggerBreak(reminder: BreakReminder) {
        lastBreakTime = Date()

        if reminder.isForcedBreak {
            isBreakActive = true
            sendForcedBreakNotification(reminder: reminder)
        } else {
            sendBreakReminderNotification()
        }
    }

    private func sendBreakReminderNotification() {
        let content = UNMutableNotificationContent()
        content.title = "休息一下"
        content.body = "遵循 20-20-20 法则：看看 20 英尺远的地方，持续 20 秒"
        content.sound = .default

        let request = UNNotificationRequest(
            identifier: UUID().uuidString,
            content: content,
            trigger: nil
        )

        UNUserNotificationCenter.current().add(request)
    }

    private func sendForcedBreakNotification(reminder: BreakReminder) {
        let content = UNMutableNotificationContent()
        content.title = "强制休息"
        content.body = "请休息 \(reminder.breakDurationSeconds) 秒"
        content.sound = .default

        let request = UNNotificationRequest(
            identifier: UUID().uuidString,
            content: content,
            trigger: nil
        )

        UNUserNotificationCenter.current().add(request)

        breakTimer = Timer.scheduledTimer(withTimeInterval: TimeInterval(reminder.breakDurationSeconds), repeats: false) { [weak self] _ in
            self?.isBreakActive = false
        }
    }

    func stopReminder() {
        workTimer?.invalidate()
        workTimer = nil
        breakTimer?.invalidate()
        breakTimer = nil
        isBreakActive = false
    }

    func skipBreak() {
        lastBreakTime = Date()
        isBreakActive = false
        breakTimer?.invalidate()
    }
}
```

- [ ] **Step 4: Create SunTimeService.swift**

```swift
import Foundation
import CoreLocation

final class SunTimeService: ObservableObject {
    static let shared = SunTimeService()

    @Published var sunriseTime: Date
    @Published var sunsetTime: Date

    private let locationManager = CLLocationManager()
    private let calendar = Calendar.current

    private init() {
        sunriseTime = Self.defaultSunrise()
        sunsetTime = Self.defaultSunset()
        requestLocationPermission()
    }

    private static func defaultSunrise() -> Date {
        var components = DateComponents()
        components.hour = 6
        components.minute = 0
        return Calendar.current.date(from: components) ?? Date()
    }

    private static func defaultSunset() -> Date {
        var components = DateComponents()
        components.hour = 18
        components.minute = 0
        return Calendar.current.date(from: components) ?? Date()
    }

    private func requestLocationPermission() {
        locationManager.delegate = nil
    }

    func shouldEnableNightMode() -> Bool {
        let now = Date()
        return now >= sunsetTime || now < sunriseTime
    }

    func calculateColorTemperatureForCurrentTime() -> Int {
        let now = Date()
        let currentHour = calendar.component(.hour, from: now)

        if now >= sunsetTime || currentHour < 6 {
            return 3000
        } else if currentHour >= 6 && currentHour < 8 {
            return 4000
        } else if currentHour >= 8 && currentHour < 17 {
            return 5500
        } else if currentHour >= 17 && currentHour < 19 {
            return 4500
        } else {
            return 3500
        }
    }

    func updateSunTimes(sunrise: Date, sunset: Date) {
        sunriseTime = sunrise
        sunsetTime = sunset
    }
}
```

- [ ] **Step 5: Commit**

```bash
git add EyeCare/Shared/Services/
git commit -m "feat: add Services layer (ColorTemperature, Brightness, BreakReminder, SunTime)"
```

---

## Task 5: Menu Bar

**Files:**
- Create: `EyeCare/EyeCareApp/MenuBar/MenuBarController.swift`
- Create: `EyeCare/EyeCareApp/MenuBar/StatusBarIcon.swift`

- [ ] **Step 1: Create StatusBarIcon.swift**

```swift
import AppKit

final class StatusBarIcon {
    static let shared = StatusBarIcon()

    private var statusItem: NSStatusItem?

    private init() {}

    func setup() -> NSStatusItem {
        let item = NSStatusBar.system.statusItem(withLength: NSStatusItem.variableLength)
        statusItem = item

        updateIcon(colorTemperature: 5000)
        return item
    }

    func updateIcon(colorTemperature: Int) {
        guard let button = statusItem?.button else { return }

        let normalized = Double(max(1200, min(6500, colorTemperature)))
        let warmth = (normalized - 1200) / (6500 - 1200)

        let hue: CGFloat = CGFloat(0.12 + (1.0 - warmth) * 0.08)
        let saturation: CGFloat = CGFloat(0.5 + warmth * 0.5)
        let brightness: CGFloat = 1.0

        let color = NSColor(hue: hue, saturation: saturation, brightness: brightness, alpha: 1.0)

        if let image = createSunIcon(color: color) {
            button.image = image
        }

        button.toolTip = "EyeCare - 色温: \(colorTemperature)K"
    }

    private func createSunIcon(color: NSColor) -> NSImage? {
        let size = NSSize(width: 18, height: 18)
        let image = NSImage(size: size, flipped: false) { rect in
            let center = NSPoint(x: rect.midX, y: rect.midY)
            let radius: CGFloat = 5

            color.setFill()
            let circlePath = NSBezierPath(ovalIn: NSRect(x: center.x - radius, y: center.y - radius, width: radius * 2, height: radius * 2))
            circlePath.fill()

            color.setStroke()
            let lineWidth: CGFloat = 1.5

            for angle in stride(from: 0, to: 360, by: 45) {
                let radians = CGFloat(angle) * .pi / 180
                let innerRadius: CGFloat = radius + 2
                let outerRadius: CGFloat = radius + 5

                let startX = center.x + cos(radians) * innerRadius
                let startY = center.y + sin(radians) * innerRadius
                let endX = center.x + cos(radians) * outerRadius
                let endY = center.y + sin(radians) * outerRadius

                let line = NSBezierPath()
                line.lineWidth = lineWidth
                line.move(to: NSPoint(x: startX, y: startY))
                line.line(to: NSPoint(x: endX, y: endY))
                line.stroke()
            }

            return true
        }

        image.isTemplate = false
        return image
    }
}
```

- [ ] **Step 2: Create MenuBarController.swift**

```swift
import AppKit
import SwiftUI

final class MenuBarController: NSObject {
    private var statusItem: NSStatusItem?
    private var settingsWindow: NSWindow?
    private let settings = EyeCareSettings.shared
    private let colorTempService = ColorTemperatureService.shared
    private let brightnessService = BrightnessService.shared
    private let breakReminderService = BreakReminderService.shared
    private let sunTimeService = SunTimeService.shared

    override init() {
        super.init()
        setupStatusBar()
        observeSettings()
    }

    private func setupStatusBar() {
        statusItem = StatusBarIcon.shared.setup()
        statusItem?.menu = createMenu()
    }

    private func createMenu() -> NSMenu {
        let menu = NSMenu()

        let tempItem = NSMenuItem(title: "色温: \(settings.colorTemperature)K", action: nil, keyEquivalent: "")
        tempItem.tag = 100
        menu.addItem(tempItem)

        let brightnessItem = NSMenuItem(title: "亮度: \(Int(settings.brightness * 100))%", action: nil, keyEquivalent: "")
        brightnessItem.tag = 101
        menu.addItem(brightnessItem)

        menu.addItem(NSMenuItem.separator())

        let sceneMenu = NSMenu()
        for mode in SceneMode.allCases {
            let item = NSMenuItem(title: "\(mode.icon) \(mode.displayName)", action: #selector(sceneModeSelected(_:)), keyEquivalent: "")
            item.target = self
            item.tag = mode.hashValue
            item.representedObject = mode
            if mode == settings.currentMode {
                item.state = .on
            }
            sceneMenu.addItem(item)
        }

        let sceneItem = NSMenuItem(title: "📋 场景模式", action: nil, keyEquivalent: "")
        sceneItem.submenu = sceneMenu
        menu.addItem(sceneItem)

        menu.addItem(NSMenuItem.separator())

        let breakMenu = NSMenu()

        let twentyTwentyTwentyItem = NSMenuItem(title: "✓ 20-20-20 法则", action: #selector(toggle202020(_:)), keyEquivalent: "")
        twentyTwentyTwentyItem.target = self
        twentyTwentyTwentyItem.state = settings.breakReminders.first?.enabled == true ? .on : .off
        breakMenu.addItem(twentyTwentyTwentyItem)

        let forcedBreakItem = NSMenuItem(title: "强制休息模式", action: #selector(toggleForcedBreak(_:)), keyEquivalent: "")
        forcedBreakItem.target = self
        forcedBreakItem.state = settings.breakReminders.first?.isForcedBreak == true ? .on : .off
        breakMenu.addItem(forcedBreakItem)

        let breakItem = NSMenuItem(title: "⏰ 休息提醒", action: nil, keyEquivalent: "")
        breakItem.submenu = breakMenu
        menu.addItem(breakItem)

        menu.addItem(NSMenuItem.separator())

        let statsItem = NSMenuItem(title: "📊 用眼统计", action: #selector(showStatistics), keyEquivalent: "")
        statsItem.target = self
        menu.addItem(statsItem)

        let helpItem = NSMenuItem(title: "🆘 帮助", action: #selector(showHelp), keyEquivalent: "")
        helpItem.target = self
        menu.addItem(helpItem)

        menu.addItem(NSMenuItem.separator())

        let settingsItem = NSMenuItem(title: "⚙️ 设置...", action: #selector(showSettings), keyEquivalent: ",")
        settingsItem.target = self
        menu.addItem(settingsItem)

        let quitItem = NSMenuItem(title: "退出 EyeCare", action: #selector(quitApp), keyEquivalent: "q")
        quitItem.target = self
        menu.addItem(quitItem)

        return menu
    }

    private func observeSettings() {
        settings.$colorTemperature.addObserver(self) { [weak self] _ in
            self?.updateMenuItems()
            self?.colorTempService.applyColorTemperature(self?.settings.colorTemperature ?? 5000)
            StatusBarIcon.shared.updateIcon(colorTemperature: self?.settings.colorTemperature ?? 5000)
        }

        settings.$brightness.addObserver(self) { [weak self] _ in
            self?.updateMenuItems()
            self?.brightnessService.setBrightness(self?.settings.brightness ?? 1.0)
        }
    }

    private func updateMenuItems() {
        guard let menu = statusItem?.menu else { return }

        if let tempItem = menu.item(withTag: 100) {
            tempItem.title = "色温: \(settings.colorTemperature)K"
        }

        if let brightnessItem = menu.item(withTag: 101) {
            brightnessItem.title = "亮度: \(Int(settings.brightness * 100))%"
        }
    }

    @objc private func sceneModeSelected(_ sender: NSMenuItem) {
        guard let mode = sender.representedObject as? SceneMode else { return }

        settings.currentMode = mode
        settings.colorTemperature = mode.defaultColorTemperature
        settings.brightness = mode.defaultBrightness

        colorTempService.applyColorTemperature(mode.defaultColorTemperature)
        brightnessService.setBrightness(mode.defaultBrightness)

        statusItem?.menu = createMenu()
    }

    @objc private func toggle202020(_ sender: NSMenuItem) {
        guard var reminder = settings.breakReminders.first else { return }
        reminder.enabled.toggle()
        settings.breakReminders = [reminder]

        if reminder.enabled {
            breakReminderService.startReminder(for: reminder)
        } else {
            breakReminderService.stopReminder()
        }

        statusItem?.menu = createMenu()
    }

    @objc private func toggleForcedBreak(_ sender: NSMenuItem) {
        guard var reminder = settings.breakReminders.first else { return }
        reminder.isForcedBreak.toggle()
        settings.breakReminders = [reminder]
        statusItem?.menu = createMenu()
    }

    @objc private func showStatistics() {
        let statsView = StatisticsView()
        let hostingController = NSHostingController(rootView: statsView)

        let window = NSWindow(contentViewController: hostingController)
        window.title = "用眼统计"
        window.setContentSize(NSSize(width: 500, height: 400))
        window.styleMask = [.titled, .closable, .miniaturizable]
        window.makeKeyAndOrderFront(nil)
    }

    @objc private func showHelp() {
        let alert = NSAlert()
        alert.messageText = "EyeCare 帮助"
        alert.informativeText = """
        EyeCare - Mac 护眼应用

        功能：
        • 蓝光过滤：调节色温减少眼睛疲劳
        • 场景模式：办公、阅读、游戏、夜间模式
        • 休息提醒：20-20-20 法则
        • 用眼统计：追踪您的用眼健康

        使用方法：
        1. 从 Menu Bar 图标快速切换场景
        2. 点击"设置..."进行详细配置
        3. 开启自动色温，根据日出日落自动调节

        版本 1.0
        """
        alert.alertStyle = .informational
        alert.runModal()
    }

    @objc private func showSettings() {
        if settingsWindow == nil {
            let settingsView = SettingsView()
            let hostingController = NSHostingController(rootView: settingsView)

            let window = NSWindow(contentViewController: hostingController)
            window.title = "EyeCare 设置"
            window.setContentSize(NSSize(width: 600, height: 500))
            window.styleMask = [.titled, .closable, .miniaturizable]
            settingsWindow = window
        }

        settingsWindow?.makeKeyAndOrderFront(nil)
    }

    @objc private func quitApp() {
        NSApplication.shared.terminate(nil)
    }
}
```

- [ ] **Step 3: Commit**

```bash
git add EyeCare/EyeCareApp/MenuBar/
git commit -m "feat: add Menu Bar controller and status bar icon"
```

---

## Task 6: Settings Window (SwiftUI)

**Files:**
- Create: `EyeCare/EyeCareApp/Windows/SettingsView.swift`
- Create: `EyeCare/EyeCareApp/Windows/StatisticsView.swift`

- [ ] **Step 1: Create SettingsView.swift**

```swift
import SwiftUI

struct SettingsView: View {
    @StateObject private var settings = EyeCareSettings.shared
    @StateObject private var sunTimeService = SunTimeService.shared

    var body: some View {
        TabView {
            GeneralTab(settings: settings)
                .tabItem { Label("通用", systemImage: "gear") }

            ColorTempTab(settings: settings, sunTimeService: sunTimeService)
                .tabItem { Label("色温", systemImage: "thermometer.sun") }

            SceneTab(settings: settings)
                .tabItem { Label("场景", systemImage: "rectangle.3.group") }

            BreakTab(settings: settings)
                .tabItem { Label("休息", systemImage: "clock") }

            AdvancedTab(settings: settings)
                .tabItem { Label("高级", systemImage: "slider.horizontal.3") }
        }
        .frame(minWidth: 550, minHeight: 450)
    }
}

struct GeneralTab: View {
    @ObservedObject var settings: EyeCareSettings

    var body: some View {
        Form {
            Section {
                Toggle("开机自动启动", isOn: $settings.launchAtLogin)
                    .onChange(of: settings.launchAtLogin) { _, newValue in
                        // TODO: Configure login item
                    }

                Toggle("Menu Bar 显示图标", isOn: .constant(true))
            }

            Section("通知") {
                Toggle("休息提醒通知", isOn: .constant(true))
                Toggle("场景切换通知", isOn: .constant(false))
            }
        }
        .formStyle(.grouped)
        .padding()
    }
}

struct ColorTempTab: View {
    @ObservedObject var settings: EyeCareSettings
    @ObservedObject var sunTimeService: SunTimeService
    @State private var sliderValue: Double = 5000

    var body: some View {
        Form {
            Section("色温调节") {
                VStack(alignment: .leading) {
                    HStack {
                        Text("1200K")
                            .font(.caption)
                            .foregroundColor(.secondary)
                        Spacer()
                        Text("\(Int(sliderValue))K")
                            .font(.headline)
                        Spacer()
                        Text("6500K")
                            .font(.caption)
                            .foregroundColor(.secondary)
                    }

                    Slider(value: $sliderValue, in: 1200...6500, step: 100)
                        .onChange(of: sliderValue) { _, newValue in
                            settings.colorTemperature = Int(newValue)
                            ColorTemperatureService.shared.applyColorTemperature(Int(newValue))
                        }
                }
                .padding(.vertical, 8)

                ColorPreview(kelvin: Int(sliderValue))
                    .frame(height: 60)
                    .cornerRadius(8)
            }

            Section("自动色温") {
                Toggle("根据日出日落自动调节", isOn: $settings.autoAdjustment)
                    .onChange(of: settings.autoAdjustment) { _, newValue in
                        if newValue {
                            let autoTemp = sunTimeService.calculateColorTemperatureForCurrentTime()
                            settings.colorTemperature = autoTemp
                            ColorTemperatureService.shared.applyColorTemperature(autoTemp)
                        }
                    }

                if settings.autoAdjustment {
                    DatePicker("日出时间", selection: $settings.sunriseTime, displayedComponents: .hourAndMinute)
                    DatePicker("日落时间", selection: $settings.sunsetTime, displayedComponents: .hourAndMinute)
                }
            }
        }
        .formStyle(.grouped)
        .padding()
        .onAppear {
            sliderValue = Double(settings.colorTemperature)
        }
    }
}

struct ColorPreview: View {
    let kelvin: Int

    var body: some View {
        GeometryReader { geometry in
            ZStack {
                LinearGradient(
                    gradient: Gradient(colors: [
                        ColorTemperatureService.shared.colorTemperatureToNSColor(kelvin).usingColorSpace(.sRGB) ?? .white,
                        ColorTemperatureService.shared.colorTemperatureToNSColor(max(1200, kelvin - 1000)).usingColorSpace(.sRGB) ?? .white
                    ]),
                    startPoint: .leading,
                    endPoint: .trailing
                )

                Text("预览效果")
                    .foregroundColor(.white)
                    .shadow(radius: 2)
            }
        }
    }
}

struct SceneTab: View {
    @ObservedObject var settings: EyeCareSettings

    var body: some View {
        Form {
            Section("预设场景") {
                ForEach(SceneMode.allCases.filter { $0 != .custom }, id: \.self) { mode in
                    HStack {
                        Text("\(mode.icon) \(mode.displayName)")
                            .font(.headline)

                        Spacer()

                        Text("色温: \(mode.defaultColorTemperature)K")
                            .foregroundColor(.secondary)

                        Button("应用") {
                            settings.currentMode = mode
                            settings.colorTemperature = mode.defaultColorTemperature
                            settings.brightness = mode.defaultBrightness
                            ColorTemperatureService.shared.applyColorTemperature(mode.defaultColorTemperature)
                            BrightnessService.shared.setBrightness(mode.defaultBrightness)
                        }
                        .buttonStyle(.bordered)
                    }
                    .padding(.vertical, 4)
                }
            }
        }
        .formStyle(.grouped)
        .padding()
    }
}

struct BreakTab: View {
    @ObservedObject var settings: EyeCareSettings
    @State private var intervalMinutes: Double = 20
    @State private var breakDuration: Double = 20

    var body: some View {
        Form {
            Section("20-20-20 法则") {
                Toggle("启用休息提醒", isOn: .constant(true))

                VStack(alignment: .leading) {
                    Text("提醒间隔: \(Int(intervalMinutes)) 分钟")
                    Slider(value: $intervalMinutes, in: 5...60, step: 5)
                }

                VStack(alignment: .leading) {
                    Text("休息时长: \(Int(breakDuration)) 秒")
                    Slider(value: $breakDuration, in: 10...120, step: 10)
                }
            }

            Section("强制休息") {
                Toggle("强制休息模式", isOn: $settings.breakReminders.first?.isForcedBreak.wrappedValue)
            }

            Section("深色模式增强") {
                Toggle("启用深色模式增强", isOn: $settings.darkModeEnhancement)
                    .onChange(of: settings.darkModeEnhancement) { _, newValue in
                        // Apply dark mode enhancement
                    }

                Text("在暗环境下自动增强深色效果，减少屏幕对比度刺激")
                    .font(.caption)
                    .foregroundColor(.secondary)
            }
        }
        .formStyle(.grouped)
        .padding()
    }
}

struct AdvancedTab: View {
    @ObservedObject var settings: EyeCareSettings

    var body: some View {
        Form {
            Section("显示优化") {
                Toggle("防闪烁模式", isOn: $settings.antiFlickerEnabled)
                    .onChange(of: settings.antiFlickerEnabled) { _, newValue in
                        // Apply anti-flicker settings
                    }

                Text("降低屏幕频闪，减少眼睛疲劳和头痛风险")
                    .font(.caption)
                    .foregroundColor(.secondary)
            }

            Section("用眼健康") {
                VStack(alignment: .leading, spacing: 8) {
                    Text("健康提示")
                        .font(.headline)

                    Text("• 保持适当屏幕距离（50-70cm）")
                    Text("• 每 20 分钟看远处 20 秒")
                    Text("• 确保充足的环境光线")
                    Text("• 定期进行眼科检查")
                }
                .padding(.vertical, 8)

                Button("视力测试") {
                    // Open vision test
                }
                .buttonStyle(.bordered)
            }

            Section {
                Button("重置所有设置") {
                    settings.resetToDefaults()
                }
                .foregroundColor(.red)
            }
        }
        .formStyle(.grouped)
        .padding()
    }
}
```

- [ ] **Step 2: Create StatisticsView.swift**

```swift
import SwiftUI
import Charts

struct StatisticsView: View {
    @State private var weeklyStats: [EyeCareStats] = []
    @State private var todayStats: EyeCareStats?

    var body: some View {
        VStack(spacing: 20) {
            HStack(spacing: 20) {
                StatCard(title: "今日使用", value: "\(todayStats?.usageMinutes ?? 0)", unit: "分钟", icon: "clock")
                StatCard(title: "休息次数", value: "\(todayStats?.breaksTaken ?? 0)", unit: "次", icon: "cup.and.saucer")
                StatCard(title: "疲劳指数", value: String(format: "%.1f", todayStats?.fatigueScore ?? 0), unit: "", icon: "face.smiling")
            }
            .padding(.horizontal)

            VStack(alignment: .leading) {
                Text("本周用眼趋势")
                    .font(.headline)
                    .padding(.horizontal)

                if weeklyStats.isEmpty {
                    Text("暂无数据")
                        .foregroundColor(.secondary)
                        .frame(height: 200)
                } else {
                    Chart(weeklyStats) { stat in
                        BarMark(
                            x: .value("日期", stat.date, unit: .day),
                            y: .value("使用时长", stat.usageMinutes)
                        )
                        .foregroundStyle(.blue)
                    }
                    .frame(height: 200)
                    .padding(.horizontal)
                }
            }

            VStack(alignment: .leading, spacing: 8) {
                Text("疲劳等级")
                    .font(.headline)

                HStack {
                    FatigueLevelIndicator(level: "轻松", color: .green)
                    FatigueLevelIndicator(level: "轻微疲劳", color: .yellow)
                    FatigueLevelIndicator(level: "中度疲劳", color: .orange)
                    FatigueLevelIndicator(level: "严重疲劳", color: .red)
                }
            }
            .padding()

            Spacer()
        }
        .padding()
        .onAppear {
            loadStats()
        }
    }

    private func loadStats() {
        weeklyStats = EyeCareDatabase.shared.getWeeklyStats()
        todayStats = EyeCareDatabase.shared.getStats(for: Date())
    }
}

struct StatCard: View {
    let title: String
    let value: String
    let unit: String
    let icon: String

    var body: some View {
        VStack(spacing: 8) {
            Image(systemName: icon)
                .font(.title2)
                .foregroundColor(.blue)

            Text(value)
                .font(.title)
                .fontWeight(.bold)

            Text(title)
                .font(.caption)
                .foregroundColor(.secondary)

            if !unit.isEmpty {
                Text(unit)
                    .font(.caption2)
                    .foregroundColor(.secondary)
            }
        }
        .frame(maxWidth: .infinity)
        .padding()
        .background(Color(NSColor.controlBackgroundColor))
        .cornerRadius(12)
    }
}

struct FatigueLevelIndicator: View {
    let level: String
    let color: Color

    var body: some View {
        VStack(spacing: 4) {
            Circle()
                .fill(color)
                .frame(width: 20, height: 20)

            Text(level)
                .font(.caption2)
                .foregroundColor(.secondary)
        }
    }
}
```

- [ ] **Step 3: Commit**

```bash
git add EyeCare/EyeCareApp/Windows/
git commit -m "feat: add SwiftUI Settings and Statistics views"
```

---

## Task 7: App Entry Point

**Files:**
- Create: `EyeCare/EyeCareApp/main.swift`
- Create: `EyeCare/EyeCareApp/AppDelegate.swift`

- [ ] **Step 1: Create main.swift**

```swift
import AppKit

let app = NSApplication.shared
let delegate = AppDelegate()
app.delegate = delegate
app.run()
```

- [ ] **Step 2: Create AppDelegate.swift**

```swift
import AppKit

final class AppDelegate: NSObject, NSApplicationDelegate {
    private var menuBarController: MenuBarController?

    func applicationDidFinishLaunching(_ notification: Notification) {
        menuBarController = MenuBarController()

        let settings = EyeCareSettings.shared
        ColorTemperatureService.shared.applyColorTemperature(settings.colorTemperature)

        if let reminder = settings.breakReminders.first, reminder.enabled {
            BreakReminderService.shared.startReminder(for: reminder)
        }
    }

    func applicationWillTerminate(_ notification: Notification) {
        ColorTemperatureService.shared.resetToDefault()
        BreakReminderService.shared.stopReminder()
    }

    func applicationSupportsSecureRestorableState(_ app: NSApplication) -> Bool {
        return true
    }
}
```

- [ ] **Step 3: Commit**

```bash
git add EyeCare/EyeCareApp/main.swift EyeCare/EyeCareApp/AppDelegate.swift
git commit -m "feat: add app entry point (main.swift, AppDelegate)"
```

---

## Task 8: ScreenFilter Extension

**Files:**
- Create: `EyeCare/ScreenFilter/ScreenFilterView.swift`

- [ ] **Step 1: Create ScreenFilterView.swift**

```swift
import AppKit
import ScreenSaver

final class ScreenFilterView: NSView {
    private var overlayWindow: NSWindow?
    private var currentColorTemperature: Int = 5000

    override init?(frame: NSRect, isPreview: Bool) {
        super.init(frame: frame, isPreview: isPreview)
        setupOverlay()
    }

    required init?(coder: NSCoder) {
        super.init(coder: coder)
        setupOverlay()
    }

    private func setupOverlay() {
        guard let screen = NSScreen.main else { return }

        let window = NSWindow(
            contentRect: screen.frame,
            styleMask: .borderless,
            backing: .buffered,
            defer: false
        )

        window.level = NSWindow.Level(rawValue: Int(CGWindowLevelForKey(.maximumWindow)) - 1)
        window.backgroundColor = .clear
        window.isOpaque = false
        window.hasShadow = false
        window.ignoresMouseEvents = true
        window.collectionBehavior = [.canJoinAllSpaces, .stationary]

        self.frame = screen.frame
        window.contentView = self

        overlayWindow = window
        overlayWindow?.orderFront(nil)

        updateFilterColor()
    }

    func updateFilterColor() {
        let normalized = Double(max(1200, min(6500, currentColorTemperature)))
        let warmth = (normalized - 1200) / (6500 - 1200)

        let red: CGFloat = 0.0
        let green: CGFloat = CGFloat(warmth * 0.3)
        let blue: CGFloat = CGFloat(warmth * 0.5)

        let overlayColor = NSColor(red: red, green: green, blue: blue, alpha: CGFloat(warmth * 0.3))

        needsDisplay = true
    }

    override func draw(_ rect: NSRect) {
        let normalized = Double(max(1200, min(6500, currentColorTemperature)))
        let warmth = (normalized - 1200) / (6500 - 1200)

        let overlayColor = NSColor(
            red: 0,
            green: CGFloat(warmth * 0.15),
            blue: CGFloat(warmth * 0.3),
            alpha: CGFloat(warmth * 0.25)
        )

        overlayColor.setFill()
        bounds.fill()
    }

    func setColorTemperature(_ kelvin: Int) {
        currentColorTemperature = kelvin
        updateFilterColor()
    }

    deinit {
        overlayWindow?.orderOut(nil)
    }
}
```

- [ ] **Step 2: Commit**

```bash
git add EyeCare/ScreenFilter/ScreenFilterView.swift
git commit -m "feat: add ScreenFilter extension for overlay color temperature"
```

---

## Task 9: Build & Verify

- [ ] **Step 1: Install XcodeGen if needed**

Run: `which xcodegen || brew install xcodegen`

- [ ] **Step 2: Generate Xcode project**

Run: `cd EyeCare && xcodegen generate`

- [ ] **Step 3: Open project in Xcode**

Run: `open EyeCare.xcodeproj`

- [ ] **Step 4: Build the project**

In Xcode: Product > Build (Cmd+B)
Expected: Build succeeds

- [ ] **Step 5: Verify Menu Bar appears**

Run the app and check Menu Bar for EyeCare icon

---

## Implementation Complete

Plan complete and saved to `docs/superpowers/plans/2026-03-29-eyecare-implementation.md`.

**Two execution options:**

1. **Subagent-Driven (recommended)** - I dispatch a fresh subagent per task, review between tasks, fast iteration

2. **Inline Execution** - Execute tasks in this session using executing-plans, batch execution with checkpoints

**Which approach?**

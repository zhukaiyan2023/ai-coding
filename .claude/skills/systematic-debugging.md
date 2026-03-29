---
name: systematic-debugging
description: 系统化调试，四阶段根因分析，对齐 superpowers
triggers:
  - debug
  - 调试
  - bug
  - 问题分析
  - 修复
  - root cause
---

# Skill: Systematic Debugging

> 对齐 [systematic-debugging](https://github.com/obra/superpowers)

## 描述

系统化调试方法，通过四阶段根因分析快速定位和修复问题。

---

## 四阶段调试流程

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  ┌─────────────┐   ┌─────────────┐   ┌─────────────┐     │
│  │  1. REPRODUCE │ → │  2. ISOLATE  │ → │  3. IDENTIFY │     │
│  │     复现      │   │     隔离      │   │     识别      │     │
│  └─────────────┘   └─────────────┘   └─────────────┘     │
│                                            │              │
│                                            ▼              │
│                                    ┌─────────────┐        │
│                                    │  4. VERIFY    │        │
│                                    │     验证      │        │
│                                    └─────────────┘        │
└─────────────────────────────────────────────────────────────┘
```

---

## Step 1: REPRODUCE - 复现问题

### 目标
在受控环境中稳定复现问题。

### 检查清单
- [ ] 记录问题发生的完整环境（OS、版本、配置）
- [ ] 确定问题的触发条件
- [ ] 记录错误日志/堆栈信息
- [ ] 创建一个最小可复现的测试用例

### 输出
```
问题报告：
- 环境：Ubuntu 22.04, Java 17, Spring Boot 3.1
- 触发：并发请求 > 100 QPS
- 错误：NullPointerException at UserService.java:42
```

### 复现命令
```bash
# 查看日志
tail -f logs/application.log | grep "ERROR"

# 重放请求
curl -X POST http://localhost:8080/api/users -d '{"name":"test"}'

# 并发测试
wrk -t4 -c100 -d30s http://localhost:8080/api/users
```

---

## Step 2: ISOLATE - 隔离问题

### 目标
通过排除法缩小问题范围。

### 检查清单
- [ ] 确认是前端/后端问题
- [ ] 确认是客户端/服务端问题
- [ ] 确认是代码/配置/环境问题
- [ ] 定位到具体模块/类/方法

### 隔离策略

#### 2.1 二分法隔离
```
问题范围: [A, B, C, D, E, F, G]

测试 [A, B, C] → 失败 → 问题在前半部分
测试 [A, B]   → 通过 → 问题在 [C]
测试 [C]      → 失败 → 定位到 C
```

#### 2.2 依赖链追踪
```java
// 从入口开始追踪
Controller → Service → Repository → Database
    ↓           ↓          ↓
  参数验证   业务逻辑    SQL执行

// 使用日志追踪
log.info("Entering: UserController.createUser()");
log.info("Creating user: {}", cmd);
log.info("Calling repository: {}", cmd.getEmail());
```

#### 2.3 变量状态追踪
```java
// 添加调试日志
log.debug("user={}, email={}, password={}",
    user, email, "***"); // 敏感信息脱敏

// 使用断点检查
// breakpoint at line 42
// inspect: user.getProfile().getSettings()
```

### 常用调试命令
```bash
# Java - 启用详细日志
-Dlogging.level.root=DEBUG
-Dlogging.level.com.example=TRACE

# Java - JMX 监控
jconsole

# Java - 线程 dump
jstack -l <pid> > threaddump.txt

# Java - 堆 dump
jmap -dump:format=b,file=heap.hprof <pid>
```

---

## Step 3: IDENTIFY - 识别根因

### 目标
找到问题的根本原因，而非表象。

### 检查清单
- [ ] 找到直接原因
- [ ] 追溯到根本原因（5 Why 分析）
- [ ] 确认是偶发还是必然
- [ ] 评估影响范围

### 5 Why 分析法

```
问题: 用户下单失败

Why 1: 库存服务返回超时
Why 2: 数据库连接池耗尽
Why 3: 有一个慢查询长时间占用连接
Why 4: 索引缺失导致全表扫描
Why 5: 上线前未执行 EXPLAIN 检查

根因: 索引缺失
```

### 常见根因类型

| 类型 | 典型表现 | 根因 |
|------|----------|------|
| 并发 | 时序问题、数据错乱 | 竞态条件、锁粒度 |
| 内存 | OOM、GC 频繁 | 内存泄漏、大对象 |
| I/O | 超时、响应慢 | N+1、缺索引 |
| 异常 | 500、崩溃 | 空指针、类型转换 |

### 根因识别命令
```bash
# 性能分析
jProfiler
async-profiler
-Dasync.profiler=true

# 内存分析
jmap -heap <pid>
jhat heap.hprof

# SQL 分析
EXPLAIN ANALYZE SELECT * FROM orders WHERE user_id = 1;

# 死锁检测
jstack -l <pid> | grep -A 20 "deadlock"
```

---

## Step 4: VERIFY - 验证修复

### 目标
确保修复有效，且未引入新问题。

### 检查清单
- [ ] 修复后问题不再复现
- [ ] 相关功能未受影响
- [ ] 性能未明显下降
- [ ] 边界条件已考虑

### 验证流程

```bash
# 1. 运行复现测试
mvn test -Dtest=*BugReproTest

# 2. 运行完整测试
mvn test

# 3. 性能回归测试
jmeter -n -t load-test.jmx

# 4. 边界条件测试
# 测试各种异常输入
```

### 验证标准
```
✅ 修复定义：
1. 原问题在相同条件下不再发生
2. 相关功能测试全部通过
3. 代码审查通过
4. 性能指标在可接受范围内
```

---

## 调试模式

### 开发环境调试
```bash
# 启用热重载
spring-boot-devtools

# IDE 远程调试
-agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=5005
```

### 生产环境调试
```bash
# 查看实时日志
kubectl logs -f <pod-name> --tail=100

# 进入容器
kubectl exec -it <pod-name> -- /bin/sh

# 查看资源使用
kubectl top pod
```

---

## 问题分类与解决策略

### 1. 内存问题

**症状**: OOM、频繁 GC、应用变慢

**排查命令**:
```bash
jmap -heap <pid>           # 堆内存使用
jmap -histo <pid> | head   # 对象统计
jstat -gc <pid> 1000       # GC 统计
```

**常见原因**:
- 内存泄漏（集合未清理）
- 大对象（一次加载过多数据）
- 堆内存配置不当

### 2. 线程/并发问题

**症状**: CPU 高、请求超时、死锁

**排查命令**:
```bash
jstack -l <pid>            # 线程堆栈
printf 'hotspot\n' | jstack <pid>  # 热点线程

# 查看死锁
jstack <pid> | grep -A 5 "Found one Java-level deadlock"
```

**常见原因**:
- 死锁（互相等待）
- 锁竞争（热点代码）
- 线程泄漏（未关闭线程）

### 3. I/O 问题

**症状**: 响应慢、超时

**排查命令**:
```bash
# 数据库慢查询
SHOW PROCESSLIST;
SHOW VARIABLES LIKE 'slow_query_log%';
SELECT * FROM performance_schema.events_statements_summary_by_digest ORDER BY SUM_TIMER_WAIT DESC LIMIT 10;

# 网络连接
netstat -an | grep ESTABLISHED | wc -l
ss -s
```

**常见原因**:
- N+1 查询
- 缺索引
- 大字段传输
- 网络延迟

### 4. 异常问题

**症状**: 500 错误、特定功能崩溃

**排查命令**:
```bash
# 查看异常日志
grep -A 20 "Exception" logs/app.log

# 启用详细异常
-Dserver.error.include-stacktrace=always
```

**常见原因**:
- 空指针（未初始化）
- 类型转换（ClassCastException）
- 资源未关闭（连接泄漏）

---

## 检查清单

### 复现阶段
- [ ] 环境信息完整记录
- [ ] 触发条件清晰
- [ ] 错误日志/堆栈获取
- [ ] 最小复现用例准备

### 隔离阶段
- [ ] 问题范围已缩小
- [ ] 排除非相关模块
- [ ] 依赖链追踪完成

### 识别阶段
- [ ] 根因已确定（5 Why）
- [ ] 影响范围已评估
- [ ] 偶发/必然已判断

### 验证阶段
- [ ] 原问题不再复现
- [ ] 回归测试通过
- [ ] 性能未明显下降
- [ ] 代码审查通过

---

## 常用调试工具

| 工具 | 用途 |
|------|------|
| jstack | 线程堆栈分析 |
| jmap | 内存分析 |
| jstat | GC 统计 |
| jconsole | JMX 监控 |
| VisualVM | 性能分析 |
| async-profiler | CPU/内存分析 |
| Arthas | Java 在线诊断 |

---

## 最佳实践

1. **最小复现**: 先创建最小复现用例，再深入分析
2. **一次一变量**: 隔离时每次只改一个变量
3. **证据驱动**: 用日志和数据说话，而非猜测
4. **回归测试**: 修复后必须运行完整测试套件
5. **文档记录**: 将问题和解决方案记录到 Wiki

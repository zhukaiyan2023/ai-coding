---
name: debugging
description: Systematic debugging skill for identifying and fixing bugs. Use when investigating issues, crashes, or unexpected behavior in the codebase.
---

# Debugging Skill

## Overview

This skill provides a systematic approach to debugging that helps identify root causes efficiently. It follows the scientific method: observe, hypothesize, experiment, and conclude.

## When to Use

- Investigating crashes or errors
- Fixing unexpected behavior
- Performance issues
- Memory leaks
- Race conditions
- Any bug that needs to be found and fixed

## Debugging Process

### Phase 1: Understand the Problem

```
1. Collect Information
   - What is the expected behavior?
   - What is the actual behavior?
   - When does it occur? (reproduction steps)
   - What environment? (browser, OS, versions)
   - Any error messages?

2. Isolate the Problem
   - Can you reproduce it consistently?
   - Does it happen in specific conditions?
   - What's the scope? (single user, all users)
```

### Phase 2: Gather Evidence

```
1. Check Logs
   - Application logs
   - Browser console
   - Server logs
   - Error tracking (Sentry, etc.)

2. Use Debugging Tools
   - Browser DevTools
   - IDE debugger
   - Network inspector
   - Database query logs
```

### Phase 3: Form Hypothesis

```
Based on evidence, form a hypothesis:
- "The API returns null for user ID"
- "There's a race condition in the async flow"
- "Memory isn't being released in the component"
```

### Phase 4: Test Hypothesis

```
1. Create minimal reproduction
2. Add logging to verify hypothesis
3. Use breakpoints to inspect state
4. Run targeted tests
```

### Phase 5: Fix and Verify

```
1. Implement the fix
2. Run tests to verify fix
3. Check for edge cases
4. Monitor in production
```

## Common Bug Patterns

### 1. Null/Undefined Errors

```typescript
// ❌ Problem: No null check
const userName = user.profile.name;

// ✅ Fix: Optional chaining
const userName = user?.profile?.name;

// ✅ Fix: Default value
const userName = user?.profile?.name ?? 'Unknown';
```

### 2. Async Issues

```typescript
// ❌ Problem: Not awaiting
async function getData() {
  fetchData(); // Returns promise, not awaited
  render(); // Runs before data arrives
}

// ✅ Fix: Proper async/await
async function getData() {
  const data = await fetchData();
  render(data);
}
```

### 3. Race Conditions

```typescript
// ❌ Problem: Race condition
let user;
fetchUser().then(u => user = u);
console.log(user); // Might be undefined

// ✅ Fix: Proper async flow
async function loadUser() {
  const user = await fetchUser();
  console.log(user); // Always defined
}
```

### 4. Memory Leaks

```typescript
// ❌ Problem: Event listener not cleaned up
useEffect(() => {
  window.addEventListener('resize', handleResize);
}, []);

// ✅ Fix: Cleanup in return
useEffect(() => {
  window.addEventListener('resize', handleResize);
  return () => window.removeEventListener('resize', handleResize);
}, []);
```

### 5. Stale Closures

```typescript
// ❌ Problem: Stale closure
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100); // Prints 3,3,3
}

// ✅ Fix: Use let or closure
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100); // Prints 0,1,2
}
```

## Debugging Tools

### Browser DevTools

| Tab | Use For |
|-----|---------|
| Console | Log output, errors |
| Network | API requests, timing |
| Sources | Breakpoints, stepping |
| Elements | DOM inspection |
| Performance | Performance issues |
| Memory | Memory leaks |

### VS Code Debugging

```json
// launch.json configuration
{
  "type": "node",
  "request": "launch",
  "name": "Debug Tests",
  "program": "${workspaceFolder}/node_modules/jest/bin/jest.js",
  "args": ["--runInBand"],
  "console": "integratedTerminal"
}
```

### Logging Best Practices

```typescript
// ✅ Good: Structured logging
logger.info('User created', {
  userId: user.id,
  email: user.email,
  duration: performance.now() - start
});

// ✅ Good: Context in errors
throw new Error(`Failed to fetch user ${userId}`, {
  cause: error
});

// ❌ Bad: Console.log spam
console.log('here1');
console.log('here2');
console.log(user);
```

## Debugging Commands

### Git Debugging

```bash
# Find the commit that broke something
git bisect start
git bisect bad
git bisect good v1.0.0

# See who introduced a line
git blame -L 10,20 file.ts

# View history of a function
git log -p --follow functionName

# See what changed in a commit
git show <commit>
```

### Node.js Debugging

```bash
# Debug with Node
node --inspect index.js

# Debug with Chrome DevTools
chrome://inspect

# Debug tests
node --inspect-brk node_modules/.bin/jest

# Memory profiling
node --prof app.js
```

## Common Error Messages

### "Cannot read property of undefined"

```typescript
// Check: Is the property defined?
// Fix: Use optional chaining or null check
```

### "Promise rejected"

```typescript
// Check: Are you handling promise rejections?
// Fix: Add .catch() or use try/catch with await
```

### "Maximum call stack exceeded"

```typescript
// Check: Infinite recursion?
// Fix: Add base case to recursive function
```

### "CORS error"

```typescript
// Check: Server allows origin?
// Fix: Configure CORS headers on server
```

### " ECONNREFUSED"

```typescript
// Check: Is the service running?
// Fix: Start the required service
```

## Testing Fixes

### Unit Test for Bug

```typescript
it('should handle null user gracefully', () => {
  // Arrange
  const user = null;

  // Act
  const result = getUserDisplayName(user);

  // Assert
  expect(result).toBe('Guest');
});
```

### Regression Test

```typescript
it('should not regress bug #123', () => {
  // Reproduce the exact scenario from the bug report
  const input = { /* bug report scenario */ };
  expect(processInput(input)).not.toBeNull();
});
```

## Anti-Patterns

### Don't

- ❌ Use console.log instead of proper debugging
- ❌ Guess and try random fixes
- ❌ Ignore error messages
- ❌ Make changes without understanding the problem
- ❌ Fix symptoms instead of root cause

### Do

- ✅ Read error messages carefully
- ✅ Create minimal reproduction
- ✅ Use debugging tools effectively
- ✅ Fix root cause, not symptoms
- ✅ Write tests to prevent regression

## Debugging Checklist

- [ ] Reproduced the issue consistently
- [ ] Gathered relevant logs
- [ ] Identified the root cause
- [ ] Implemented the fix
- [ ] Verified the fix works
- [ ] Checked for edge cases
- [ ] Added regression test
- [ ] Documented the fix

---

## References

- VS Code Debugging: https://code.visualstudio.com/docs/editor/debugging
- Chrome DevTools: https://developer.chrome.com/docs/devtools
- Node.js Debugging: https://nodejs.org/en/docs/guides/debugging-getting-started/

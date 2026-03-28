---
name: refactoring
description: Safe code refactoring skill for improving code quality without changing behavior. Use when improving existing code, reducing complexity, or applying design patterns.
---

# Refactoring Skill

## Overview

This skill provides safe refactoring techniques that improve code quality while maintaining existing behavior. It emphasizes small, incremental changes backed by tests.

## When to Use

- Improving code readability
- Reducing complexity
- Applying design patterns
- Removing code duplication
- Technical debt cleanup
- Before adding new features

## Refactoring Principles

### 1. Boy Scout Rule

> "Always leave the code better than you found it"

```
✅ Small improvements: Rename, extract, inline
✅ Remove dead code
✅ Fix naming
❌ Don't change behavior
```

### 2. Small Steps

```
✅ Make small, incremental changes
✅ Run tests after each change
✅ Commit frequently

❌ Don't rewrite entire modules
❌ Don't combine multiple refactorings
```

### 3. Tests First

```
✅ Ensure tests exist before refactoring
✅ Run tests to verify behavior unchanged
✅ Add tests for uncovered code

❌ Don't remove tests
❌ Don't refactor without tests
```

## Common Refactorings

### 1. Extract Function

```typescript
// ❌ Before: Long function
function processOrder(order) {
  validateOrder(order);
  calculateTotal(order);
  applyDiscount(order);
  sendEmail(order);
  updateInventory(order);
  logOrder(order);
  return order;
}

// ✅ After: Extracted functions
function processOrder(order) {
  validateOrder(order);
  calculateOrderTotal(order);
  await sendOrderConfirmation(order);
  await updateInventory(order);
  logOrder(order);
  return order;
}
```

### 2. Rename Variables

```typescript
// ❌ Before: Unclear names
const d = new Date();
const x = users.filter(u => u.a > 18);

// ✅ After: Descriptive names
const currentDate = new Date();
const adultUsers = users.filter(user => user.age > 18);
```

### 3. Extract Constants

```typescript
// ❌ Before: Magic numbers
if (user.score > 100) {
  setTimeout(() => update(user), 86400000);
}

// ✅ After: Named constants
const MAX_SCORE = 100;
const ONE_DAY_MS = 86400000;

if (user.score > MAX_SCORE) {
  setTimeout(() => update(user), ONE_DAY_MS);
}
```

### 4. Use Optional Chaining

```typescript
// ❌ Before: Nested conditionals
let city = 'Unknown';
if (user && user.profile && user.profile.address) {
  city = user.profile.address.city;
}

// ✅ After: Optional chaining
const city = user?.profile?.address?.city ?? 'Unknown';
```

### 5. Extract to Hook

```typescript
// ❌ Before: Logic in component
function UserProfile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUser().then(data => {
      setUser(data);
      setLoading(false);
    });
  }, []);

  // ... rest of component
}

// ✅ After: Custom hook
function useUser() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUser().then(data => {
      setUser(data);
      setLoading(false);
    });
  }, []);

  return { user, loading };
}

function UserProfile() {
  const { user, loading } = useUser();
  // ... rest of component
}
```

### 6. Replace Conditional with Polymorphism

```typescript
// ❌ Before: Switch statement
class PaymentProcessor {
  process(payment) {
    switch (payment.type) {
      case 'credit':
        return this.processCredit(payment);
      case 'debit':
        return this.processDebit(payment);
      case 'paypal':
        return this.processPaypal(payment);
    }
  }
}

// ✅ After: Polymorphism
abstract class Payment {
  abstract process(): PaymentResult;
}

class CreditPayment extends Payment {
  process(): PaymentResult { /* ... */ }
}

class DebitPayment extends Payment {
  process(): PaymentResult { /* ... */ }
}
```

### 7. Introduce Parameter Object

```typescript
// ❌ Before: Many parameters
function createUser(name, email, age, address, phone, company) {
  // ...
}

// ✅ After: Parameter object
interface UserDetails {
  name: string;
  email: string;
  age: number;
  address: string;
  phone: string;
  company: string;
}

function createUser(details: UserDetails) {
  // ...
}
```

## Code Smells

### 1. Long Function

```
Symptoms: Functions > 30 lines
Solution: Extract into smaller functions
```

### 2. Large Class

```
Symptoms: Class > 200 lines
Solution: Split into smaller classes using SRP
```

### 3. Duplicate Code

```
Symptoms: Same code in multiple places
Solution: Extract to shared function/module
```

### 4. Magic Numbers

```
Symptoms: Numbers without explanation
Solution: Extract to named constants
```

### 5. God Object

```
Symptoms: Object knows/touches too much
Solution: Use dependency injection
```

### 6. Feature Envy

```
Symptoms: Class uses another class's data too much
Solution: Move method to that class
```

## Refactoring Checklist

### Before Refactoring

- [ ] Tests exist and pass
- [ ] Code is version controlled
- [ ] You understand the current behavior
- [ ] Backup branch created

### During Refactoring

- [ ] Small, incremental changes
- [ ] Tests still pass after each change
- [ ] No new linting errors
- [ ] TypeScript compiles without errors

### After Refactoring

- [ ] All tests pass
- [ ] Behavior unchanged (verified)
- [ ] No duplicate code
- [ ] Code is more readable
- [ ] Complexity reduced

## Safe Refactoring Order

1. **Rename** - Low risk, high clarity
2. **Extract** - Low risk, improves structure
3. **Move** - Medium risk, reorganize
4. **Inline** - Low risk, removes indirection
5. **Replace** - Higher risk, change patterns

## When NOT to Refactor

- ❌ When deadline is imminent
- ❌ On a feature branch (unless it's the purpose)
- ❌ Without tests (create tests first)
- ❌ When you don't understand the code
- ❌ In production emergency (fix bug first)

## Git Workflow for Refactoring

```bash
# Create refactoring branch
git checkout -b refactor/user-service

# Make small commits
git commit -m "refactor: extract validation to separate function"
git commit -m "refactor: rename variables for clarity"
git commit -m "refactor: extract custom useUser hook"

# Run full test suite
npm test

# Create PR with clear description
```

## Anti-Patterns

### Don't

- ❌ Refactor and add features simultaneously
- ❌ Leave tests failing during refactoring
- ❌ Change behavior while refactoring
- ❌ Refactor code you don't understand
- ❌ Make large, sweeping changes

### Do

- ✅ Keep refactoring focused and small
- ✅ Run tests after each change
- ✅ Write tests for uncovered code
- ✅ Use linters and formatters
- ✅ Document significant changes

## Tools for Refactoring

| Tool | Purpose |
|------|---------|
| VS Code | Rename, extract, inline |
| ESLint | Detect code smells |
| Prettier | Format code |
| Jest | Verify behavior |
| Git | Version control |

---

## References

- Martin Fowler's Refactoring: https://refactoring.com/
- Clean Code by Robert Martin
- Working Effectively with Legacy Code

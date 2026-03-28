---
name: code-review
description: Code quality review skill for performing effective code reviews. Use when reviewing pull requests or performing self-review before submitting changes.
---

# Code Review Skill

## Overview

This skill provides a systematic approach to code review, focusing on code quality, security, performance, and best practices. It helps reviewers provide constructive feedback and authors prepare their code for review.

## When to Use

- Reviewing pull requests
- Self-review before submitting changes
- Performing peer reviews
- Evaluating code quality
- Checking security vulnerabilities

## Review Checklist

### 1. Code Quality

- [ ] Code follows project style guide
- [ ] Variable and function names are descriptive
- [ ] Functions are small and focused (SRP)
- [ ] No code duplication (>5% threshold)
- [ ] Comments explain WHY, not WHAT
- [ ] Code is readable and self-documenting

### 2. Type Safety

- [ ] No `any` types without justification
- [ ] No `@ts-ignore` or `@ts-expect-error`
- [ ] TypeScript strict mode enabled
- [ ] Proper type definitions for APIs
- [ ] Generics used appropriately

### 3. Error Handling

- [ ] No empty catch blocks
- [ ] Errors are logged with context
- [ ] User-friendly error messages
- [ ] Proper exception types used
- [ ] Errors propagate correctly

### 4. Security

- [ ] No hardcoded secrets
- [ ] Input validation implemented
- [ ] SQL injection prevented
- [ ] XSS vulnerabilities avoided
- [ ] Authentication/authorization checked
- [ ] Sensitive data encrypted

### 5. Performance

- [ ] No N+1 query problems
- [ ] Appropriate use of caching
- [ ] Lazy loading where applicable
- [ ] Bundle size optimized
- [ ] No memory leaks

### 6. Testing

- [ ] Test coverage meets requirements
- [ ] Tests are independent
- [ ] Edge cases covered
- [ ] Mock external dependencies
- [ ] Tests are maintainable

### 7. Documentation

- [ ] API documentation complete
- [ ] README updated if needed
- [ ] Complex logic explained
- [ ] Breaking changes documented

## Review Types

### 1. Quick Review (< 5 minutes)

For small changes, typos, minor fixes:

```
✅ Check: Does it work as intended?
✅ Check: No obvious bugs?
✅ Check: Code style consistent?
```

### 2. Standard Review (15-30 minutes)

For feature changes, bug fixes:

```
✅ Full checklist review
✅ Security considerations
✅ Performance impact
✅ Test coverage
```

### 3. Deep Review (1+ hour)

For architectural changes, critical components:

```
✅ Full standard review
✅ Design pattern analysis
✅ Scalability considerations
✅ Integration testing
✅ Documentation review
```

## Giving Feedback

### Good Comments

```typescript
// ✅ Good: Specific and actionable
// Consider using Map<string, User> for O(1) lookup
// instead of array.find() which is O(n)

// ✅ Good: Explains the reasoning
// Using event delegation to handle dynamic elements
// This is more performant than attaching listeners to each item

// ✅ Good: Questions are polite
// What do you think about extracting this into a utility function?
// It would improve reusability.
```

### Bad Comments

```typescript
// ❌ Bad: Vague
// This is bad

// ❌ Bad: Personal attack
// Who wrote this? It's terrible.

// ❌ Bad: Without context
// Use XXX instead
```

## Review Response Template

### For Author

```
## Self-Review Summary

- [ ] I've tested my changes locally
- [ ] All tests pass
- [ ] I've considered edge cases
- [ ] I've updated documentation

## Testing Performed

- Unit tests: ✅
- Integration tests: ✅
- Manual testing: ✅ (describe what you tested)

## Related Issues

- Fixes #123
- Related to #456
```

### For Reviewer

```
## Code Review: [PR Title]

### Overall Impression
[Positive start, then areas for improvement]

### Must Fix (Blocking)
- [ ] Security issue: Line 45 - SQL injection risk
- [ ] Bug: Line 78 - null pointer exception

### Should Fix (Recommended)
- [ ] Performance: Consider caching this result
- [ ] Readability: Extract to named constant

### Nitpicks (Optional)
- [ ] Minor: Extra blank line at line 12
- [ ] Style: Could use const instead of let

### Questions
- [ ] Why did you choose this approach?
- [ ] How does this handle edge case X?

### Praise
- Great use of TypeScript generics!
- Clean separation of concerns.
- Excellent test coverage!
```

## Anti-Patterns

### For Reviewers

- ❌ Don't nitpick formatting (use linters instead)
- ❌ Don't block on personal preferences
- ❌ Don't review large changes in one go
- ❌ Don't be silent on issues
- ❌ Don't forget to praise good code

### For Authors

- ❌ Don't take feedback personally
- ❌ Don't argue about style (use linters)
- ❌ Don't submit huge PRs
- ❌ Don't skip self-review
- ❌ Don't ignore blocking issues

## Best Practices

### Before Submitting

1. Run all tests locally
2. Run linters and formatters
3. Self-review your changes
4. Write clear PR description
5. Keep PRs atomic and focused

### During Review

1. Test the changes locally
2. Check edge cases
3. Verify security implications
4. Consider performance impact
5. Provide constructive feedback

### After Review

1. Respond to all comments
2. Make requested changes
3. Re-request review
4. Address questions

## Security Checklist

```
Authentication & Authorization
- [ ] Proper authentication checks
- [ ] Role-based access control
- [ ] Session management secure

Data Protection
- [ ] Sensitive data encrypted
- [ ] No credentials in code
- [ ] Environment variables used

Input Validation
- [ ] All inputs validated
- [ ] SQL injection prevented
- [ ] XSS prevention in place
- [ ] CSRF tokens implemented

API Security
- [ ] Rate limiting
- [ ] HTTPS only
- [ ] CORS properly configured
- [ ] API keys rotated
```

---

## References

- Google Code Review Guide: https://google.github.io/eng-practices/review/
- GitHub Pull Request Best Practices
- OWASP Security Guidelines

# Development Skill Standard

## Overview

This document defines the comprehensive standard for development skills, including rules, skills, and hooks that AI coding agents should follow. The standard is designed to ensure consistent, high-quality, and efficient development workflows across projects.

## Table of Contents

1. [Core Rules](#core-rules)
2. [Required Skills](#required-skills)
3. [Hooks System](#hooks-system)
4. [Skill Categories](#skill-categories)
5. [Quality Standards](#quality-standards)
6. [Best Practices](#best-practices)

---

## Core Rules

### 1. Code Quality Rules

#### 1.1 Type Safety
- Never use type suppression (`as any`, `@ts-ignore`, `@ts-expect-error`)
- Always prefer explicit types over implicit types
- Use strict null checking in TypeScript projects
- Enable strict mode in TypeScript configuration

#### 1.2 Error Handling
- Never use empty catch blocks `catch(e) {}`
- Always log errors with appropriate context
- Implement proper error boundaries in UI components
- Return meaningful error messages to users

#### 1.3 Testing Requirements
- Never delete failing tests to "pass"
- Write tests before implementing features (TDD approach)
- Maintain minimum 80% code coverage for critical modules
- Include integration tests for API endpoints

### 2. Git Workflow Rules

#### 2.1 Commit Standards
- Use conventional commit messages: `type(scope): description`
- Types: feat, fix, docs, style, refactor, test, chore
- Keep commits atomic and focused
- Reference issue numbers in commit messages

#### 2.2 Branch Management
- Use feature branches for all changes
- Follow naming: `feature/description`, `fix/description`, `refactor/description`
- Never commit directly to main/master
- Require code review before merging

#### 2.3 Code Review Rules
- Review all changes before merging
- Check for security vulnerabilities
- Verify test coverage
- Ensure documentation is updated

### 3. Project Structure Rules

#### 3.1 File Organization
- Follow domain-driven design (DDD) for large projects
- Keep related files together (component + styles + tests)
- Use consistent naming conventions
- Limit file length to 300 lines maximum

#### 3.2 Configuration Management
- Never commit secrets to version control
- Use environment variables for sensitive data
- Maintain consistent config across environments
- Document all configuration options

---

## Required Skills

### 1. Technical Skills

#### 1.1 Language Proficiency
- TypeScript/JavaScript (required)
- Python (recommended)
- Go (recommended)
- Rust (optional)

#### 1.2 Framework Expertise
- React/Next.js for frontend
- Node.js/Express for backend
- Spring Boot for Java projects
- Django/FastAPI for Python projects

#### 1.3 Database Skills
- SQL (PostgreSQL, MySQL)
- NoSQL (MongoDB, Redis)
- ORM usage (Prisma, TypeORM, SQLAlchemy)
- Database migration management

### 2. Development Workflow Skills

#### 2.1 TDD Development
- Write failing tests first
- Implement minimum code to pass tests
- Refactor while maintaining test coverage
- Use red-green-refactor cycle

#### 2.2 Code Review
- Perform self-review before requesting review
- Provide constructive feedback
- Suggest improvements with examples
- Follow coding standards checklist

#### 2.3 Debugging
- Use proper debugging tools
- Read logs effectively
- Create minimal reproduction cases
- Apply systematic debugging approach

### 3. Tool Skills

#### 3.1 IDE and Editor
- VS Code configuration and extensions
- Git integration
- Terminal efficiency
- Snippet management

#### 3.2 Build Tools
- Webpack/Vite for frontend
- Gradle/Maven for Java
- Cargo for Rust
- npm/yarn/pnpm package management

#### 3.3 Testing Tools
- Jest/Mocha for unit tests
- Cypress/Playwright for E2E tests
- Postman for API testing
- Lighthouse for performance testing

---

## Hooks System

### 1. Pre-Commit Hooks

#### 1.1 Linting
```
- Run ESLint on staged files
- Check TypeScript types
- Verify code formatting (Prettier)
- Scan for secrets exposure
```

#### 1.2 Testing
```
- Run unit tests on changed files
- Check test coverage threshold
- Verify no breaking changes
- Validate integration tests
```

#### 1.3 Quality Gates
```
- Check commit message format
- Verify branch naming
- Ensure issue references
- Validate changelog updates
```

### 2. Pre-Push Hooks

#### 2.1 Security Scanning
```
- Scan for vulnerabilities (npm audit)
- Check dependency licenses
- Verify secret detection
- Scan container images
```

#### 2.2 Build Verification
```
- Run full test suite
- Build production artifacts
- Verify Docker images
- Check bundle size limits
```

### 3. CI/CD Hooks

#### 3.1 Pipeline Stages
```
1. Code Quality Check
   - Linting
   - Type checking
   - Code complexity analysis

2. Test Execution
   - Unit tests
   - Integration tests
   - E2E tests (optional)

3. Security Scan
   - Dependency vulnerabilities
   - Static analysis
   - Secret detection

4. Build & Deploy
   - Docker build
   - Artifact upload
   - Deployment trigger
```

#### 3.2 Quality Gates
- Minimum 80% test coverage
- No critical/high vulnerabilities
- All tests passing
- Code review approved

---

## Skill Categories

### 1. Core Development Skills

| Skill | Description | Priority |
|-------|-------------|----------|
| tdd-development | Test-driven development workflow | Required |
| code-review | Code quality review and feedback | Required |
| debugging | Systematic debugging and troubleshooting | Required |
| refactoring | Safe code refactoring techniques | Required |
| version-control | Git workflow and branching | Required |

### 2. Specialized Skills

| Skill | Description | Priority |
|-------|-------------|----------|
| frontend-ui-ux | UI/UX implementation | Optional |
| database-design | Database schema design | Optional |
| api-design | RESTful API design | Optional |
| security | Security best practices | Recommended |
| performance | Performance optimization | Optional |

### 3. Automation Skills

| Skill | Description | Priority |
|-------|-------------|----------|
| ci-cd | CI/CD pipeline configuration | Recommended |
| infrastructure | Infrastructure as code | Optional |
| monitoring | Application monitoring | Optional |
| testing | Test automation | Required |

---

## Quality Standards

### 1. Code Quality Metrics

#### 1.1 Complexity
- Cyclomatic complexity < 10
- Function length < 30 lines
- Class length < 200 lines
- File length < 300 lines

#### 1.2 Maintainability
- Code duplication < 5%
- Comment ratio 10-20%
- Naming consistency score > 90%
- Module coupling score < 50%

#### 1.3 Performance
- First contentful paint < 1.5s
- Time to interactive < 3s
- Bundle size < 500KB (initial)
- API response time < 200ms

### 2. Testing Standards

#### 2.1 Test Coverage
- Unit tests: 80% minimum
- Integration tests: 60% minimum
- Critical paths: 100%

#### 2.2 Test Quality
- Each test has single assertion focus
- Tests are independent and isolated
- Mock external dependencies
- Use descriptive test names

#### 2.3 Test Execution
- Unit tests: < 5 minutes
- Integration tests: < 15 minutes
- E2E tests: < 30 minutes

---

## Best Practices

### 1. Development Workflow

#### 1.1 Starting a Task
```
1. Understand requirements thoroughly
2. Create task breakdown (todos)
3. Check existing patterns in codebase
4. Set up development environment
5. Write tests first (TDD)
```

#### 1.2 During Development
```
1. Keep changes focused and atomic
2. Run tests frequently
3. Commit regularly
4. Update documentation
5. Seek feedback early
```

#### 1.3 Completing a Task
```
1. Run full test suite
2. Perform self-review
3. Request code review
4. Address feedback
5. Merge and deploy
```

### 2. Communication Standards

#### 2.1 Commit Messages
```
feat(auth): add JWT token refresh mechanism
- Implement token refresh endpoint
- Add token expiration handling
- Update auth middleware
Fixes #123
```

#### 2.2 Code Comments
```typescript
// Good: explains WHY, not WHAT
// Using closure to preserve context in async callback
// This approach avoids binding issues in event handlers
function handleClick() {
  // ...
}

// Bad: redundant explanation
// This function logs the message
function log(message) {
  console.log(message);
}
```

#### 2.3 Documentation
- API endpoints: OpenAPI/Swagger spec
- Database: Entity relationship diagrams
- Architecture: System design documents
- Runbooks: Operational procedures

### 3. Security Standards

#### 3.1 Authentication
- Use industry-standard auth (OAuth 2.0, JWT)
- Implement proper session management
- Use secure password hashing (bcrypt, Argon2)
- Enable MFA for sensitive operations

#### 3.2 Data Protection
- Encrypt sensitive data at rest
- Use TLS for data in transit
- Implement proper input validation
- Sanitize outputs to prevent XSS

#### 3.3 Dependency Security
- Regularly update dependencies
- Scan for vulnerabilities (Snyk, Dependabot)
- Use pinned versions in production
- Review license compliance

---

## Skill Implementation Guide

### 1. Setting Up Skills

```bash
# Install required skills
npx skills add opencode/tdd-development
npx skills add opencode/code-review
npx skills add opencode/auto-reviewer

# Configure hooks
npm install -D husky lint-staged
```

### 2. Skill Usage

```typescript
// Load skill for TDD development
skill(name="tdd-development")

// During implementation
// 1. Write failing test first
// 2. Implement minimum code
// 3. Refactor
// 4. Run tests
// 5. Commit
```

### 3. Customizing Skills

- Override default configurations in `skill.config.json`
- Add project-specific rules
- Extend hooks with custom scripts
- Integrate with existing tools

---

## Conclusion

This skill standard provides a comprehensive framework for AI-assisted development. By following these rules, leveraging the defined skills, and implementing the hook system, development teams can achieve consistent quality, improved efficiency, and maintainable codebases.

Remember:
- Rules ensure consistency
- Skills enable capability
- Hooks automate quality
- Standards drive excellence

---

## Revision History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0.0 | 2026-03-28 | Initial standard | Development Team |

# Code Reviewer Agent Playbook

## Mission

The code reviewer agent supports the team by reviewing code changes for quality, style, maintainability, and adherence to project conventions. Engage this agent for all pull requests, major refactors, and before merging new features or bug fixes.

## Responsibilities

- Review code for correctness, clarity, and maintainability
- Ensure adherence to coding standards and style guides
- Identify potential bugs, security issues, and anti-patterns
- Suggest improvements and refactoring opportunities
- Validate test coverage and documentation updates
- Collaborate with authors and other agents during review

## Best Practices

- Provide constructive, actionable feedback
- Focus on code readability and simplicity
- Check for side effects and regression risks
- Require tests for new features and bug fixes
- Ensure documentation is updated as needed
- Communicate clearly and respectfully

## Key Project Resources

- [Documentation Index](../docs/README.md)
- [Agent Handbook](README.md)
- [AGENTS.md](../../AGENTS.md)
- [Contributor Guide](../../CONTRIBUTING.md)

## Repository Starting Points

- `src/` — Main application source and entry points
- `src/modules/` — Feature modules for review focus
- `test/` — Automated tests and coverage reports

## Key Files

- `src/app.controller.ts` — Common entry point for API logic
- `src/core/services/` — Shared service implementations
- `test/` — Test cases and coverage

## Key Symbols for This Agent

- [`AppController`](../../src/app.controller.ts)
- [`AppService`](../../src/app.service.ts)
- [`AuthGuard`](../../src/core/guard/auth.guard.ts)
- [`CreateUserService`](../../src/modules/users/application/create_user.service.ts)
- [`CreateTransactionService`](../../src/modules/transactions/application/create_transaction.service.ts)

## Documentation Touchpoints

- [Development Workflow](../docs/development-workflow.md)
- [Testing Strategy](../docs/testing-strategy.md)
- [AGENTS.md](../../AGENTS.md)

## Collaboration Checklist

1. Confirm review scope and requirements
2. Review code changes and provide feedback
3. Validate tests and documentation updates
4. Approve or request changes as needed
5. Capture review learnings in AGENTS.md or docs
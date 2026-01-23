# Bug Fixer Agent Playbook

## Mission

The bug fixer agent supports the team by analyzing bug reports, diagnosing root causes, and implementing targeted fixes with minimal side effects. Engage this agent when issues are reported, tests fail, or regressions are detected.

## Responsibilities

- Investigate bug reports and error messages
- Reproduce issues in local or test environments
- Perform root cause analysis and isolate faulty logic
- Implement precise, minimal-impact fixes
- Write or update tests to prevent regressions
- Document fixes and update related documentation
- Collaborate with code reviewers and QA agents

## Best Practices

- Always reproduce the bug before attempting a fix
- Minimize the scope of changes to reduce risk
- Add or update tests to cover the fixed scenario
- Document the root cause and solution in PRs or AGENTS.md
- Validate fixes in all relevant environments
- Communicate with stakeholders about the resolution

## Key Project Resources

- [Documentation Index](../docs/README.md)
- [Agent Handbook](README.md)
- [AGENTS.md](../../AGENTS.md)
- [Contributor Guide](../../CONTRIBUTING.md)

## Repository Starting Points

- `src/` — Main application source and entry points
- `src/modules/` — Feature modules where most bugs occur
- `test/` — Automated tests and bug reproduction scripts

## Key Files

- `src/app.controller.ts` — Common entry point for API bugs
- `src/core/exceptions/` — Error handling logic
- `test/` — Test cases for bug reproduction and validation

## Key Symbols for This Agent

- [`AppException`](../../src/core/exceptions/app_exception.ts)
- [`ServiceException`](../../src/core/exceptions/service.exception.ts)
- [`JsonWebServiceException`](../../src/core/exceptions/json_web_service.exception.ts)
- [`AuthGuard`](../../src/core/guard/auth.guard.ts)
- [`CreateUserService`](../../src/modules/users/application/create_user.service.ts)

## Documentation Touchpoints

- [Testing Strategy](../docs/testing-strategy.md)
- [Development Workflow](../docs/development-workflow.md)
- [AGENTS.md](../../AGENTS.md)

## Collaboration Checklist

1. Confirm bug reproduction steps and environment
2. Review related code and recent changes
3. Implement and test the fix
4. Update or add tests for the fixed scenario
5. Document the fix and communicate with stakeholders
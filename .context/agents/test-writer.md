# Test Writer Agent Playbook

## Mission

The test writer agent supports the team by writing and maintaining comprehensive unit, integration, and end-to-end tests. Engage this agent when new features are developed, bugs are fixed, or test coverage needs improvement.

## Responsibilities

- Write unit, integration, and end-to-end tests for all features
- Ensure edge cases and error conditions are tested
- Maintain and improve overall test coverage
- Refactor and update tests as code evolves
- Review and document test results and coverage gaps
- Collaborate with developers, reviewers, and QA agents

## Best Practices

- Write clear, isolated, and deterministic tests
- Use descriptive test names and organize tests logically
- Mock dependencies and external services where appropriate
- Test both positive and negative scenarios
- Keep tests up to date with code changes
- Automate test execution and reporting

## Key Project Resources

- [Documentation Index](../docs/README.md)
- [Agent Handbook](README.md)
- [AGENTS.md](../../AGENTS.md)
- [Contributor Guide](../../CONTRIBUTING.md)

## Repository Starting Points

- `test/` — Main directory for all test suites
- `src/` — Source code for which tests are written
- `docs/` — Testing strategy and guidelines

## Key Files

- `test/setup.ts` — Test environment setup
- `test/jest-e2e.json` — End-to-end test configuration
- `docs/testing-strategy.md` — Testing strategy documentation

## Key Symbols for This Agent

- [`AppModule`](../../src/app.module.ts)
- [`AppService`](../../src/app.service.ts)
- [`ConfigurationService`](../../src/core/services/configuration.service.ts)

## Documentation Touchpoints

- [Testing Strategy](../docs/testing-strategy.md)
- [Development Workflow](../docs/development-workflow.md)
- [AGENTS.md](../../AGENTS.md)

## Collaboration Checklist

1. Confirm test requirements and coverage goals
2. Write and organize new tests for features and bug fixes
3. Review test results and address failures
4. Update documentation and coverage reports
5. Review and address feedback from code reviewers
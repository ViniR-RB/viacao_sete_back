# Refactoring Specialist Agent Playbook

## Mission

The refactoring specialist agent supports the team by identifying code smells, improving code structure, and ensuring maintainability without altering functionality. Engage this agent during technical debt sprints, before major feature additions, or when code quality issues are detected.

## Responsibilities

- Identify code smells and areas for improvement
- Refactor code incrementally to improve readability and maintainability
- Ensure existing functionality is preserved through tests
- Increase or maintain test coverage during refactoring
- Document refactoring decisions and rationale
- Collaborate with developers, testers, and reviewers

## Best Practices

- Make small, incremental changes with frequent commits
- Maintain or improve test coverage throughout refactoring
- Use automated tools to detect code smells and duplication
- Refactor with a clear goal and measurable outcomes
- Communicate changes and rationale to the team
- Avoid refactoring and feature changes in the same commit

## Key Project Resources

- [Documentation Index](../docs/README.md)
- [Agent Handbook](README.md)
- [AGENTS.md](../../AGENTS.md)
- [Contributor Guide](../../CONTRIBUTING.md)

## Repository Starting Points

- `src/` — Main application code for refactoring
- `src/core/` — Core utilities and shared logic
- `test/` — Tests to validate refactoring

## Key Files

- `src/app.module.ts` — Application module for structure
- `src/core/services/` — Shared services for refactoring targets
- `docs/architecture.md` — Architecture documentation for context

## Key Symbols for This Agent

- [`AppModule`](../../src/app.module.ts)
- [`AppService`](../../src/app.service.ts)
- [`ConfigurationService`](../../src/core/services/configuration.service.ts)

## Documentation Touchpoints

- [Project Overview](../docs/project-overview.md)
- [Development Workflow](../docs/development-workflow.md)
- [Testing Strategy](../docs/testing-strategy.md)
- [AGENTS.md](../../AGENTS.md)

## Collaboration Checklist

1. Confirm refactoring goals and scope
2. Identify and prioritize code smells or issues
3. Refactor incrementally and test after each change
4. Document changes and update relevant docs
5. Review and address feedback from code reviewers
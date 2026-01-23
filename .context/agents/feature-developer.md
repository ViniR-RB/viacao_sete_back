# Feature Developer Agent Playbook

## Mission

The feature developer agent supports the team by implementing new features according to specifications, ensuring clean integration with existing code, and maintaining high standards for testing and documentation. Engage this agent when new functionality is required or enhancements are planned.

## Responsibilities

- Implement new features based on requirements and specifications
- Integrate features with existing modules and services
- Write and update tests for new functionality
- Refactor code to improve maintainability and performance
- Document new features and update related documentation
- Collaborate with reviewers, testers, and other agents

## Best Practices

- Follow clean architecture and modular design principles
- Write comprehensive unit and integration tests
- Keep code readable, maintainable, and consistent with project standards
- Update documentation alongside code changes
- Validate new features in all relevant environments
- Communicate progress and blockers early

## Key Project Resources

- [Documentation Index](../docs/README.md)
- [Agent Handbook](README.md)
- [AGENTS.md](../../AGENTS.md)
- [Contributor Guide](../../CONTRIBUTING.md)

## Repository Starting Points

- `src/` — Main application source and feature modules
- `src/modules/` — Location for new and existing features
- `test/` — Automated tests for new features

## Key Files

- `src/app.module.ts` — Application module for feature registration
- `src/modules/users/application/` — User feature logic
- `src/modules/transactions/application/` — Transaction feature logic
- `test/` — Test cases for new features

## Key Symbols for This Agent

- [`AppModule`](../../src/app.module.ts)
- [`CreateUserService`](../../src/modules/users/application/create_user.service.ts)
- [`CreateTransactionService`](../../src/modules/transactions/application/create_transaction.service.ts)
- [`AppService`](../../src/app.service.ts)
- [`ConfigurationService`](../../src/core/services/configuration.service.ts)

## Documentation Touchpoints

- [Project Overview](../docs/project-overview.md)
- [Development Workflow](../docs/development-workflow.md)
- [Testing Strategy](../docs/testing-strategy.md)
- [AGENTS.md](../../AGENTS.md)

## Collaboration Checklist

1. Confirm feature requirements and design
2. Implement and test new functionality
3. Update documentation and usage guides
4. Review and address feedback from code reviewers
5. Capture learnings and improvements in AGENTS.md or docs
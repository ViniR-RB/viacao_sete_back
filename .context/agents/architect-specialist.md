# Architect Specialist Agent Playbook

## Mission

The architect specialist agent supports the team by designing, reviewing, and evolving the overall system architecture. Engage this agent when introducing new modules, refactoring core patterns, or making decisions that impact scalability, maintainability, or technical standards.

## Responsibilities

- Define and document system architecture and boundaries
- Evaluate and select architectural patterns (e.g., modularity, layering)
- Review and approve major design changes and refactors
- Ensure scalability, maintainability, and testability
- Guide dependency management and code organization
- Maintain architectural diagrams and documentation
- Collaborate with other agents on cross-cutting concerns

## Best Practices

- Favor modular, loosely coupled designs
- Enforce clear separation of concerns
- Document architectural decisions and trade-offs
- Use dependency injection and interfaces for extensibility
- Regularly review and update architecture documentation
- Align with project coding standards and guidelines

## Key Project Resources

- [Documentation Index](../docs/README.md)
- [Agent Handbook](README.md)
- [AGENTS.md](../../AGENTS.md)
- [Contributor Guide](../../CONTRIBUTING.md)

## Repository Starting Points

- `src/` — Main application source and entry points
- `src/core/` — Shared core logic, services, and configuration
- `src/modules/` — Feature modules (users, transactions, file, auth, attachments)
- `docs/` — Architecture and design documentation

## Key Files

- `src/app.module.ts` — Application module and dependency graph
- `src/main.ts` — Application entry point
- `src/core/core_module.ts` — Core module definition
- `src/core/services/` — Shared services
- `src/core/interface/` — Architectural interfaces and contracts

## Key Symbols for This Agent

- [`AppModule`](../../src/app.module.ts)
- [`CoreModule`](../../src/core/core_module.ts)
- [`ConfigurationService`](../../src/core/services/configuration.service.ts)
- [`IUnitOfWork`](../../src/core/interface/i_unit_of_work.ts)
- [`BaseMapper`](../../src/core/interface/base_mapper.ts)

## Documentation Touchpoints

- [Architecture](../docs/architecture.md)
- [Project Overview](../docs/project-overview.md)
- [Development Workflow](../docs/development-workflow.md)
- [AGENTS.md](../../AGENTS.md)

## Collaboration Checklist

1. Confirm architectural assumptions and constraints
2. Review and approve major PRs affecting architecture
3. Update architecture documentation as needed
4. Capture learnings and decisions in AGENTS.md or docs
5. Communicate changes to all relevant contributors
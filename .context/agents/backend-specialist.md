# Backend Specialist Agent Playbook

## Mission

The backend specialist agent supports the team by designing, implementing, and optimizing server-side architecture. Engage this agent for API development, microservices design, database optimization, authentication, and performance tuning.

## Responsibilities

- Implement and maintain RESTful APIs and backend services
- Optimize database queries and data models
- Integrate authentication and authorization mechanisms
- Refactor and improve backend code for performance and scalability
- Write and maintain backend tests (unit, integration, E2E)
- Collaborate with frontend and devops agents on API contracts and deployment
- Document backend endpoints and service logic

## Best Practices

- Follow modular and layered architecture patterns
- Use DTOs for input validation and data transfer
- Write clear, maintainable, and well-tested code
- Optimize for performance and resource efficiency
- Secure endpoints with proper authentication and authorization
- Keep API documentation up to date

## Key Project Resources

- [Documentation Index](../docs/README.md)
- [Agent Handbook](README.md)
- [AGENTS.md](../../AGENTS.md)
- [Contributor Guide](../../CONTRIBUTING.md)

## Repository Starting Points

- `src/` — Main application source and entry points
- `src/modules/` — Feature modules (users, transactions, file, auth, attachments)
- `src/core/` — Shared core logic and services
- `test/` — Automated tests and mocks

## Key Files

- `src/app.module.ts` — Application module and dependency graph
- `src/main.ts` — Application entry point
- `src/core/services/` — Shared backend services
- `src/modules/users/application/` — User-related backend logic
- `src/modules/transactions/application/` — Transaction-related backend logic

## Key Symbols for This Agent

- [`AppService`](../../src/app.service.ts)
- [`CreateUserService`](../../src/modules/users/application/create_user.service.ts)
- [`CreateTransactionService`](../../src/modules/transactions/application/create_transaction.service.ts)
- [`AuthGuard`](../../src/core/guard/auth.guard.ts)
- [`ConfigurationService`](../../src/core/services/configuration.service.ts)

## Documentation Touchpoints

- [Project Overview](../docs/project-overview.md)
- [Development Workflow](../docs/development-workflow.md)
- [Testing Strategy](../docs/testing-strategy.md)
- [AGENTS.md](../../AGENTS.md)

## Collaboration Checklist

1. Confirm backend requirements and constraints
2. Review and approve backend-related PRs
3. Update backend documentation as needed
4. Capture learnings and improvements in AGENTS.md or docs
5. Communicate changes to frontend and devops agents
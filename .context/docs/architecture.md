# Architecture Notes

This document describes the system architecture, layers, patterns, and design decisions for the backend codebase.

## System Architecture Overview

The system is structured as a modular monolith using the NestJS framework. It organizes features into modules, each encapsulating controllers, services, domain logic, and infrastructure. Requests enter through controllers, which delegate to services and domain layers. The application is designed for maintainability, testability, and clear separation of concerns.

## Architectural Layers

- **Controllers**: Handle HTTP requests and responses.  
  Key directories: `src/modules/*/controller`
- **Services**: Contain business logic and orchestrate domain operations.  
  Key directories: `src/core/services`, `src/modules/*/application`
- **Domain Entities & Use Cases**: Represent core business models and rules.  
  Key directories: `src/modules/*/domain/entities`, `src/modules/*/domain/usecase`
- **Repositories & Adapters**: Abstract data access and persistence.  
  Key directories: `src/modules/*/adapters`, `src/modules/*/infra/repositories`
- **DTOs & Value Objects**: Define data transfer and validation structures.  
  Key directories: `src/modules/*/dtos`, `src/core/value-objects`
- **Configuration & Constants**: Centralize environment and error messages.  
  Key directories: `src/core/config`, `src/core/constants`
- **Exceptions & Guards**: Handle errors and enforce security.  
  Key directories: `src/core/exceptions`, `src/core/guard`

> See [`codebase-map.json`](./codebase-map.json) for complete symbol counts and dependency graphs.

## Detected Design Patterns

| Pattern         | Confidence | Locations                                                                 | Description                                 |
|-----------------|------------|---------------------------------------------------------------------------|---------------------------------------------|
| Dependency Injection | High       | NestJS modules, services, controllers                                    | Decouples components and enables testing     |
| Repository      | High       | `src/modules/*/adapters`, `src/modules/*/infra/repositories`              | Abstracts data access and persistence        |
| DTO             | High       | `src/modules/*/dtos`                                                      | Structures data transfer and validation      |
| Service Layer   | High       | `src/core/services`, `src/modules/*/application`                          | Encapsulates business logic                  |
| Guard           | Medium     | `src/core/guard/auth.guard.ts`                                            | Enforces authentication/authorization        |
| Value Object    | Medium     | `src/core/value-objects/amount.ts`                                        | Immutable domain values                      |

## Entry Points

- [src/main.ts](../../src/main.ts)
- [src/app.module.ts](../../src/app.module.ts)
- [src/app.controller.ts](../../src/app.controller.ts)

## Public API

| Symbol                        | Type      | Location                                                        |
|-------------------------------|-----------|-----------------------------------------------------------------|
| Amount                        | Class     | src/core/value-objects/amount.ts                                |
| AppController                 | Class     | src/app.controller.ts                                           |
| AppException                  | Class     | src/core/exceptions/app_exception.ts                            |
| AppModule                     | Class     | src/app.module.ts                                               |
| AppService                    | Class     | src/app.service.ts                                              |
| AttachmentsController         | Class     | src/modules/attachments/controller/attachment.controller.ts     |
| AuthController                | Class     | src/modules/auth/controller/auth.controller.ts                  |
| AuthGuard                     | Class     | src/core/guard/auth.guard.ts                                    |
| AuthModule                    | Class     | src/modules/auth/auth.module.ts                                 |
| ConfigurationService          | Class     | src/core/services/configuration.service.ts                      |
| CreateUserService             | Class     | src/modules/users/application/create_user.service.ts            |
| CreateTransactionService      | Class     | src/modules/transactions/application/create_transaction.service.ts |
| ...                           | ...       | ...                                                             |

> See codebase-map.json for the full exported symbol list.

## Internal System Boundaries

The codebase separates concerns by modules (users, transactions, file, auth, attachments). Each module owns its domain logic and data access, minimizing cross-module dependencies. Shared contracts are enforced via interfaces and DTOs.

## External Service Dependencies

- Database (configured via environment variables)
- JWT authentication (external token verification)
- File storage (abstracted via adapters)
- Potential SaaS integrations (future)

## Key Decisions & Trade-offs

- Chose NestJS for modularity and strong typing.
- Emphasized DTOs and value objects for validation and immutability.
- Used repository pattern to enable persistence abstraction and testing.

## Diagrams

<!-- Add mermaid diagrams or architectural images here if available -->

## Risks & Constraints

- Scaling may require splitting modules into microservices.
- External dependencies (e.g., DB, file storage) must be highly available.
- Security relies on correct guard and exception handling.

## Top Directories Snapshot

- `src/` — main application code
- `src/core/` — shared core logic and services
- `src/modules/` — feature modules (users, transactions, file, auth, attachments)
- `test/` — test suites and mocks
- `docs/` — documentation

## Related Resources

- [Project Overview](./project-overview.md)
- [Data Flow](./data-flow.md)
- [Development Workflow](./development-workflow.md)
- [Testing Strategy](./testing-strategy.md)
- [Security](./security.md)
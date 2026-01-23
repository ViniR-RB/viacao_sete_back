# Project Overview

This project provides a modular backend system for managing users, transactions, files, authentication, and attachments. It is designed to support robust business workflows, secure data handling, and extensibility for future integrations. The main beneficiaries are developers, administrators, and end users who require reliable transaction and file management.

## Codebase Reference

> **Detailed Analysis**: For complete symbol counts, architecture layers, and dependency graphs, see [`codebase-map.json`](./codebase-map.json).

## Quick Facts

- Root: `/home/vini/Desktop/viacao_sete/back`
- Languages: TypeScript (majority), JavaScript (build output), Markdown (docs)
- Entry: `src/main.ts`, `src/app.module.ts`
- Full analysis: [`codebase-map.json`](./codebase-map.json)

## Entry Points

- [src/main.ts](../../src/main.ts)
- [src/app.module.ts](../../src/app.module.ts)
- [src/app.controller.ts](../../src/app.controller.ts)

## Key Exports

- See [`codebase-map.json`](./codebase-map.json) for the complete list of exported symbols and modules.

## File Structure & Code Organization

- `src/` — Main application source code (modules, controllers, services, domain logic)
- `src/core/` — Shared core logic, services, configuration, and utilities
- `src/modules/` — Feature modules (users, transactions, file, auth, attachments)
- `test/` — Automated tests, mocks, and test setup
- `docs/` — Project documentation and guides

## Technology Stack Summary

The backend is built with TypeScript using the NestJS framework. It leverages modular architecture, DTO validation, and repository patterns. Build tooling includes npm scripts, Prettier for formatting, and ESLint for linting. The system is designed for maintainability, testability, and scalability.

## Core Framework Stack

- **Backend**: NestJS (TypeScript)
- **Database**: Abstracted via repositories (ORM or direct queries)
- **Authentication**: JWT-based, with guards and DTO validation

## Development Tools Overview

- **CLIs**: npm, Node.js
- **Linting**: ESLint
- **Formatting**: Prettier
- **Testing**: Jest
- See [Tooling](./tooling.md) for more details.

## Getting Started Checklist

1. Install dependencies with `npm install`.
2. Run the development server with `npm run dev`.
3. Build for production with `npm run build`.
4. Run tests with `npm run test`.
5. Review [Development Workflow](./development-workflow.md) for day-to-day tasks.

## Related Resources

- [Architecture](./architecture.md)
- [Development Workflow](./development-workflow.md)
- [Tooling](./tooling.md)
- [codebase-map.json](./codebase-map.json)
# Development Workflow

This document outlines the day-to-day engineering process, branching strategy, and contribution guidelines for this repository.

## Branching & Releases

- **Branching Model**: Trunk-based development. All feature, bugfix, and chore branches are created from `main`.
- **Feature Branches**: Use descriptive names, e.g., `feat/user-auth`, `fix/transaction-bug`.
- **Pull Requests**: Open PRs against `main` with clear titles and linked issues.
- **Release Cadence**: Releases are cut from `main` as needed. Use semantic versioning (e.g., `v1.2.0`).
- **Tagging**: Tags follow the format `vX.Y.Z`.

## Local Development

- Install dependencies:  
  ```sh
  npm install
  ```
- Run the development server:  
  ```sh
  npm run dev
  ```
- Build for production:  
  ```sh
  npm run build
  ```
- Run tests:  
  ```sh
  npm run test
  ```
- Lint and format:  
  ```sh
  npm run lint
  ```

## Code Review Expectations

- All code changes must be submitted via pull request.
- Reviews require at least one approval from a core contributor.
- Follow the Conventional Commits standard for commit messages.
- Ensure all tests pass and code is linted before requesting review.
- Reference [AGENTS.md](../../AGENTS.md) for agent collaboration, review checklists, and best practices.

## Onboarding Tasks

- New contributors should review [Project Overview](./project-overview.md) and [Architecture](./architecture.md).
- Start with issues labeled `good first issue` or `help wanted`.
- See [Testing Strategy](./testing-strategy.md) and [Tooling](./tooling.md) for environment setup and test coverage expectations.

## Related Resources

- [Testing Strategy](./testing-strategy.md)
- [Tooling](./tooling.md)
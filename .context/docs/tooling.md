# Tooling & Productivity Guide

This guide collects scripts, automation, and editor settings that keep contributors efficient and productive.

## Required Tooling

- **Node.js**: v18+ (runtime for backend and tooling)
- **npm**: v8+ (package manager)
- **Git**: Version control
- **Docker**: For containerized development and testing (optional)
- **Visual Studio Code**: Recommended IDE

Install Node.js and npm from [nodejs.org](https://nodejs.org/).  
Install Docker from [docker.com](https://www.docker.com/).

## Recommended Automation

- **Pre-commit hooks**: Use [lint-staged](https://github.com/okonet/lint-staged) and [husky](https://github.com/typicode/husky) for linting and formatting on commit.
- **Linting**:  
  ```sh
  npm run lint
  ```
- **Formatting**:  
  ```sh
  npm run format
  ```
- **Code generation/scaffolding**:  
  Use project scripts or generators as documented in [Development Workflow](./development-workflow.md).
- **Watch mode**:  
  ```sh
  npm run test -- --watch
  ```

## IDE / Editor Setup

- **VS Code Extensions**:
  - ESLint
  - Prettier
  - Jest
  - Docker
  - EditorConfig
- **Recommended Settings**:
  - Enable format on save
  - Set tab width to 2 spaces
  - Auto-detect line endings

## Productivity Tips

- Use terminal aliases for common scripts (e.g., `alias t="npm run test"`).
- Leverage Docker Compose for local development environments.
- Use `.env.example` as a template for environment variables.
- Review and update `package.json` scripts for automation shortcuts.

## Related Resources

- [Development Workflow](./development-workflow.md)
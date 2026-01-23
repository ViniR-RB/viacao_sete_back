# Testing Strategy

This document describes the testing frameworks, patterns, coverage requirements, and quality gates for the backend codebase.

## Testing Strategy

Quality is maintained through automated testing at multiple levels, strict code review, and continuous integration. All new features and bug fixes require corresponding tests. The project emphasizes fast feedback, high coverage, and reproducible results.

## Test Types

- **Unit Tests**:  
  - Framework: Jest  
  - File naming: `*.spec.ts`  
  - Location: `src/` and `test/` directories  
- **Integration Tests**:  
  - Framework: Jest  
  - File naming: `*.spec.ts`  
  - Location: `test/` directories  
  - Scenarios: Service-to-service, repository, and controller integration  
- **End-to-End (E2E) Tests**:  
  - Framework: Jest  
  - Config: `test/jest-e2e.json`  
  - Location: `test/`  
  - Simulate real user flows and API interactions

## Running Tests

- All tests:  
  ```sh
  npm run test
  ```
- Watch mode:  
  ```sh
  npm run test -- --watch
  ```
- Coverage report:  
  ```sh
  npm run test -- --coverage
  ```

## Quality Gates

- **Coverage**: Minimum 80% line and branch coverage required for merging.
- **Linting**: All code must pass ESLint checks (`npm run lint`).
- **Formatting**: Code must be formatted with Prettier (`npm run format`).
- **CI**: All tests and checks must pass in CI before merge.

## Troubleshooting

- Flaky or long-running tests should be marked and investigated.
- Environment-specific issues may require updating test setup scripts.
- Use `--detectOpenHandles` with Jest for debugging hanging tests.

## Related Resources

- [Development Workflow](./development-workflow.md)
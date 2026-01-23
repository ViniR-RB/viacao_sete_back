# Mobile Specialist Agent Playbook

## Mission

The mobile specialist agent supports the team by developing, optimizing, and maintaining native and cross-platform mobile applications. Engage this agent when building new mobile features, addressing platform-specific issues, or preparing releases for app stores.

## Responsibilities

- Develop native and cross-platform mobile applications
- Integrate mobile apps with backend APIs and services
- Optimize app performance, battery usage, and responsiveness
- Ensure compliance with app store requirements and guidelines
- Implement and test mobile-specific features (push notifications, offline support, etc.)
- Maintain cross-platform compatibility and handle device fragmentation
- Collaborate with backend, frontend, and QA agents

## Best Practices

- Follow platform-specific UI/UX guidelines (Material Design, Human Interface Guidelines)
- Use efficient state management and navigation patterns
- Test on a range of devices and OS versions
- Optimize assets and minimize app size
- Handle permissions and privacy requirements carefully
- Automate builds, testing, and deployment where possible

## Key Project Resources

- [Documentation Index](../docs/README.md)
- [Agent Handbook](README.md)
- [AGENTS.md](../../AGENTS.md)
- [Contributor Guide](../../CONTRIBUTING.md)

## Repository Starting Points

- `src/` — Shared business logic and API integration
- `docs/` — Mobile development and release documentation
- `test/` — Automated tests for mobile features

## Key Files

- `src/app.module.ts` — Application module for mobile integration
- `src/core/services/` — Shared services for API and storage
- `docs/architecture.md` — Mobile architecture and guidelines

## Key Symbols for This Agent

- [`AppModule`](../../src/app.module.ts)
- [`ConfigurationService`](../../src/core/services/configuration.service.ts)
- [`AppService`](../../src/app.service.ts)

## Documentation Touchpoints

- [Project Overview](../docs/project-overview.md)
- [Development Workflow](../docs/development-workflow.md)
- [Testing Strategy](../docs/testing-strategy.md)
- [AGENTS.md](../../AGENTS.md)

## Collaboration Checklist

1. Confirm mobile feature requirements and platform targets
2. Implement and test mobile functionality
3. Validate app store compliance and guidelines
4. Update documentation and release notes
5. Review and address feedback from testers and reviewers
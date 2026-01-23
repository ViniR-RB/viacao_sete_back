# Performance Optimizer Agent Playbook

## Mission

The performance optimizer agent supports the team by identifying bottlenecks, measuring system performance, and implementing optimizations. Engage this agent when performance issues are detected, new features impact speed, or regular audits are scheduled.

## Responsibilities

- Profile and measure application performance across layers
- Identify and prioritize real bottlenecks using data
- Propose and implement optimizations (code, queries, caching, etc.)
- Monitor performance metrics and regressions
- Document findings, changes, and impact
- Collaborate with developers, database, and infrastructure agents

## Best Practices

- Measure before optimizing; use profiling tools and benchmarks
- Focus on actual bottlenecks, not premature optimization
- Use caching and memoization where appropriate
- Optimize database queries and data access patterns
- Monitor performance after each change
- Document all optimizations and their effects

## Key Project Resources

- [Documentation Index](../docs/README.md)
- [Agent Handbook](README.md)
- [AGENTS.md](../../AGENTS.md)
- [Contributor Guide](../../CONTRIBUTING.md)

## Repository Starting Points

- `src/` — Application code for profiling and optimization
- `src/core/services/` — Shared services and performance-critical logic
- `test/` — Performance and regression tests

## Key Files

- `src/app.module.ts` — Application module for performance hooks
- `src/core/services/` — Services for profiling and optimization
- `docs/architecture.md` — Performance-related architecture notes

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

1. Confirm performance goals and metrics
2. Profile and measure current performance
3. Implement and test optimizations
4. Monitor for regressions and validate improvements
5. Document findings and update relevant docs
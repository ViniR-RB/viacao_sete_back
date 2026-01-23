# DevOps Specialist Agent Playbook

## Mission

The DevOps specialist agent supports the team by designing, automating, and maintaining CI/CD pipelines and infrastructure. Engage this agent for deployment automation, infrastructure as code, monitoring, and operational reliability.

## Responsibilities

- Design and implement CI/CD pipelines for automated testing and deployment
- Manage infrastructure as code (IaC) for reproducible environments
- Monitor application health and set up alerting
- Optimize build, test, and deployment workflows
- Ensure security and compliance in deployment processes
- Collaborate with backend, database, and security agents on operational needs
- Document operational procedures and recovery plans

## Best Practices

- Automate repetitive tasks and deployments
- Use version control for all infrastructure and configuration
- Monitor key metrics and set up actionable alerts
- Test infrastructure changes in staging before production
- Keep deployment and rollback procedures well-documented
- Regularly review and update CI/CD and IaC scripts

## Key Project Resources

- [Documentation Index](../docs/README.md)
- [Agent Handbook](README.md)
- [AGENTS.md](../../AGENTS.md)
- [Contributor Guide](../../CONTRIBUTING.md)

## Repository Starting Points

- `docker-compose.yml` — Multi-service orchestration
- `Dockerfile` — Production container build
- `Dockerfile.dev` — Development container build
- `src/` — Application source for deployment
- `docs/` — Operational and deployment documentation

## Key Files

- `docker-compose.yml` — Service orchestration and environment setup
- `Dockerfile` — Container build instructions
- `Dockerfile.dev` — Development container configuration
- `src/main.ts` — Application entry point for deployment

## Key Symbols for This Agent

- [`ConfigurationService`](../../src/core/services/configuration.service.ts)
- [`AppModule`](../../src/app.module.ts)
- [`CoreModule`](../../src/core/core_module.ts)

## Documentation Touchpoints

- [Development Workflow](../docs/development-workflow.md)
- [Tooling](../docs/tooling.md)
- [AGENTS.md](../../AGENTS.md)

## Collaboration Checklist

1. Confirm deployment and operational requirements
2. Review and update CI/CD and IaC scripts
3. Validate monitoring and alerting configurations
4. Document operational changes and recovery steps
5. Communicate with backend, database, and security agents
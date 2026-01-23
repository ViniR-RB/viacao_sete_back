---
slug: deployment
category: operations
generatedAt: 2026-01-23T12:42:02.247Z
relevantFiles:
  - Dockerfile
  - Dockerfile.dev
  - docker-compose.yml
---

# How do I deploy this project?

## Deployment

### Docker

This project includes Docker configuration.

```bash
docker build -t app .
docker run -p 3000:3000 app
```

---
slug: project-structure
category: architecture
generatedAt: 2026-01-23T12:41:54.894Z
relevantFiles:
  - src/app.controller.spec.ts
  - src/app.controller.ts
  - src/app.module.ts
  - src/app.service.ts
  - src/core
  - src/main.ts
  - src/modules
  - src/core/config
  - src/core/constants
  - src/core/core_module.ts
---

# How is the codebase organized?

## Project Structure

```
dist/
docs/
files/
src/
test/
```

### NestJS Structure

- `src/` - Source code
  - `modules/` - Feature modules
  - `common/` - Shared code
  - `main.ts` - Application entry
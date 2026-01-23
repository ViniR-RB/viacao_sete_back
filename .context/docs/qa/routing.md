---
slug: routing
category: architecture
generatedAt: 2026-01-23T12:41:57.400Z
---

# How does routing work?

## Routing

### NestJS Routing

Routes are defined using decorators:

```typescript
@Controller('users')
class UsersController {
  @Get()
  findAll() { }
}
```

### Detected Route Files

- `../../ai-coders-context/dist/src/app.controller.ts`
- `../../ai-coders-context/dist/src/modules/attachments/controller/attachment.controller.ts`
- `../../ai-coders-context/dist/src/modules/auth/controller/auth.controller.ts`
- `../../ai-coders-context/dist/src/modules/attachments/controller/attachment.controller.ts`
- `../../ai-coders-context/dist/src/modules/auth/controller/auth.controller.ts`
# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development
yarn start:dev          # Start with hot-reload (requires .env.development)
yarn start:prod         # Start production build

# Build & lint
yarn build
yarn lint               # ESLint with auto-fix
yarn format             # Prettier

# Tests
yarn test               # All unit tests (uses .env.test)
yarn test:watch
yarn test:e2e           # E2E tests
yarn test:cov

# Database (Prisma)
yarn prisma:dev:migrate   # Create a new migration (dev)
yarn prisma:dev:deploy    # Apply migrations (dev)
yarn prisma:dev:reset     # Reset DB (dev)
yarn prisma:dev:studio    # Open Prisma Studio (dev)
yarn prisma:test:deploy   # Apply migrations (test)
```

## Environment Setup

The app requires either `.env.development` or `.env.test` (copy from `.env.example`). `NODE_ENV` is set automatically by npm scripts — do not declare it manually in env files. The app will fail at startup if any required variable is missing (Joi validation).

Required variables: `PORT`, `GLOBAL_PREFIX` (e.g. `api/v1`, lowercase only), `DATABASE_URL`, `AUTH0_DOMAIN`, `AUTH0_ISSUER`, `AUTH0_AUDIENCE`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_BUCKET_NAME`.

## Architecture

### Feature Pattern

Business logic lives in `*.feature.ts` files, not in services. Each feature is a single-responsibility injectable class with an `execute()` method. Controllers call features directly — there is no service layer between them.

```
controller → feature(s) → prisma / supabase
```

### Module Structure

```
src/
├── modules/
│   ├── auth/       # Auth0 JWT strategy, SyncUser, GET /auth/me
│   ├── profiles/   # User profiles + Supabase Storage for profile pictures
│   ├── services/   # Service marketplace (CRUD + approval workflow)
│   └── users/      # User lifecycle — NO HTTP endpoints, consumed by other modules
├── common/         # Guards, filters, decorators, pipes, interceptors, utils
├── prisma/         # PrismaService (uses @prisma/adapter-pg + pg pool)
├── seeder/         # Seeds admin/moderator users on startup (OnModuleInit)
└── supabase/       # SupabaseStorageService
```

### Authentication Flow

Every authenticated request runs `Auth0Strategy.validate()`, which:
1. Verifies the RS256 JWT against Auth0's JWKS endpoint
2. Runs `SyncUserFeature` to upsert the local user record (federated identity sync)
3. Checks whether the user has a profile (sets `hasProfile` on the request context)

Use `@UseAuth(...roles)` on controllers to apply both `JwtAuthGuard` and `RoleGuard` in one decorator. Pass no roles to require authentication only. Access the authenticated user via `@CurrentUser()`.

### Error Handling

Domain errors extend `DomainException` with a `DomainErrorCode` enum value. The `DomainExceptionFilter` maps these to HTTP responses. Prisma errors are caught by `PrismaExceptionFilter`. Never throw raw `HttpException` from features — throw a typed domain exception instead.

### Pagination

All list endpoints use `resolvePagination()` from `src/common/utils/pagination.util.ts`. Default: `page=1`, `limit=10`, max `limit=100`.

### Swagger

Docs available at `{GLOBAL_PREFIX}/api/docs`. All controllers and DTOs must use `@nestjs/swagger` decorators. For paginated responses, create a concrete DTO (e.g. `ServicePaginatedResponseDto`) — do not use generics, as Swagger cannot infer them.

### Prisma Connection

Uses `@prisma/adapter-pg` with a native `pg` pool instead of Prisma's default binary engine. The `PrismaService` manages the connection lifecycle.

### File Naming Conventions

| Artifact | Suffix |
|---|---|
| Feature | `*.feature.ts` |
| Request body DTO | `*.request.dto.ts` |
| Query params DTO | `*.query.dto.ts` |
| Response DTO | `*.response.dto.ts` |
| Domain exception | `*.exception.ts` |

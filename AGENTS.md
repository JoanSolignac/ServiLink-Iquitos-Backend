# Agent Guidelines for Servilink Iquitos Backend

## Project Stack
- **Framework**: NestJS v11
- **Language**: TypeScript 5.7+
- **ORM**: Prisma 7.8+ (with `@prisma/adapter-pg` driver adapter)
- **Database**: PostgreSQL
- **Auth**: Auth0 JWT Bearer Token via `passport-jwt` (RS256)
- **File Storage**: Supabase Storage (direct integration)
- **API Docs**: Swagger / OpenAPI via `@nestjs/swagger`

## Build & Run
```bash
npm install
npm run build
npm run start:dev
```

## Project Structure
```
src/
├── modules/{auth,profiles,services,users}/
│   ├── *.controller.ts      # HTTP entry points
│   ├── *.module.ts          # NestJS module declaration
│   ├── features/            # Business logic classes (*.feature.ts)
│   ├── dtos/
│   │   ├── request/         # Body & query DTOs
│   │   └── response/        # Response DTOs
│   ├── exceptions/          # Domain-specific exceptions
│   └── utils/               # Module-level utilities
├── common/                  # Guards, filters, decorators, pipes, utils
├── prisma/                  # Prisma service & module
├── seeder/                  # Seed service (OnModuleInit)
└── supabase/                # Supabase client & storage service
```

## Naming Conventions
| Concept | Pattern |
|---------|---------|
| Module | `*.module.ts` |
| Controller | `*.controller.ts` |
| Feature (business logic) | `*.feature.ts` |
| Service | `*.service.ts` |
| Request DTO | `*.request.dto.ts` |
| Query DTO | `*.query.dto.ts` |
| Response DTO | `*.response.dto.ts` |
| Exception | `*.exception.ts` |
| Guard | `*.guard.ts` |
| Decorator | `*.decorator.ts` |
| Pipe | `*.pipe.ts` |
| Config / Schema | `*.config.ts`, `validation.schema.ts` |
| Utility | `*.util.ts` |

## Key Patterns
- **Features**: Injectable classes that encapsulate a single use case. They inject `PrismaService` directly and contain the business rules.
- **Controllers**: Only orchestrate Features and DTOs. No business logic in controllers.
- **Exceptions**: Custom exceptions extending a base `DomainException` mapped to HTTP codes via `DomainExceptionFilter`.
- **Pagination**: Uses `resolvePagination(page, limit)` from `src/common/utils/pagination.util.ts`. Defaults: `page: 1`, `limit: 10`, max `limit: 100`.
- **Auth**: `JwtAuthGuard` validates the Bearer token against Auth0 JWKS. `RoleGuard` checks `UserRole` from `req.user`. `@UseAuth(...roles)` is a composite decorator applying both guards.
- **Federated Sync**: Every JWT validation triggers `SyncUserFeature` to upsert the user in the local DB.

## Swagger / OpenAPI Conventions
- Swagger UI is served at `{GLOBAL_PREFIX}/api/docs`.
- Use `@ApiTags`, `@ApiBearerAuth('bearer')`, `@ApiOperation`, `@ApiResponse`, `@ApiParam`, `@ApiBody`, `@ApiProperty`, `@ApiPropertyOptional`.
- For paginated responses, create a concrete DTO per entity (e.g., `ServicePaginatedResponseDto`) with `@ApiProperty({ type: [EntityResponseDto] })`.

## Testing
```bash
npm run test
npm run test:e2e
```

## Environment Variables
See `src/common/config/validation.schema.ts` for required env vars.

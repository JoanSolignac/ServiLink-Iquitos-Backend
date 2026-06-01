<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

# Servilink Iquitos Backend

Repositorio del backend desarrollado para la gestión operativa de Servilink Iquitos.

## Stack Tecnológico

El proyecto ha sido desarrollado sobre las siguientes tecnologías y herramientas:

- **Node.js:** 22 LTS
- **Framework:** NestJS 11
- **Lenguaje:** TypeScript 5.7
- **Validación de Datos:** class-validator, class-transformer, Joi
- **Gestión de Configuración:** @nestjs/config
- **ORM:** Prisma (con driver adapter `@prisma/adapter-pg` y pool nativo `pg`)
- **Autenticación y Seguridad:** Passport.js (`@nestjs/passport`), JWT (`passport-jwt`), `jwks-rsa`
- **Almacenamiento de Archivos:** Supabase Storage (`@supabase/supabase-js`)
- **Hashing:** Argon2 (`argon2`)
- **Linting y Formato:** ESLint 9, Prettier 3
- **Testing:** Jest 30
- **Gestor de Paquetes:** Yarn
- **Base de datos:** PostgreSQL
- **Contenedores:** Docker Engine & Docker Compose (opcional)

## Requisitos Previos

Para la ejecución local del proyecto, el entorno de desarrollo deberá contar con lo siguiente:

- **Node.js:** versión 22 LTS.
- **Yarn:** compatible con la versión de Node.js instalada.
- **PostgreSQL:** puedes usar Docker Compose (incluido en el proyecto) o una instalación local/externa de PostgreSQL.
- **Docker Engine:** requerido solo si deseas levantar la base de datos mediante contenedores.

## Instalación de Dependencias

```bash
yarn install
```

## Configuración de Entornos para Desarrollo

El sistema de configuración del proyecto está diseñado para cargar variables de entorno específicas según el modo de ejecución. Para garantizar el correcto funcionamiento en desarrollo y pruebas, es obligatorio crear los siguientes archivos a partir de la plantilla proporcionada:

1. Copiar el archivo `.env.example`.
2. Renombrar las copias a `.env.development` y `.env.test`.
3. Modificar los valores de las variables (`PORT`, `GLOBAL_PREFIX`, `DATABASE_URL`, etc.) según el entorno objetivo.
4. Verificar que `GLOBAL_PREFIX` cumpla el formato permitido (ej. `api/v1`, no `api/V1`).

**Fundamento técnico:** El módulo `ConfigModule` de NestJS carga automáticamente el archivo `.env` cuyo nombre corresponda al valor de la variable `NODE_ENV`. El script `start:dev` establece `NODE_ENV=development`, por lo que la aplicación buscará el archivo `.env.development`. De forma análoga, el script de pruebas establece `NODE_ENV=test`, requiriendo la presencia de `.env.test`. La ausencia de estos archivos provocará un fallo en el arranque de la aplicación debido a la validación del esquema Joi.

> **Nota sobre `NODE_ENV`:** Es establecida automáticamente por los scripts npm (`start:dev` → `development`, `test` → `test`, `start:prod` → `production`). No requiere declaración manual en el archivo `.env`.

## Ejecución del Proyecto

Los siguientes comandos están disponibles para la operación del sistema:

```bash
# Modo desarrollo (requiere .env.development)
yarn start:dev

# Modo producción
yarn start:prod
```

## Documentación de API (Swagger / OpenAPI)

El proyecto expone documentación interactiva de la API mediante **Swagger UI**.

- Una vez levantado el servidor, la documentación estará disponible en: `{GLOBAL_PREFIX}/api/docs`
  - Ejemplo: `http://localhost:3000/api/v1/api/docs`
- La autenticación en Swagger se configura con un **Bearer Token** de Auth0 (JWT).
- Cada controlador y DTO debe estar anotado con los decoradores de `@nestjs/swagger` para que aparezca correctamente en la documentación.

### Decoradores requeridos

| Ubicación | Decorador | Propósito |
|---|---|---|
| Controlador (clase) | `@ApiTags('Nombre')` | Agrupa endpoints bajo una etiqueta |
| Controlador (clase) | `@ApiBearerAuth('bearer')` | Indica que requiere autenticación Bearer |
| Handler (método) | `@ApiOperation({ summary: '...' })` | Describe brevemente el endpoint |
| Handler (método) | `@ApiResponse({ status: 200, type: Dto })` | Documenta respuesta exitosa |
| Handler (método) | `@ApiParam({ name: 'id' })` | Documenta parámetros de ruta |
| Handler (método) | `@ApiBody({ type: RequestDto })` | Documenta el cuerpo de la petición |
| DTO (campo) | `@ApiProperty({ example: ... })` | Documenta propiedades del esquema |
| DTO (campo) | `@ApiPropertyOptional({ ... })` | Documenta propiedades opcionales |

> **Convención:** Para respuestas paginadas, se debe crear un DTO concreto por entidad (ej. `ServicePaginatedResponseDto`) con `@ApiProperty({ type: [EntityResponseDto] })` para que Swagger infiera correctamente el esquema.

## Docker Compose (opcional)

Si prefieres levantar la base de datos de desarrollo mediante contenedores, ejecuta:

```bash
docker compose up -d
```

| Servicio | Imagen | Puerto expuesto | Descripción |
|---|---|---|---|
| `postgres` | `postgres:17-alpine` | `5432` | Base de datos PostgreSQL para desarrollo local |

> **Alternativa:** También puedes instalar PostgreSQL directamente en tu sistema operativo o usar una instancia remota, siempre que configures los datos de conexión correspondientes.

> **Nota:** Si usas Docker Compose, el valor de `DATABASE_URL` en tu `.env` debe apuntar al host `localhost` (no `postgres` del contenedor), ya que la aplicación se ejecuta fuera del contenedor.

## Comandos de Prisma

Los siguientes comandos están disponibles para la gestión de la base de datos:

```bash
# Crear una migración (entorno de desarrollo)
yarn prisma:dev:migrate

# Desplegar migraciones (entorno de desarrollo)
yarn prisma:dev:deploy

# Resetear la base de datos (entorno de desarrollo)
yarn prisma:dev:reset

# Abrir Prisma Studio (entorno de desarrollo)
yarn prisma:dev:studio

# Crear una migración (entorno de test)
yarn prisma:test:migrate

# Desplegar migraciones (entorno de test)
yarn prisma:test:deploy
```

## Variables de Entorno

El proyecto valida estrictamente las variables de entorno mediante un esquema Joi al momento del arranque.

| Variable | Descripción | Ejemplo | Requerida en `.env` |
|---|---|---|---|
| `NODE_ENV` | Modo de ejecución. Establecida automáticamente por los scripts npm; no declarar manualmente. | `development` | No (implícita) |
| `PORT` | Puerto de escucha del servidor | `3000` | Sí |
| `GLOBAL_PREFIX` | Prefijo base para las rutas de la API. Solo minúsculas, números y guiones. Separadores con `/`. No iniciar ni terminar con `/`. | `api/v1` | Sí |
| `DATABASE_URL` | Cadena de conexión a PostgreSQL con esquema `postgresql://`. | `postgresql://postgres:postgres@localhost:5432/servilink` | Sí |
| `AUTH0_DOMAIN` | Dominio del tenant de Auth0 | `mi-tenant.us.auth0.com` | Sí |
| `AUTH0_ISSUER` | Dirección del emisor de tokens de Auth0. Debe empezar con `https://` y terminar con `/`. | `https://mi-tenant.us.auth0.com/` | Sí |
| `AUTH0_AUDIENCE` | Identificador de la API/Audiencia configurada en Auth0. | `https://api.servilink.com` | Sí |
| `SUPABASE_URL` | URL del proyecto de Supabase (ej. `https://<project-id>.supabase.co`) | `https://abc123.supabase.co` | Sí |
| `SUPABASE_SERVICE_ROLE_KEY` | Service Role Key de Supabase. **Mantener secreta, nunca exponer al frontend.** | `eyJhbGci...` | Sí |
| `SUPABASE_BUCKET_NAME` | Nombre del bucket de Supabase Storage para archivos de perfil | `servilink-bucket` | Sí |

> **Atención:** Valores como `api/V1` (con mayúscula) harán fallar la validación del esquema Joi.

## Arquitectura y Convenciones

El proyecto sigue el paradigma de **Arquitectura Hexagonal**, aplicando principios de **Domain-Driven Design (DDD)** y **Clean Code**. La estructura garantiza que la capa de dominio sea independiente de frameworks, librerías y detalles de infraestructura.

### Capas del proyecto

| Capa | Responsabilidad | Ubicación típica |
|---|---|---|
| **Domain** | Reglas de negocio puras: entidades, value objects, puertos (interfaces/abstractas), excepciones de dominio, domain services. | `*/domain/*` |
| **Application** | Orquestación de casos de uso, servicios de aplicación, coordinación entre dominio e infraestructura. | `*/application/*` |
| **Infrastructure** | Adaptadores concretos: repositorios (implementaciones), ORM/DB, mappers, generadores, configuración externa. | `*/infrastructure/*` |
| **Presentation** | Punto de entrada HTTP: controladores, DTOs (request/response), presenters. Dependen de librerías de framework para validación y serialización. | `*/presentation/*` |

> **Nota sobre DTOs:** Los DTOs residen en `presentation/dto/` porque dependen de librerías de framework para validación y serialización, y pertenecen a la capa de entrada del sistema.

> **Nota sobre `shared/`:** El módulo transversal `shared/` no sigue la estructura de capas `domain/application/infrastructure`. En su lugar, organiza su contenido por tipo: `abstractions/` (puertos), `value-objects/`, `exceptions/`, `enums/`, `config/` y `constants/`. Los adaptadores concretos residen fuera de `shared/` (ej. `uuid/`, `prisma/`).

### Convenciones de nomenclatura

| Concepto | Convención | Ejemplo |
|---|---|---|
| Value Object | `*.value-object.ts` | `order-id.value-object.ts` |
| Entidad | `*.entity.ts` | `order.entity.ts` |
| Puerto / Interfaz abstracta | `*.abstract.ts` | `payment-gateway.abstract.ts` |
| Excepción de dominio | `*.exception.ts` | `insufficient-stock.exception.ts` |
| Enum de errores | `*.enum.ts` | `domain-error-code.enum.ts` |
| Adaptador / Implementación | Descriptivo del motor/librería | `stripe-payment.adapter.ts`, `prisma-user.repository.ts` |
| Mapper | `*.mapper.ts` | `prisma-user.mapper.ts` |
| Módulo NestJS | `*.module.ts` | `uuid.module.ts`, `prisma.module.ts` |
| Servicio NestJS | `*.service.ts` | `prisma.service.ts` |
| Transaction Manager | `*-transaction-manager.ts` | `prisma-transaction-manager.ts` |
| DTO de request (body) | `*.request.dto.ts` | `change-user-role.request.dto.ts` |
| DTO de query params | `*.query.dto.ts` | `list-public-services.query.dto.ts` |
| DTO de response | `*.response.dto.ts` | `user.response.dto.ts` |
| Presenter | `*.presenter.ts` | `user.presenter.ts` |
| Controlador | `*.controller.ts` | `user.controller.ts` |
| Configuración | `*.config.ts` | `database.config.ts` |
| Schema de validación | `validation.schema.ts` o `*.schema.ts` | `env-validation.schema.ts` |
| Constantes globales | `*.constants.ts` | `pagination.constants.ts` |

### Detalles técnicos transversales

- **Prisma Driver Adapter:** La conexión a PostgreSQL utiliza el adapter oficial `@prisma/adapter-pg` junto con un pool nativo de `pg`, en lugar del query engine binario estándar de Prisma.
- **Identificadores:** Todas las entidades del dominio usan **UUID v7** (no v4), generados mediante `UuidV7IdGenerator` a través del puerto `IdGenerator`.
- **Paginación:** Centralizada en el value object `Pagination`, que consume las constantes globales definidas en `PAGINATION_DEFAULTS` (`PAGE: 1`, `LIMIT: 10`, `MAX_LIMIT: 100`). El VO sanea valores inválidos y aplica el límite máximo automáticamente.
- **Transacciones:** El puerto `TransactionManager` (implementado por `PrismaTransactionManager`) permite ejecutar operaciones multi-repositorio de forma atómica. Se utiliza, por ejemplo, en la sincronización de identidades federadas.
- **Logging:** Un interceptor global (`LoggingInterceptor`) registra el body y el código de estado de cada petición/respuesta HTTP.
- **Sincronización de usuarios:** Cada validación de JWT dispara automáticamente `SyncUserUseCase`, que crea o vincula el usuario local en base de datos si aún no existe (federated identity sync).

## Módulos del Proyecto

Cada módulo del sistema representa un bounded context o un conjunto de responsabilidades transversales. Todos siguen la misma estructura de capas descrita en la sección de Arquitectura.

### Módulos transversales

Son aquellos que proporcionan building blocks base reutilizables por cualquier bounded context. No contienen reglas de negocio específicas de un dominio, sino utilidades técnicas y de infraestructura compartida.

| Módulo | Responsabilidad |
|---|---|
| `UuidModule` | Generación de IDs UUID v7. Expone el puerto `IdGenerator`. Módulo global (`@Global()`), importado en `AppModule`. |
| `PrismaModule` | Conexión a PostgreSQL via Prisma ORM y gestión de transacciones. Expone `PrismaService` y el puerto `TransactionManager`. Módulo global (`@Global()`), importado en `AppModule`. |
| `HashModule` | Encriptación y validación de hashes mediante el algoritmo Argon2. Expone el puerto `HashService`. Módulo global (`@Global()`), importado en `AppModule`. |
| `SupabaseModule` | Conexión a Supabase Storage y gestión de archivos. Expone el puerto `FileStorage` (abstracción de almacenamiento) y el cliente `SupabaseClient`. Módulo global (`@Global()`), importado en `AppModule`. |

> **Nota sobre `FileStorage`:** Es una abstracción ubicada en `shared/abstractions/file-storage.abstract.ts` que define los contratos `upload()` y `delete()`. Su implementación concreta (`SupabaseStorageService`) reside en `src/supabase/services/`. Esto permite que los casos de uso del dominio no dependan directamente de Supabase, facilitando futuros cambios de proveedor de almacenamiento.

### Módulos de dominio

Representan bounded contexts específicos del negocio. Cada uno encapsula su propio modelo de dominio, casos de uso y adaptadores de infraestructura.

#### `UsersModule`

Gestión del ciclo de vida de usuarios del sistema: registro, consulta, actualización y gestión de estado/rol.

> **Nota importante:** Este módulo **no expone endpoints HTTP**. Sus casos de uso son consumidos internamente por otros módulos (principalmente `AuthModule` durante la sincronización de identidades federadas).

| Capa | Contenido |
|---|---|
| **Domain** | Entidad `User`, value objects `UserId` / `UserEmail`, enums `UserStatus`, puerto `UserRepository`, 9 excepciones de dominio |
| **Application** | Servicio `UserFinderService`, 8 casos de uso: `FindUserById`, `FindUserByEmail`, `ChangeUserRole`, `UpdateUserEmail`, `ActivateUser`, `DeactivateUser`, `SuspendUser`, `RestoreUser` |
| **Infrastructure** | Repositorio `PrismaUserRepository`, mapper `PrismaUserMapper` |
| **Presentation** | DTOs request: `ChangeUserRole` / `UpdateUserEmail`; DTO response: `UserResponse`; presenter `UserPresenter` |

> **Nota sobre `UserRole`:** El enum `UserRole` fue trasladado a `src/shared/enums/user-role.enum.ts` para posibilitar su consumo transversal tanto por el módulo de usuarios como por los guards y decoradores de autenticación.

#### `AuthModule`

Gestión de la autenticación de usuarios federados mediante Auth0, control de roles y sincronización de identidades.

| Capa | Contenido |
|---|---|
| **Domain** | Entidad `AuthIdentity`, value objects `AuthIdentityId` / `AuthProvider` / `PasswordHash` / `ProviderId` / `RefreshTokenHash`, interfaces `AuthCurrentUser` / `Auth0PayloadInterface`, puerto `AuthIdentityRepository` |
| **Application** | Servicio `AuthIdentityFinderService`, caso de uso `SyncUserUseCase` |
| **Infrastructure** | Repositorio `PrismaAuthIdentityRepository`, mapper `PrismaAuthIdentityMapper`, guards `JwtAuthGuard` / `RoleGuard`, decoradores `CurrentUser` / `Role` / `UseAuth`, estrategia `Auth0Strategy` |
| **Presentation** | DTO response `MeResponseDto`; presenter `MePresenter`; controlador `AuthController` |

> **Nota sobre `MeResponseDto`:** La respuesta de `GET /auth/me` incluye el campo `hasProfile: boolean`, que permite al cliente detectar si el usuario ya completó su perfil o debe ser redirigido al formulario de bienvenida.

> **Nota sobre `PasswordHash` y `RefreshTokenHash`:** Estos value objects existen en la capa de dominio como preparación para futuras extensiones, pero la entidad `AuthIdentity` actual no los utiliza dado que la autenticación es 100 % federada mediante Auth0.

#### `ProfilesModule`

Gestión de perfiles de usuario, incluyendo datos personales, biografía y foto de perfil almacenada en Supabase Storage.

| Capa | Contenido |
|---|---|
| **Domain** | Entidad `Profile`, value objects `ProfileFirstName` / `ProfileLastName` / `ProfileBirthDate` / `ProfilePhone` / `ProfileAddress` / `ProfileBio` / `ProfilePictureUrl`, puerto `ProfileRepository`, 8 excepciones de dominio |
| **Application** | 3 casos de uso: `CreateProfileUseCase`, `UpdateProfileUseCase`, `FindProfileByUserIdUseCase`. Ambos casos de escritura consumen el puerto `FileStorage` (no dependen directamente de Supabase) |
| **Infrastructure** | Repositorio `PrismaProfileRepository`, mapper `PrismaProfileMapper` |
| **Presentation** | Controlador `ProfileController`, DTOs request: `CreateProfileRequestDto` / `UpdateProfileRequestDto`; DTO response: `ProfileResponseDto`; presenter `ProfilePresenter`; pipe `ProfilePictureValidationPipe` |

> **Nota sobre la foto de perfil:** Al actualizar (`PATCH /profiles/me`), si se envía una nueva imagen, el caso de uso sube la nueva foto a Supabase, actualiza la URL en la base de datos y elimina automáticamente la imagen anterior del bucket para evitar archivos huérfanos.

#### `ServicesModule`

Gestión del marketplace de servicios: publicación, aprobación, listado y búsqueda de servicios ofrecidos por los usuarios.

| Capa | Contenido |
|---|---|
| **Domain** | Entidad `Service`, value objects `ServiceId` / `ServiceTitle` / `ServiceDescription` / `ServicePrice`, campo `keywords` (`String[]`), enum `ServiceStatus`, puerto `ServiceRepository`, 5 excepciones de dominio |
| **Application** | Servicio `ServiceFinderService`, 8 casos de uso: `CreateServiceUseCase`, `UpdateServiceUseCase`, `FindServiceByIdUseCase`, `ListPublicServicesUseCase`, `ListMyServicesUseCase`, `ListAdminServicesUseCase`, `ApproveServiceUseCase`, `RejectServiceUseCase` |
| **Infrastructure** | Repositorio `PrismaServiceRepository`, mapper `PrismaServiceMapper` |
| **Presentation** | Controlador `ServiceController`, DTOs request: `CreateServiceRequestDto` / `UpdateServiceRequestDto`; DTOs query: `ListPublicServicesQueryDto` / `ListMyServicesQueryDto` / `ListAdminServicesQueryDto`; DTO response: `ServiceResponseDto`; presenter `ServicePresenter` |

> **Nota sobre los listados de servicios:** El módulo implementa tres estrategias de listado especializadas, cada una con su propio caso de uso y DTO de query:
> - `ListPublicServicesUseCase`: expuesto en `GET /services`. Siempre filtra por `APPROVED` y es agnóstico al `userId`.
> - `ListMyServicesUseCase`: expuesto en `GET /services/me`. Siempre filtra por el usuario autenticado y permite filtrar opcionalmente por `status`.
> - `ListAdminServicesUseCase`: expuesto en `GET /services/admin`. Requiere rol `MODERATOR` o `ADMINISTRATOR`. Permite filtrar libremente por `status` y `userId`.
>
> Esta separación elimina toda lógica condicional de roles y estados de la capa de aplicación, dejando cada caso de uso con una única responsabilidad bien definida.

> **Nota sobre la paginación:** Los tres endpoints de listado consumen el value object `Pagination`, que aplica los límites globales definidos en `PAGINATION_DEFAULTS` y sanea automáticamente valores inválidos.

### Otros componentes

#### `SeederModule`

Inicialización automática de datos base. Se ejecuta al arrancar la aplicación (`OnModuleInit`) y garantiza la existencia de usuarios administrativos mínimos en el sistema.

| Capa | Contenido |
|---|---|
| **Application** | `SeederService`: crea o actualiza (upsert) un usuario `ADMINISTRATOR` y un `MODERATOR` mediante transacción atómica |

> **Nota:** Los emails de los usuarios seed están hardcodeados en el servicio. Si deseas personalizarlos, modifica `src/seeder/seeder.service.ts` antes del primer arranque.

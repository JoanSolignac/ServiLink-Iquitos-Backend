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
- **Notificaciones Push:** Firebase Admin SDK (`firebase-admin`)
- **Notificaciones Email:** Brevo (`@getbrevo/brevo`)
- **Eventos Asíncronos:** NestJS Event Emitter (`@nestjs/event-emitter`)
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
| `BREVO_API_KEY` | API key de Brevo para el envío de emails transaccionales | `xkeysib-...` | Sí |
| `BREVO_SENDER_EMAIL` | Dirección de email remitente para los envíos de Brevo | `no-reply@tudominio.com` | Sí |
| `BREVO_SENDER_NAME` | Nombre visible del remitente en los emails | `ServiLink` | Sí |
| `FIREBASE_PROJECT_ID` | ID del proyecto de Firebase para push notifications | `my-firebase-project` | Sí |
| `FIREBASE_CLIENT_EMAIL` | Email de la cuenta de servicio de Firebase Admin SDK | `firebase-adminsdk-xxxxx@project.iam.gserviceaccount.com` | Sí |
| `FIREBASE_PRIVATE_KEY` | Clave privada de la cuenta de servicio de Firebase. **Mantener secreta, nunca exponer.** | `"-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"` | Sí |

> **Atención:** Valores como `api/V1` (con mayúscula) harán fallar la validación del esquema Joi.

## Estructura del Proyecto

El proyecto está organizado como una aplicación NestJS estándar, agrupada por módulos funcionales. Cada módulo encapsula su propio dominio de negocio y se estructura internamente en controladores, features (lógica de negocio), DTOs y excepciones.

### Organización de carpetas

```
src/
├── modules/
│   ├── auth/             # Autenticación y sincronización de usuarios
│   ├── devices/          # Registro de dispositivos para notificaciones push (FCM)
│   ├── notifications/    # Notificaciones push y email (event-driven, sin endpoints HTTP)
│   ├── profiles/         # Perfiles de usuario y fotos de perfil
│   ├── service-requests/ # Solicitudes de servicio entre clientes y proveedores
│   ├── services/         # Marketplace de servicios
│   └── users/            # Gestión de usuarios y administración de roles
├── common/               # Filtros, guards, decoradores, pipes, utilidades
├── prisma/               # Configuración y servicio de Prisma
├── seeder/               # Inicialización de datos base
└── supabase/             # Cliente y servicio de almacenamiento
```

### Convenciones de nomenclatura

| Concepto | Convención | Ejemplo |
|---|---|---|
| Módulo NestJS | `*.module.ts` | `services.module.ts` |
| Controlador | `*.controller.ts` | `services.controller.ts` |
| Feature (lógica de negocio) | `*.feature.ts` | `create-service.feature.ts` |
| Servicio NestJS | `*.service.ts` | `prisma.service.ts` |
| DTO de request (body) | `*.request.dto.ts` | `create-service.request.dto.ts` |
| DTO de query params | `*.query.dto.ts` | `list-public-services.query.dto.ts` |
| DTO de response | `*.response.dto.ts` | `service.response.dto.ts` |
| Excepción de dominio | `*.exception.ts` | `service-not-found.exception.ts` |
| Enum | `*.enum.ts` | `domain-error-code.enum.ts` |
| Guard | `*.guard.ts` | `jwt-auth.guard.ts` |
| Decorador | `*.decorator.ts` | `current-user.decorator.ts` |
| Pipe | `*.pipe.ts` | `profile-picture-validation.pipe.ts` |
| Configuración | `*.config.ts` | `validation.schema.ts` |
| Utilidad | `*.util.ts` | `pagination.util.ts` |

### Detalles técnicos transversales

- **Prisma Driver Adapter:** La conexión a PostgreSQL utiliza el adapter oficial `@prisma/adapter-pg` junto con un pool nativo de `pg`, en lugar del query engine binario estándar de Prisma.
- **Paginación:** Centralizada en `src/common/utils/pagination.util.ts`. Aplica valores por defecto (`page: 1`, `limit: 10`) y un límite máximo de 100 elementos por página.
- **Logging:** Un interceptor global (`LoggingInterceptor`) registra el body y el código de estado de cada petición/respuesta HTTP.
- **Sincronización de usuarios:** Cada validación de JWT dispara automáticamente `SyncUserFeature`, que crea o vincula el usuario local en base de datos si aún no existe (federated identity sync).
- **Eventos asíncronos:** El módulo `EventEmitterModule` de NestJS desacopla la lógica de negocio de los side-effects. Por ejemplo, cuando una solicitud de servicio cambia de estado, el feature emite un evento que el `NotificationsModule` escucha para enviar notificaciones sin bloquear la respuesta HTTP.

## Módulos del Proyecto

Cada módulo representa un dominio de negocio y agrupa controladores, features, DTOs y excepciones relacionadas.

### `UsersModule`

Gestión del ciclo de vida de usuarios del sistema: consulta, actualización de rol/email, gestión de estado (activar, suspender, restaurar) y administración de roles.

| Componente | Descripción |
|---|---|
| **Controller** | `UsersController` — `GET /users`, `PATCH /users/:id/role` (solo `ADMINISTRATOR`) |
| **Features** | `FindUserById`, `FindUserByEmail`, `ListUsersFeature`, `ChangeUserRole`, `UpdateUserEmail`, `ActivateUser`, `DeactivateUser`, `SuspendUser`, `RestoreUser` |
| **DTOs** | `UserResponseDto`, `UserWithProfileResponseDto`, `UserWithProfilePaginatedResponseDto`, `ListUsersQueryDto`, `ChangeUserRoleRequestDto` |
| **Excepciones** | `UserNotFoundException`, `UserEmailAlreadyExistsException`, `UserAlreadyActiveException`, `UserAlreadyInactiveException`, `UserAlreadySuspendedException`, `UserNotSuspendedException`, `UserSuspendedException`, `UserAlreadyHasRoleException` |

> **Nota sobre `UserRole`:** El enum `UserRole` proviene de Prisma (`@prisma/client`) y se utiliza tanto en el módulo de usuarios como en los guards y decoradores de autenticación.

### `AuthModule`

Gestión de la autenticación de usuarios federados mediante Auth0, control de roles y sincronización de identidades.

| Componente | Descripción |
|---|---|
| **Controller** | `AuthController` — expone `GET /auth/me` |
| **Features** | `SyncUserFeature` — sincroniza identidad federada con base de datos local |
| **Strategies** | `Auth0Strategy` — estrategia Passport JWT con JWKS de Auth0 |
| **Guards** | `JwtAuthGuard`, `RoleGuard` |
| **Decoradores** | `@CurrentUser`, `@UseAuth` |
| **DTOs** | `MeResponseDto` |
| **Excepciones** | `AuthIdentityNotFoundException`, `InvalidProviderException`, `ProviderConflictException` |

> **Nota sobre `MeResponseDto`:** La respuesta de `GET /auth/me` incluye el campo `hasProfile: boolean`, que permite al cliente detectar si el usuario ya completó su perfil o debe ser redirigido al formulario de bienvenida.

### `ProfilesModule`

Gestión de perfiles de usuario, incluyendo datos personales, biografía y foto de perfil almacenada en Supabase Storage.

| Componente | Descripción |
|---|---|
| **Controller** | `ProfilesController` — `POST /profiles`, `GET /profiles/me`, `GET /profiles/:userId`, `PATCH /profiles/me` |
| **Features** | `CreateProfileFeature`, `UpdateProfileFeature`, `FindProfileByUserIdFeature` |
| **DTOs** | `CreateProfileRequestDto`, `UpdateProfileRequestDto`, `ProfileResponseDto` |
| **Excepciones** | `ProfileAlreadyExistsException`, `ProfileNotFoundException` |
| **Pipes** | `ProfilePictureValidationPipe` |

> **Nota sobre la foto de perfil:** Al actualizar (`PATCH /profiles/me`), si se envía una nueva imagen, el feature sube la nueva foto a Supabase Storage, actualiza la URL en la base de datos y elimina automáticamente la imagen anterior del bucket para evitar archivos huérfanos.

### `ServicesModule`

Gestión del marketplace de servicios: publicación, aprobación, listado y búsqueda de servicios ofrecidos por los usuarios.

| Componente | Descripción |
|---|---|
| **Controller** | `ServicesController` — `POST /services`, `PATCH /services/:id`, `GET /services`, `GET /services/me`, `GET /services/admin`, `GET /services/:id`, `PATCH /services/:id/approve`, `PATCH /services/:id/reject` |
| **Features** | `CreateServiceFeature`, `UpdateServiceFeature`, `FindServiceByIdFeature`, `ListPublicServicesFeature`, `ListMyServicesFeature`, `ListAdminServicesFeature`, `ApproveServiceFeature`, `RejectServiceFeature` |
| **DTOs** | `CreateServiceRequestDto`, `UpdateServiceRequestDto`, `ListPublicServicesQueryDto`, `ListMyServicesQueryDto`, `ServiceResponseDto`, `ServicePaginatedResponseDto` |
| **Excepciones** | `ServiceNotFoundException`, `ServiceUnauthorizedException`, `ServiceAlreadyApprovedException` |

> **Nota sobre los listados de servicios:** El módulo implementa tres estrategias de listado especializadas, cada una con su propio feature y DTO de query:
> - `GET /services` (`ListPublicServicesFeature`): siempre filtra por `APPROVED` y es agnóstico al `userId`.
> - `GET /services/me` (`ListMyServicesFeature`): siempre filtra por el usuario autenticado y permite filtrar opcionalmente por `status`.
> - `GET /services/admin` (`ListAdminServicesFeature`): requiere rol `MODERATOR` o `ADMINISTRATOR`. Devuelve servicios en estado `REQUIRE_REVIEW`.
>
> Esta separación mantiene cada feature con una única responsabilidad bien definida.

> **Nota sobre la paginación:** Los tres endpoints de listado aplican paginación mediante `resolvePagination` con valores por defecto (`page: 1`, `limit: 10`) y un límite máximo de 100.

### `ServiceRequestsModule`

Gestión del ciclo de vida de solicitudes de servicio entre clientes y proveedores, desde la creación hasta la confirmación de finalización.

| Componente | Descripción |
|---|---|
| **Controller** | `ServiceRequestsController` — `POST /services/:serviceId/requests`, `GET /service-requests/sent`, `GET /service-requests/received`, `PATCH /service-requests/:id/accept`, `PATCH /service-requests/:id/reject`, `PATCH /service-requests/:id/cancel`, `PATCH /service-requests/:id/finish`, `PATCH /service-requests/:id/confirm` |
| **Features** | `CreateServiceRequestFeature`, `ListSentRequestsFeature`, `ListReceivedRequestsFeature`, `AcceptServiceRequestFeature`, `RejectServiceRequestFeature`, `CancelServiceRequestFeature`, `FinishServiceRequestFeature`, `ConfirmServiceRequestFeature` |
| **DTOs** | `CreateServiceRequestDto`, `ListServiceRequestsQueryDto`, `ServiceRequestResponseDto` |
| **Excepciones** | `ServiceRequestNotFoundException`, `ServiceRequestUnauthorizedException`, `ServiceRequestAlreadyExistsException`, `ServiceRequestInvalidTransitionException` |

> **Nota sobre la máquina de estados:** Las transiciones entre estados siguen el flujo `PENDING → ACCEPTED → FINISHED → CONFIRMED` (o `REJECTED`/`CANCELLED` según el actor). Cada feature valida que la transición sea permitida desde el estado actual y que el actor sea el correcto; de lo contrario lanza `ServiceRequestInvalidTransitionException` o `ServiceRequestUnauthorizedException`.

> **Nota sobre `reject` dual:** El endpoint `PATCH /service-requests/:id/reject` tiene semántica dual según el estado actual: el proveedor rechaza desde `PENDING` y el cliente rechaza desde `FINISHED`. Ambos casos son manejados por `RejectServiceRequestFeature`, que resuelve el actor válido en función del estado.

> **Nota sobre los listados:** `GET /service-requests/sent` lista solicitudes donde el usuario autenticado es el cliente (`customerId`). `GET /service-requests/received` lista solicitudes recibidas en servicios donde el usuario es el proveedor. Ambos soportan filtrado por `status` y paginación estándar.

### `DevicesModule`

Registro y actualización de tokens FCM (Firebase Cloud Messaging) para habilitar notificaciones push en los dispositivos de los usuarios.

| Componente | Descripción |
|---|---|
| **Controller** | `DevicesController` — `POST /devices/sync` |
| **Features** | `SyncDeviceFeature` — registra o actualiza el token FCM del dispositivo del usuario autenticado |
| **DTOs** | `SyncDeviceRequestDto` |

> **Nota sobre el uso:** El cliente móvil debe llamar a `POST /devices/sync` al iniciar la aplicación y cada vez que Firebase renueve el token. El endpoint es idempotente: si el dispositivo ya existe, actualiza el token; si no, lo crea.

### `RatingsModule`

Gestión de calificaciones y reseñas que los clientes realizan sobre los servicios una vez completado el flujo de solicitud.

| Componente | Descripción |
|---|---|
| **Controller** | `RatingsController` — `POST /service-requests/:id/rating`, `POST /services/:id/rating` |
| **Features** | `CreateRatingFeature` — califica por ID de solicitud; `CreateRatingByServiceFeature` — busca la solicitud elegible automáticamente por ID de servicio |
| **DTOs** | `CreateRatingRequestDto`, `RatingResponseDto` |
| **Excepciones** | `RatingAlreadyExistsException`, `RatingNotAllowedException` |

> **Nota sobre elegibilidad:** Solo se puede calificar si la solicitud de servicio está en estado `CONFIRMED` y aún no ha sido calificada (`isRated: false`). Tras crear la calificación, el campo `isRated` de la solicitud y el `averageRating` del servicio se actualizan en la misma transacción.

### `NotificationsModule`

Módulo interno de notificaciones. No expone endpoints HTTP; opera exclusivamente a través de eventos del ciclo de vida de las solicitudes de servicio.

| Componente | Descripción |
|---|---|
| **Servicios** | `EmailSendService` (Brevo), `NotificationPushService` (Firebase Admin) |
| **Handlers** | `ServiceCreatedHandler`, `ServiceApprovedHandler`, `ServiceRejectedHandler`, `ServiceRequestCreatedHandler`, `ServiceRequestAcceptedHandler`, `ServiceRequestRejectedHandler`, `ServiceRequestCancelledHandler`, `ServiceRequestFinishedHandler`, `ServiceRequestConfirmedHandler` |

> **Nota sobre el flujo:** Cuando un feature de `ServiceRequestsModule` cambia el estado de una solicitud, emite un evento tipado (ej. `ServiceRequestAcceptedEvent`). Los handlers de `NotificationsModule` escuchan ese evento y despachan notificaciones push al dispositivo del destinatario y/o email, sin bloquear la respuesta HTTP original.

### Otros componentes

#### `SeederModule`

Inicialización automática de datos base. Se ejecuta al arrancar la aplicación (`OnModuleInit`) y garantiza la existencia de usuarios administrativos mínimos en el sistema.

| Componente | Descripción |
|---|---|
| **Service** | `SeederService`: crea usuarios `ADMINISTRATOR` y `MODERATOR` si no existen |

> **Nota:** Los emails de los usuarios seed están hardcodeados en el servicio. Si deseas personalizarlos, modifica `src/seeder/seeder.service.ts` antes del primer arranque.

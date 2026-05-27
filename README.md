<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

# Servilink Iquitos Backend

Repositorio del backend desarrollado para la gestión operativa de Servilink Iquitos.

## Stack Tecnológico

El proyecto ha sido desarrollado sobre las siguientes tecnologías y herramientas:

- **Node.js:** 22.22 LTS
- **Framework:** NestJS 11
- **Lenguaje:** TypeScript 5.7
- **Validación de Datos:** class-validator, class-transformer, Joi
- **Gestión de Configuración:** @nestjs/config
- **ORM:** Prisma
- **Autenticación y Seguridad:** Passport.js (`@nestjs/passport`), JWT (`passport-jwt`), `jwks-rsa`
- **Almacenamiento de Archivos:** Supabase Storage (`@supabase/supabase-js`)
- **Hashing:** Argon2 (`argon2`)
- **Testing:** Jest 30, Supertest
- **Linting y Formato:** ESLint 9, Prettier 3
- **Gestor de Paquetes:** Yarn
- **Base de datos:** PostgreSQL
- **Contenedores:** Docker Engine & Docker Compose (opcional)

## Requisitos Previos

Para la ejecución local del proyecto, el entorno de desarrollo deberá contar con lo siguiente:

- **Node.js:** versión 22.22 LTS.
- **Yarn:** compatible con la versión de Node.js instalada.
- **PostgreSQL:** puedes usar Docker Compose (incluido en el proyecto) o una instalación local/externa de PostgreSQL.
- **Docker Engine:** requerido solo si deseas levantar los servicios mediante contenedores.

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

# Ejecución de pruebas unitarias y de integración (requiere .env.test)
yarn test

# Modo producción
yarn start:prod
```

## Docker Compose (opcional)

Si prefieres levantar los servicios de desarrollo mediante contenedores, ejecuta:

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

> **Nota sobre `shared/`:** El módulo transversal `shared/` no sigue la estructura de capas `domain/application/infrastructure`. En su lugar, organiza su contenido por tipo: `abstractions/` (puertos), `value-objects/`, `exceptions/`, `enums/` y `config/`. Los adaptadores concretos residen fuera de `shared/` (ej. `uuid/`, `prisma/`).

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
| DTO de request | `*.request.dto.ts` | `change-user-role.request.dto.ts` |
| DTO de response | `*.response.dto.ts` | `user.response.dto.ts` |
| Presenter | `*.presenter.ts` | `user.presenter.ts` |
| Controlador | `*.controller.ts` | `user.controller.ts` |
| Configuración | `*.config.ts` | `database.config.ts` |
| Schema de validación | `validation.schema.ts` o `*.schema.ts` | `env-validation.schema.ts` |

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

| Capa | Contenido |
|---|---|
| **Domain** | Entidad `User`, value objects `UserId` / `UserEmail`, enums `UserStatus`, puerto `UserRepository`, 9 excepciones de dominio |
| **Application** | Servicio `UserFinderService`, 9 casos de uso: `FindAllUsers`, `FindUserById`, `FindUserByEmail`, `ChangeUserRole`, `UpdateUserEmail`, `ActivateUser`, `DeactivateUser`, `SuspendUser`, `RestoreUser` |
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

> **Nota sobre `MeResponseDto`:** La respuesta de `GET /auth/me` ahora incluye el campo `hasProfile: boolean`, que permite al cliente (Flutter) detectar si el usuario ya completó su perfil o debe ser redirigido al formulario de bienvenida.

#### `ProfilesModule`

Gestión de perfiles de usuario, incluyendo datos personales, biografía y foto de perfil almacenada en Supabase Storage.

| Capa | Contenido |
|---|---|
| **Domain** | Entidad `Profile`, value objects `ProfileFirstName` / `ProfileLastName` / `ProfileBirthDate` / `ProfilePhone` / `ProfileAddress` / `ProfileBio` / `ProfilePictureUrl`, puerto `ProfileRepository`, 7 excepciones de dominio |
| **Application** | 3 casos de uso: `CreateProfileUseCase`, `UpdateProfileUseCase`, `FindProfileByUserIdUseCase`. Ambos casos de escritura consumen el puerto `FileStorage` (no dependen directamente de Supabase) |
| **Infrastructure** | Repositorio `PrismaProfileRepository`, mapper `PrismaProfileMapper` |
| **Presentation** | Controlador `ProfileController`, DTOs request: `CreateProfileRequestDto` / `UpdateProfileRequestDto`; DTO response: `ProfileResponseDto`; presenter `ProfilePresenter`; pipe `ProfilePictureValidationPipe` |

> **Nota sobre la foto de perfil:** Al actualizar (`PATCH /profiles/me`), si se envía una nueva imagen, el caso de uso sube la nueva foto a Supabase, actualiza la URL en la base de datos y elimina automáticamente la imagen anterior del bucket para evitar archivos huérfanos.

### Endpoints del módulo de perfiles

| Método | Ruta | Descripción | Auth |
|---|---|---|---|
| `POST` | `/profiles` | Crea el perfil del usuario autenticado. Body: `multipart/form-data` (`firstName`, `lastName`, `birthDate`, `phone`, `address`, `bio`, `profilePicture` opcional). | Sí |
| `GET` | `/profiles/me` | Obtiene el perfil completo del usuario autenticado. | Sí |
| `GET` | `/profiles/:userId` | Obtiene el perfil público de cualquier usuario por su ID. | Sí |
| `PATCH` | `/profiles/me` | Actualiza los datos del perfil propio y reemplaza la foto si se envía una nueva. Body: `multipart/form-data`. | Sí |

> **Restricciones de la foto:** Formatos permitidos `.jpg`, `.jpeg`, `.png`, `.webp`. Tamaño máximo 6 MB.

## Cómo probar los endpoints de perfiles en Postman

A continuación se describe el flujo recomendado para probar el módulo de perfiles desde Postman (o cualquier cliente HTTP que soporte `multipart/form-data`).

### 1. Obtener token de autenticación

Primero debes contar con un token JWT válido de Auth0. Puedes obtenerlo:
- Mediante el flujo de login de tu aplicación Flutter/cliente.
- O directamente desde el dashboard de Auth0 (pestaña *Test* de tu API).

### 2. Verificar si el usuario ya tiene perfil

**GET** `http://localhost:3000/api/v1/auth/me`

- **Headers:** `Authorization: Bearer <TU_JWT_TOKEN>`
- **Respuesta esperada:**
  ```json
  {
    "id": "...",
    "role": "USER",
    "email": "usuario@ejemplo.com",
    "hasProfile": false
  }
  ```
  Si `hasProfile` es `false`, procede a crear el perfil.

### 3. Crear perfil

**POST** `http://localhost:3000/api/v1/profiles`

- **Headers:** `Authorization: Bearer <TU_JWT_TOKEN>`
- **Body:** Selecciona `form-data` (no `raw` ni `x-www-form-urlencoded`).

| Key | Tipo | Valor |
|---|---|---|
| `firstName` | Text | `Juan` |
| `lastName` | Text | `Pérez` |
| `birthDate` | Text | `1995-08-15` |
| `phone` | Text | `+51999999999` |
| `address` | Text | `Calle Los Pinos 123` |
| `bio` | Text | `Desarrollador fullstack` |
| `profilePicture` | File | Selecciona una imagen `.jpg`, `.jpeg`, `.png` o `.webp` (máx 6 MB) |

> **Nota:** Los campos `phone`, `address`, `bio` y `profilePicture` son opcionales en la creación.

### 4. Obtener perfil propio

**GET** `http://localhost:3000/api/v1/profiles/me`

- **Headers:** `Authorization: Bearer <TU_JWT_TOKEN>`

### 5. Actualizar perfil

**PATCH** `http://localhost:3000/api/v1/profiles/me`

- **Headers:** `Authorization: Bearer <TU_JWT_TOKEN>`
- **Body:** `form-data` (igual que en la creación).

Si envías una nueva `profilePicture`, el backend:
1. Sube la nueva imagen a Supabase.
2. Actualiza la URL en la base de datos.
3. Elimina la imagen anterior del bucket automáticamente.

### 6. Obtener perfil de otro usuario

**GET** `http://localhost:3000/api/v1/profiles/<USER_ID>`

- **Headers:** `Authorization: Bearer <TU_JWT_TOKEN>`
- Reemplaza `<USER_ID>` por el UUID v7 del usuario objetivo.

> **Nota:** Cualquier usuario autenticado puede consultar perfiles de otros usuarios, ya que esta información será visible públicamente en el marketplace de servicios.

### Ejemplo en cURL (crear perfil con imagen)

```bash
curl -X POST http://localhost:3000/api/v1/profiles \
  -H "Authorization: Bearer <TU_JWT_TOKEN>" \
  -F "firstName=Juan" \
  -F "lastName=Pérez" \
  -F "birthDate=1995-08-15" \
  -F "phone=+51999999999" \
  -F "address=Calle Los Pinos 123" \
  -F "bio=Desarrollador fullstack" \
  -F "profilePicture=@/ruta/a/tu/foto.jpg"
```

> **Aten**ci**ón:** En `multipart/form-data`, el campo `birthDate` se envía como texto y el `ValidationPipe` global con `enableImplicitConversion: true` lo transforma automáticamente a `Date`. No uses `Content-Type: application/json` para estos endpoints.

> **Atención sobre `profilePicture`:** El nombre exacto del campo debe ser `profilePicture` (coincide con el `FileInterceptor('profilePicture')` del controlador). Usar otro nombre hará que NestJS no reconozca el archivo.
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

# Ejecutar seed (entorno de desarrollo - no disponible por el momento)
yarn db:seed:dev
```

## Variables de Entorno

El proyecto valida estrictamente las variables de entorno mediante un esquema Joi al momento del arranque.

| Variable | Descripción | Ejemplo | Requerida en `.env` |
|---|---|---|---|
| `PORT` | Puerto de escucha del servidor | `3001` | Sí |
| `GLOBAL_PREFIX` | Prefijo base para las rutas de la API. Solo minúsculas, números y guiones. Separadores con `/`. No iniciar ni terminar con `/`. | `api/v1` | Sí |
| `DATABASE_URL` | Cadena de conexión a PostgreSQL con esquema `postgresql://`. | `postgresql://postgres:postgres@localhost:5432/servilink` | Sí |

> **Atención:** Valores como `api/V1` (con mayúscula) harán fallar la validación del esquema Joi.

> **Nota sobre `NODE_ENV`:** Es establecida automáticamente por los scripts npm (`start:dev` → `development`, `test` → `test`, `start:prod` → `production`). No requiere declaración manual en el archivo `.env`.

## Arquitectura y Convenciones

El proyecto sigue el paradigma de **Arquitectura Hexagonal**, aplicando principios de **Domain-Driven Design (DDD)** y **Clean Code**. La estructura garantiza que la capa de dominio sea independiente de frameworks, librerías y detalles de infraestructura.

### Capas del proyecto

| Capa | Responsabilidad | Ubicación típica |
|---|---|---|
| **Domain** | Reglas de negocio puras: entidades, value objects, puertos (interfaces/abstractas), excepciones de dominio, domain services. | `*/domain/*` |
| **Application** | Orquestación de casos de uso, servicios de aplicación, coordinación entre dominio e infraestructura. | `*/application/*` |
| **Infrastructure** | Adaptadores concretos: controladores, repositorios (implementaciones), ORM/DB, DTOs, generadores, configuración externa. | `*/infrastructure/*` |

> **Nota sobre DTOs:** Los DTOs residen en `infrastructure/` porque dependen de librerías de framework para validación y serialización.

> **Nota sobre `shared/`:** El módulo transversal `shared/` no sigue la estructura de capas `domain/application/infrastructure`. En su lugar, organiza su contenido por tipo: `abstractions/` (puertos), `value-objects/`, `exceptions/`, `enums/` y `config/`. Los adaptadores concretos residen fuera de `shared/` (ej. `uuid/`, `prisma/`).

### Convenciones de nomenclatura

| Concepto | Convención | Ejemplo |
|---|---|---|
| Value Object | `*.value-object.ts` | `order-id.value-object.ts` |
| Entidad | `*.entity.ts` | `order.entity.ts` |
| Puerto / Interfaz abstracta | `*.abstract.ts` | `payment-gateway.abstract.ts` |
| Excepción de dominio | `*.exception.ts` | `insufficient-stock.exception.ts` |
| Enum de errores | `*.enum.ts` | `domain-error-code.enum.ts` |
| Adaptador / Implementación | Descriptivo del motor/librería | `stripe-payment.adapter.ts`, `postgres-order.repository.ts` |
| Módulo NestJS | `*.module.ts` | `uuid.module.ts`, `prisma.module.ts` |
| Servicio NestJS | `*.service.ts` | `prisma.service.ts` |
| Transaction Manager | `*-transaction-manager.ts` | `prisma-transaction-manager.ts` |
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

### Módulos de dominio

Representan bounded contexts específicos del negocio. Cada uno encapsula su propio modelo de dominio, casos de uso y adaptadores de infraestructura.

> **Nota:** A medida que se añadan nuevos bounded contexts al sistema, se documentarán en esta sección con su propósito y dependencias principales.

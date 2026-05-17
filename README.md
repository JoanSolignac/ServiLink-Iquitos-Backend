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
- **Testing:** Jest 30, Supertest
- **Linting y Formato:** ESLint 9, Prettier 3
- **Gestor de Paquetes:** Yarn
- **Contenedores:** Docker Engine & Docker Compose

## Requisitos Previos

Para la ejecución local del proyecto, el entorno de desarrollo deberá contar con lo siguiente:

- **Node.js:** versión 22.22 LTS.
- **Yarn:** compatible con la versión de Node.js instalada.
- **Docker Engine:** requerido para la construcción de imágenes y la orquestación de servicios de desarrollo.

## Instalación de Dependencias

```bash
yarn install
```

## Configuración de Entornos para Desarrollo

El sistema de configuración del proyecto está diseñado para cargar variables de entorno específicas según el modo de ejecución. Para garantizar el correcto funcionamiento en desarrollo y pruebas, es obligatorio crear los siguientes archivos a partir de la plantilla proporcionada:

1. Copiar el archivo `.env.example`.
2. Renombrar las copias a `.env.development` y `.env.test`.
3. Modificar los valores de las variables (`PORT`, `GLOBAL_PREFIX`, etc.) en cada archivo de acuerdo con el entorno objetivo.

**Fundamento técnico:** El módulo `ConfigModule` de NestJS carga automáticamente el archivo `.env` cuyo nombre corresponda al valor de la variable `NODE_ENV`. El script `start:dev` establece `NODE_ENV=development`, por lo que la aplicación buscará el archivo `.env.development`. De forma análoga, el script de pruebas establece `NODE_ENV=test`, requiriendo la presencia de `.env.test`. La ausencia de estos archivos provocará un fallo en el arranque de la aplicación debido a la validación del esquema Joi.

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

## Docker Compose

Para levantar los servicios de desarrollo mediante contenedores, ejecutar:

```bash
docker compose up -d
```

Este comando inicializará los servicios definidos en el archivo `docker-compose.yml` en segundo plano.

## Variables de Entorno

El proyecto utiliza el siguiente conjunto de variables de entorno, las cuales son validadas estrictamente mediante un esquema Joi al momento del arranque:

| Variable        | Descripción                           | Ejemplo         | Requerida |
|-----------------|---------------------------------------|-----------------|-----------|
| `NODE_ENV`      | Modo de ejecución de la aplicación    | `development`   | Sí        |
| `PORT`          | Puerto de escucha del servidor        | `3001`          | Sí        |
| `GLOBAL_PREFIX` | Prefijo base para las rutas de la API | `api/v1`        | Sí        |

## Arquitectura

El proyecto se desarrolla bajo el paradigma de **Arquitectura Hexagonal**, aplicando los principios de **Clean Code**. Esta metodología garantiza la separación de responsabilidades entre las capas de dominio, aplicación e infraestructura, asegurando la testabilidad, escalabilidad y mantenibilidad del código a largo plazo.

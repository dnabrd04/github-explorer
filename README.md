# GitHub Explorer

Aplicación web para explorar perfiles de usuario y repositorios públicos de GitHub desde una interfaz rápida, limpia y con soporte de tema claro/oscuro.

> SPA 100% cliente: no hay backend ni base de datos. Toda la información se obtiene de la API pública de GitHub mediante `fetch`.

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router-8-CA4245?logo=reactrouter&logoColor=white)
![react-markdown](https://img.shields.io/badge/react--markdown-10-000000?logo=markdown&logoColor=white)
![pnpm](https://img.shields.io/badge/pnpm-F69220?logo=pnpm&logoColor=white)

## Capturas

<!--
Añade aquí tus capturas reales cuando estén disponibles:

![Perfil de usuario](./docs/screenshots/profile.png)
![Detalle de repositorio](./docs/screenshots/repo-detail.png)
![Tema oscuro](./docs/screenshots/dark-theme.png)
-->

_Pendiente de añadir capturas de la vista de perfil y del detalle de repositorio._

## Descripción

**GitHub Explorer** permite buscar cualquier usuario de GitHub y consultar su información pública sin salir del navegador. Desde el perfil se puede navegar al detalle de cada repositorio, donde se muestran sus métricas, metadatos, estructura de primer nivel y el `README` renderizado como Markdown.

El objetivo del proyecto es ofrecer una experiencia de consulta cómoda y ligera, cuidando el rendimiento (carga diferida de rutas, peticiones cancelables y cache en memoria) y la accesibilidad.

## Funcionalidades

### Búsqueda y perfil
- Buscador de usuarios en la cabecera.
- Perfil con avatar, nombre, `@login`, biografía, seguidores, seguidos y número de repositorios públicos.
- Datos adicionales: empresa, ubicación, sitio web y fecha de alta.

### Repositorios
- Listado paginado de repositorios públicos (10 por página, ordenados por última actualización).
- Paginación basada en el header `Link` de la API de GitHub.
- Tarjetas con lenguaje principal, estrellas, forks y distintivo de fork.

### Detalle del repositorio
- Métricas: estrellas, forks, watchers e issues abiertos.
- Metadatos: lenguaje, rama por defecto, tamaño, licencia, fechas de creación/actualización/último push y estado de archivado.
- Topics del repositorio.
- Estructura de primer nivel del proyecto (solo visualización, sin navegación).
- `README` renderizado con `react-markdown`, resolviendo enlaces e imágenes relativos contra `raw.githubusercontent.com`.
- Enlaces directos a GitHub para el repositorio y, si es un fork, para el repositorio original.

### Experiencia de usuario
- Tema claro/oscuro con persistencia en `localStorage` y detección inicial de `prefers-color-scheme`.
- Script inline en `index.html` para aplicar el tema antes de renderizar y evitar el parpadeo.
- Carga diferida de páginas con `React.lazy` y `Suspense`.
- HTML semántico y etiquetas ARIA en buscador, conmutador de tema y paginación.

## Stack y librerías

| Tecnología | Uso en el proyecto |
| --- | --- |
| [React 19](https://react.dev/) | Construcción de la interfaz con componentes funcionales y hooks. |
| [TypeScript 6](https://www.typescriptlang.org/) | Tipado estático de datos, props y estados. |
| [Vite 8](https://vite.dev/) | Servidor de desarrollo, bundling y build de producción. |
| [React Router 8](https://reactrouter.com/) | Enrutado cliente (`/` y `/repos/:owner/:repo`). Se importa desde `react-router`. |
| [react-markdown 10](https://github.com/remarkjs/react-markdown) | Renderizado del `README` de cada repositorio. |
| [React Compiler](https://react.dev/learn/react-compiler) | Optimización automática de componentes mediante el preset de Babel. |
| [ESLint](https://eslint.org/) | Análisis estático del código. |
| CSS Modules | Estilos encapsulados por componente/página. |
| [pnpm](https://pnpm.io/) | Gestor de paquetes del proyecto. |

### Decisiones técnicas
- **`fetch` nativo**: no se añaden clientes HTTP externos; las peticiones y el manejo de errores se centralizan en `src/lib/github.ts`.
- **Sin gestor de estado global**: el estado vive en hooks locales (`useUser`, `useUserRepos`, `useRepo`, `useTheme`).
- **CSS Modules**: cada componente/página mantiene sus estilos junto al código; las clases compartidas viven en `src/styles/shared.module.css`.
- **React Compiler**: evita memoizaciones manuales (`useMemo`/`useCallback`) y mantiene las reglas de hooks.

## Arquitectura y estructura

```text
src/
├── assets/
│   └── icons/              # Iconos SVG (búsqueda, sol, luna)
├── components/             # Componentes reutilizables + sus CSS Modules
│   ├── Header.tsx
│   ├── UserProfile.tsx
│   ├── UserRepos.tsx
│   ├── RepoCard.tsx
│   ├── RepoTree.tsx
│   └── Footer.tsx
├── hooks/
│   ├── useTheme.ts         # Tema claro/oscuro y persistencia
│   ├── useUser.ts          # Datos del perfil
│   ├── useUserRepos.ts     # Repositorios paginados
│   └── useRepo.ts          # Detalle, árbol y README (con cache)
├── lib/
│   └── github.ts           # Headers, errores y parseo del header Link
├── pages/
│   ├── Home.tsx            # Perfil + listado de repositorios
│   └── RepoDetail.tsx      # Detalle del repositorio
├── styles/
│   └── shared.module.css   # Clases compartidas
├── types/
│   └── types.ts            # Tipos de la API de GitHub
├── App.tsx                 # Rutas y layout
├── main.tsx                # Punto de entrada (BrowserRouter)
└── index.css               # Variables de tema y estilos base
```

### Flujo de datos

1. `App` monta el `Header`, las rutas y el `Footer`.
2. El buscador navega a `/` y pasa el nombre de usuario a `Home`.
3. `Home` usa `useUser` y renderiza `UserProfile` + `UserRepos`.
4. `UserRepos` gestiona la página y consume `useUserRepos`.
5. Cada tarjeta enlaza a `/repos/:owner/:repo`.
6. `RepoDetail` usa `useRepo`, que carga el repositorio y el contenido de la raíz en paralelo y cachea el resultado en memoria.

## API de GitHub

Las llamadas se centralizan en `src/lib/github.ts`, que expone los headers comunes (`Accept` y `X-GitHub-Api-Version`), la traducción de errores HTTP y el parseo del header `Link`.

| Endpoint | Uso |
| --- | --- |
| `GET /users/{username}` | Perfil del usuario. |
| `GET /users/{username}/repos?per_page=10&page=N&sort=updated` | Repositorios paginados. |
| `GET /repos/{owner}/{repo}` | Datos del repositorio. |
| `GET /repos/{owner}/{repo}/contents` | Árbol de primer nivel y localización del README. |
| `download_url` (raw.githubusercontent.com) | Contenido del README sin consumir cuota de la API. |

### Consideraciones
- Sin token, la API permite **60 peticiones/hora**. La app gestiona respuestas `403` (límite alcanzado) y `404` (recurso no encontrado) con mensajes claros.
- El detalle de repositorio realiza **2 llamadas** a la API (`/repos` y `/contents`); el README se descarga desde `raw.githubusercontent.com`.
- Las peticiones usan `AbortController` para cancelarse si el componente se desmonta o cambian las dependencias.
- El detalle de repositorio se cachea en memoria para evitar llamadas repetidas al navegar atrás.
- Para usar un token opcional, define una variable `VITE_*` en un `.env` y añade `.env` al `.gitignore` antes de crearlo.

## Empezar

### Requisitos
- [Node.js](https://nodejs.org/) (versión compatible con Vite 8).
- [pnpm](https://pnpm.io/installation).

### Instalación y desarrollo

```bash
pnpm install
pnpm dev
```

Vite mostrará la URL local (por defecto `http://localhost:5173`).

### Scripts disponibles

| Comando | Descripción |
| --- | --- |
| `pnpm dev` | Inicia el servidor de desarrollo con HMR. |
| `pnpm build` | Ejecuta `tsc -b` (typecheck) y genera el build de producción en `dist/`. |
| `pnpm preview` | Sirve localmente el build de producción. |
| `pnpm lint` | Ejecuta ESLint sobre el proyecto. |

> No hay framework de tests configurado. Para un typecheck aislado puedes usar `pnpm exec tsc -b`.

## Tema y accesibilidad

- El tema se controla con el atributo `data-theme` en `<html>` (`light`/`dark`).
- La preferencia se guarda en `localStorage` bajo la clave `github-explorer-theme`; si no existe, se usa `prefers-color-scheme`.
- El script inline de `index.html` aplica el tema antes del primer render para evitar parpadeos.
- La interfaz usa HTML semántico (`header`, `main`, `nav`, `article`, `dl`) y atributos `aria-*` en controles interactivos.

## Limitaciones y roadmap

- El árbol de archivos muestra solo el primer nivel y no permite navegar entre directorios.
- El `README` se renderiza sin `remark-gfm`, por lo que las tablas de Markdown no se muestran como tales.
- No se incluyen embebidos de commits, ramas ni desglose de lenguajes; se enlazan a GitHub para no consumir cuota adicional.
- No hay autenticación ni token integrado por defecto.
- No hay tests automatizados.

Posibles mejoras: soporte de `remark-gfm`, navegación en el árbol de archivos, tests con Vitest/Testing Library y visualización de commits y ramas.

## Autoría

Creado por [dnabrd04](https://github.com/dnabrd04).

## Licencia

Distribuido bajo la licencia MIT. El texto completo se incluye a continuación:

```text
MIT License

Copyright (c) 2026 dnabrd04

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

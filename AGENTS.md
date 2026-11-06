# AGENTS.md

## Estado actual
- Proyecto en fase inicial: template Vite + React 19 + TypeScript. `src/App.tsx` es un placeholder y el router ya está montado en `src/main.tsx`, pero aún no hay rutas.
- No hay tests ni framework de tests. No inventar comandos de test.

## Comandos
- Gestor de paquetes: **pnpm** (hay `pnpm-lock.yaml`). No usar npm/yarn.
- `pnpm install`
- `pnpm dev`
- `pnpm lint`
- `pnpm build` → ejecuta `tsc -b && vite build` (typecheck + build).
- No existe script `typecheck`; usar `pnpm exec tsc -b`.
- Antes de terminar un cambio: `pnpm lint` y `pnpm build`.

## Stack y peculiaridades
- React 19 + `react-router` 8. Importar desde `react-router`, **no** desde `react-router-dom`.
- React Compiler activado vía Babel en `vite.config.ts`: no añadir `useMemo`/`useCallback` manuales; respetar las reglas de hooks.
- CSS plano con nesting en `src/index.css` / `src/App.css`. No hay Tailwind ni CSS modules.
- TypeScript tiene `verbatimModuleSyntax`: usar `import type` para tipos.
- `erasableSyntaxOnly` está activo: no usar `enum`, `namespace` ni parameter properties; preferir objetos `const`/uniones.
- `noUnusedLocals` y `noUnusedParameters` están activos.
- `strict` **no** está activado en `tsconfig.app.json`; no asumir null-safety.
- Los imports relativos usan extensión explícita (ej. `./App.tsx`).
- No hay alias de rutas configurados; usar rutas relativas.

## Objetivo funcional
- Cabecera con buscador de usuarios.
- Vista de perfil: avatar, username, nombre real, bio, seguidores, seguidos y datos relevantes.
- Listado de repositorios del usuario con paginación.
- Detalle de repositorio: nombre, lenguajes, estrellas, si es fork, ramas, commits, README y árbol de primer nivel (solo visualización, sin navegación).
- Usar `fetch` nativo. No hay axios, react-query ni gestor de estado instalados; no añadir dependencias pesadas sin justificarlo.
- No hay renderer de Markdown instalado: mostrar el README como texto crudo salvo que se apruebe añadir uno.

## API de GitHub
- Centralizar las llamadas para manejar errores, paginación y rate limits.
- Sin token: 60 req/hora; la API de búsqueda tiene un límite aparte de 10 req/min. Manejar 403/404.
- Endpoints previstos:
  - `GET /users/{username}`
  - `GET /users/{username}/repos?per_page=30&page=N` (paginación; también leer `Link`)
  - `GET /search/users?q=...`
  - `GET /repos/{owner}/{repo}`
  - `GET /repos/{owner}/{repo}/languages`
  - `GET /repos/{owner}/{repo}/branches`
  - `GET /repos/{owner}/{repo}/commits`
  - `GET /repos/{owner}/{repo}/readme` (usar `Accept: application/vnd.github.raw` para texto)
  - `GET /repos/{owner}/{repo}/contents/{path}` para el primer nivel

## Gotchas
- `.gitignore` no ignora `.env`. Si se añade un token, usar una variable `VITE_*` y agregar `.env` al `.gitignore` antes de crearlo.
- `build` genera `dist/` (ignorado); no editar artefactos generados.

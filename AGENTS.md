# Repository Guidelines

## Project Structure & Module Organization

This is a Vite + React + TypeScript frontend. Application code lives in `src/`, with `src/main.tsx` mounting the React app and `src/App.tsx` as the current root component. Static files served directly by Vite belong in `public/` (`public/favicon.svg`, `public/icons.svg`). Bundled image assets live under `src/assets/` (`hero.png`, SVG assets). Build and tool configuration is kept at the repository root: `vite.config.ts`, `eslint.config.js`, and the `tsconfig*.json` files.

When adding features, prefer small components under `src/` and colocate feature-specific assets near the component when practical. Keep generated output such as `dist/` out of source control.

## Build, Test, and Development Commands

- `npm install`: install dependencies from `package-lock.json`.
- `npm run dev`: start the Vite development server with React fast refresh.
- `npm run build`: run TypeScript project build checks with `tsc -b`, then produce the production Vite build.
- `npm run lint`: run ESLint over the repository.
- `npm run preview`: serve the production build locally after `npm run build`.

## Coding Style & Naming Conventions

Use TypeScript and React function components. Name components in `PascalCase` (`CustomerTable.tsx`) and hooks in `camelCase` with a `use` prefix (`useCustomers.ts`). Keep local variables and functions in `camelCase`.

The project uses ESLint flat config with `@eslint/js`, `typescript-eslint`, `eslint-plugin-react-hooks`, and Vite React Refresh rules. TypeScript is configured with strict unused checks (`noUnusedLocals`, `noUnusedParameters`) and modern bundler module resolution. Match the existing style: single quotes, semicolons omitted, and concise JSX.

Use `useThemeApp` from `src/hook/useThemeApp.ts` whenever a component needs theme colors. Avoid hard-coded color values in components; add missing tokens to the hook or theme files instead.

Do not use hard-coded domain strings in logic or props. Define shared values with `const`, `enum`, or `type` aliases. When creating a union such as `'success' | 'error'`, also expose an enum or constant map and use it at call sites, for example `Status.Success` instead of `'success'`.

Do not add barrel `index.ts` re-export files for components, pages, or themes. Import from the concrete file that owns the export instead.

## Testing Guidelines

No test runner is configured yet. For now, use `npm run lint` and `npm run build` as the required verification before submitting changes. If tests are added, prefer Vitest with React Testing Library, place tests next to the implementation as `*.test.ts` or `*.test.tsx`, and cover user-visible behavior rather than implementation details.

## Commit & Pull Request Guidelines

This directory has no Git history available, so use a clear conventional style for new commits, for example `feat: add customer list` or `fix: handle empty inventory state`. Keep commits focused and explain why the change exists when it is not obvious.

Pull requests should include a short summary, verification commands run, linked issue or task references when available, and screenshots or recordings for visible UI changes. Note any follow-up work or known limitations explicitly.

## Configuration Notes

The React Compiler is enabled through `@vitejs/plugin-react` and `@rolldown/plugin-babel` in `vite.config.ts`. Preserve this setup unless there is a measured reason to change build behavior.

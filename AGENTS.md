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

Do not import visual components directly from `@mui/material` in pages or domain/feature components. Before adding a MUI import, check whether an equivalent abstraction already exists under `src/components/` and use it. If no abstraction exists, create a reusable shared abstraction under `src/components/` and keep the direct MUI import inside that abstraction. Imports used only for TypeScript types are allowed when an existing abstraction needs to expose compatible props.

Do not use hard-coded domain strings in logic or props. Define shared values with `const`, `enum`, or `type` aliases. When creating a union such as `'success' | 'error'`, also expose an enum or constant map and use it at call sites, for example `Status.Success` instead of `'success'`.

Do not add barrel `index.ts` re-export files for components, pages, or themes. Import from the concrete file that owns the export instead.

Pagination filters must be opened in a modal from a `menuItems` entry on `TableIndex`. Keep temporary filter values inside the modal and only refresh the pagination when the user applies or clears the filters; do not render pagination filters directly in the table header.

## Migration Fidelity and Abstractions

When migrating a legacy feature, preserve every user-visible field, action, validation, conditional rule, default value, calculation, rounding rule, navigation target, and API payload field. Compare the legacy implementation and API contract field by field before adapting the layout. Do not simplify, omit, postpone, or reinterpret behavior merely to deliver a faster first version. Visual adaptation is allowed only after behavioral parity is preserved.

Forms must use the project's form abstractions, including `useFormikAdapter` and `YupAdapter` where validation applies. Do not manage an application form with ad hoc `useState` when the established Formik adapter can represent it.

Pages and feature components must not call the generic `useApi` directly when the request belongs to a domain resource. Create or extend a resource hook such as `useApiFatura`, keeping endpoint construction, methods, loading state, payload typing, and success messages inside that hook.

Do not use generic dropdown components directly from pages when the dropdown represents a known domain concept. Create or reuse a named wrapper such as `ClienteEcommerceDropDown` or `MeioDePagamentoDropDown`, centralizing its endpoint, labels, option mapping, and value typing.

When repeated domain rows have their own fields or behavior, extract a named component such as `FaturaParcelaCard`. Extraction must preserve all fields and behavior from the legacy row; it is not authorization to reduce the feature. Keep these extracted components mobile-first and use existing shared visual abstractions.

## Testing Guidelines

No test runner is configured yet. For now, use `npm run lint` and `npm run build` as the required verification before submitting changes. If tests are added, prefer Vitest with React Testing Library, place tests next to the implementation as `*.test.ts` or `*.test.tsx`, and cover user-visible behavior rather than implementation details.

## Commit & Pull Request Guidelines

This directory has no Git history available, so use a clear conventional style for new commits, for example `feat: add customer list` or `fix: handle empty inventory state`. Keep commits focused and explain why the change exists when it is not obvious.

Pull requests should include a short summary, verification commands run, linked issue or task references when available, and screenshots or recordings for visible UI changes. Note any follow-up work or known limitations explicitly.

## Configuration Notes

The React Compiler is enabled through `@vitejs/plugin-react` and `@rolldown/plugin-babel` in `vite.config.ts`. Preserve this setup unless there is a measured reason to change build behavior.

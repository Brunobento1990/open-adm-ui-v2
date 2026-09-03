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

No test runner is configured yet. Always run `npm run lint` and `npm run build` as minimum static checks before submitting changes, but do not treat them as proof of user-visible behavior. If tests are added, prefer Vitest with React Testing Library, place tests next to the implementation as `*.test.ts` or `*.test.tsx`, and cover user-visible behavior rather than implementation details.

## Behavioral Verification

Lint and production build are minimum static checks and do not prove user-visible behavior.

For bug fixes and behavior changes, add and run a targeted regression test whenever the behavior can reasonably be exercised automatically. This includes routing, query-string propagation, conditional rendering, form validation, API payload construction, calculations, and state transitions.

Do not use terms such as **fixed**, **working**, **validated**, or **completed** unless the corresponding behavior was exercised successfully. Use precise language:

- **Implemented:** source code was changed.
- **Statically validated:** lint and TypeScript or production build passed.
- **Automatically tested:** a behavioral test passed.
- **Integration tested:** interaction with the real service passed.
- **Manually validated:** the complete user-interface flow was exercised.

If only static checks were possible, describe the change as implemented and statically validated, not as fixed or working. State prominently which behavioral or integration verification remains and whether the user still needs to perform a manual acceptance test.

The absence of a configured test runner does not make lint and build sufficient behavioral verification. For critical functionality, configure an appropriate test, use an existing executable verification method, or explicitly describe the required manual acceptance test and why it could not be automated from the agent environment.

Before completing a critical migration, define and verify its acceptance path, including navigation, route and query parameters, API payload, API response handling, conditional behavior, and final visible state. Do not mark a critical item as complete in `MIGRATION.md` without recording or reporting its actual verification level.

## Evidence, Inferences, and Environment

Do not turn failures observed in the agent environment into claims about the user's environment. Always distinguish clearly between:

- **Observed fact:** the exact result of a command, test, response, or source inspection.
- **Inference:** a likely explanation based on the available evidence.
- **Not verified:** a condition that could not be proved from the agent environment.

A failure to access `localhost`, a port, database, Docker container, API, or other service means only that the resource was not accessible from the agent's execution environment. Do not claim that the service is stopped, unavailable, or misconfigured without additional evidence. Absence of evidence is not evidence of absence.

Do not describe an integration as tested or working merely because lint, TypeScript, or the production build passed. Report verification levels separately when relevant:

- static validation or lint;
- TypeScript compilation and production build;
- automated tests;
- integration test against the real service;
- manual user-interface test.

When an integration test cannot be executed, state exactly what was not verified and why, without inferring the state of the external service. For critical migrations, compare the legacy implementation, API contract, and new implementation explicitly. Present any unresolved divergence before choosing behavior.

## Commit & Pull Request Guidelines

This directory has no Git history available, so use a clear conventional style for new commits, for example `feat: add customer list` or `fix: handle empty inventory state`. Keep commits focused and explain why the change exists when it is not obvious.

Pull requests should include a short summary, verification commands run, linked issue or task references when available, and screenshots or recordings for visible UI changes. Note any follow-up work or known limitations explicitly.

## Configuration Notes

The React Compiler is enabled through `@vitejs/plugin-react` and `@rolldown/plugin-babel` in `vite.config.ts`. Preserve this setup unless there is a measured reason to change build behavior.

# Imports and Type Organization Rules

## Mandatory Rules

1. Order imports as third-party runtime dependencies, type dependencies, internal runtime modules, then UI or component modules when applicable. Within the type group, place module-local types before shared types.
2. Prefer standard imports when the compiler and bundler safely erase type-only usage. Use a separate `import type` only when required by the verified compiler, lint, bundler, or package runtime contract; never use inline `type` modifiers.
3. Import another module through its configured alias and public entry. Do not climb two or more parent directories or reach into another module's private files.
4. Keep concise private types near their owner. Move reusable or public contracts to the repository's established type module, and keep ambient `.d.ts` declarations in its configured declaration location.

## Review Checklist

- Runtime, type, internal, and UI imports follow the required grouping.
- Type-only imports match the verified compiler, lint, bundler, and runtime contract.
- Cross-module imports use configured aliases and public entries.
- Private, reusable, public, and ambient types remain with their intended owners.

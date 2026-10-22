# TypeScript Application Architecture

Owns Core Rule 2.

This reference is a placement decision map, not a directory-generation template. Use the repository's established equivalents, and create a directory only when it has a real responsibility. Directory responsibilities are presented as a source map and placement decision table.

## Application Source Map

A Vue and TypeScript application may contain the following source layers. The complete map helps identify ownership; it does not require every project or feature to contain every entry.

```text
src/
|-- App.vue                Application root owned by vue-code-rules
|-- main.ts                Application bootstrap and registrations
|-- apis/                  Backend transport endpoints and request contracts
|   `-- index.ts
|-- assets/                Bundled static assets
|-- components/            Cross-page reusable UI owned by vue-code-rules
|   `-- index.ts
|-- constants/             Cross-owner immutable domain or configuration values
|   `-- index.ts
|-- hooks/                 Cross-page Vue composables owned by vue-code-rules
|   `-- index.ts
|-- layout/                Page frames owned by vue-code-rules
|-- pages/ (or views/)     Route-level units owned by vue-code-rules
|-- router/                Route records, guards, and router assembly
|   `-- index.ts
|-- store/                 Application-wide state and store modules
|   `-- index.ts
|-- styles/                Application-wide styles owned by css-code-rules
|   `-- index.less
|-- type/                  Ambient declarations and truly application-wide contracts
|   `-- index.ts
`-- utils/                 Stateless helpers shared across ownership boundaries
    `-- index.ts
```

Optional target-specific UI trees such as `pages-pc/` and `components-pc/` follow the repository's established structure. Preserve the repository's established singular or plural names, such as `api/` versus `apis/`; do not introduce a competing directory merely to match this map.

## Mandatory Rules

1. Keep `main.ts` limited to application creation, global plugin and style registration, router or store installation, and mounting. Feature workflows and reusable helpers belong to their actual owners.
2. Place backend API modules in the repository's established API source layer.
3. Keep owner-private constants, types, and stateless helpers beside the page, component, or feature that owns them. Promote them to `src/constants`, `src/type`, or `src/utils` only after consumers cross that ownership boundary or an application-wide contract requires it.
4. Keep `src/type` focused on configured ambient declarations and truly application-wide contracts. Do not turn it into a catch-all for page, component, API, or store types that have a clearer owner.
5. Keep `src/utils` stateless and organize shared helpers by focused business domain or technical capability. Extend an existing matching module before creating another, avoid catch-all files such as `common.ts`, and re-export public helpers through the directory's established entry without placing implementation in the barrel.
6. Keep application-wide state in the established store layer only when it is shared across routes or independent owners. Component-subtree state, page-private state, and request-local state remain with their nearest owner.
7. Keep route records, guards, and router assembly in `router/`. Route components and page workflows remain in the page tree rather than moving into route configuration.
8. Every module directory outside `assets/`, `layout/`, `pages/` (or its established equivalent such as `views/`), and `styles/` must have a lowercase `index.ts` that uniformly exposes its related public child modules. This includes `apis/`, `components/`, `constants/`, `hooks/`, `router/`, `store/`, `type/`, and `utils/`, using the repository's established names. Create directories only for actual responsibilities; once present, supply their required entry. The exclusions do not remove Vue component owners' own required entries.
9. Use `styles/index.less` to aggregate all child styles in their intended cascade order. Application bootstrap imports this aggregate entry rather than individually importing its child styles. This directory uses a stylesheet entry rather than `index.ts`; follow `css-code-rules` for stylesheet ownership and implementation.

## Module Entry Responsibilities

| Directory | Required entry | Entry responsibility |
| --- | --- | --- |
| `apis/`, `constants/`, `hooks/`, `type/`, `utils/` | `index.ts` | Re-export the related public declarations from child modules |
| `components/` | `index.ts` | Re-export public child components and their supported contracts through their own entries |
| `router/`, `store/` | `index.ts` | Re-export routing/state capabilities assembled in their owning child modules |
| `styles/` | `index.less` | Import all child styles in the required cascade order |
| `assets/`, `layout/`, `pages/` (or `views/`) | No aggregate `index.ts` required by this rule | Retain their own resource or Vue owner structure |

Keep TypeScript entries declarative: they re-export public declarations instead of containing implementation or exposing private internals. Ambient declarations remain connected through the actual TypeScript configuration rather than being converted into runtime exports. Cross-module consumption follows [Cross-Module Public Entries](public-entries.md).

## Placement Decisions

| Capability | Keep with the nearest owner | Promote to an application source layer when |
| --- | --- | --- |
| Type or interface | Only one page, component, API, or store owns the contract | The contract is ambient or genuinely application-wide; otherwise expose it through the owning module's public entry |
| Constant | It encodes an owner-specific option, limit, status map, or configuration | Multiple independent owners share the same domain meaning |
| Stateless helper | One owner or one owner subtree uses it | Real consumers cross ownership boundaries and the helper has a focused domain or technical capability |
| Vue composable | It coordinates one page or component subtree | Multiple pages or independent components reuse the same Vue behavior |
| Store module | State belongs to one page or component subtree | Independent routes or owners require one application-wide state source |

Owner-private directories are optional. For Vue pages and components, follow the fixed owner structure in `vue-code-rules`: use only `component/`, `hooks/`, `constants/`, `type/`, the prescribed style form, and the required component entries. Keep cohesive private functional helpers in focused utility hooks under `hooks/`; do not add a component-private `utils/`, `helpers/`, or loose root helper files. Genuinely shared stateless functions belong in the established project `utils` layer. Other owner types retain their established private layout. Add only entries required by the actual owner, and keep their public surface no broader than their real consumers require.

## Related Boundary Rule

When selecting cross-owner import paths or exposing declarations, also read [Cross-Module Public Entries](public-entries.md). That reference owns alias selection and barrel behavior; this reference owns source-layer placement.

## Review Checklist

- Existing source-layer names and responsibilities are preserved rather than duplicated.
- Bootstrap, routing, application state, and stateless utility modules remain in their established source layers.
- Private constants, types, helpers, and composables stay with their nearest owner until real cross-owner reuse exists.
- `src/type` and `src/utils` are focused layers rather than catch-all directories.
- Optional directories are created only for real contents and are not added as placeholders.
- Every non-excluded module directory has an `index.ts` exposing its public child modules; excluded Vue owners retain their own required entries.
- `styles/index.less` aggregates every child stylesheet in the intended order, and bootstrap consumes that single stylesheet entry.

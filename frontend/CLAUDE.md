# Frontend conventions (React + TypeScript)

## Structure
```
src/
  types/          ← TypeScript interfaces (one file per domain)
  services/       ← React Query hooks + API calls (one file per resource)
  components/     ← UI components grouped by feature
  hooks/          ← shared custom hooks
```

## TypeScript
- Strict mode — never use `any`, never use `@ts-ignore`
- Define interfaces in `src/types/<resource>.ts` before implementing components
- Named exports only — no default exports except route-level pages

## Components
- Tailwind only — no inline styles, no CSS modules
- One component per file; filename matches component name
- Props interface defined in same file, above the component

## Data fetching
- React Query for all server state — no manual `useEffect` + `fetch`
- API functions in `src/services/<resource>Service.ts`, imported by hooks
- Query keys: `['resource', id?]` pattern

## Pattern
```tsx
// src/services/storageItemService.ts
export const useStorageItems = () =>
  useQuery({ queryKey: ['storageItems'], queryFn: () => api.get('/api/v1/storage_items') });

// src/components/StorageItem/StorageItemList.tsx
interface Props { userId: string }
export const StorageItemList = ({ userId }: Props) => { ... };
```

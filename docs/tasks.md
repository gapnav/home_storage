# Home Storage — Implementation Tasks

See [architecture.md](architecture.md) for design decisions and data model.

---

## Phase 0 — Foundation

- [x] 0.1 Git init + initial commit of current hello-world state
- [x] 0.2 Remove hello-world slice: `api/v1/hello_controller.rb`, its route, `frontend/src/services/helloService.ts`, `frontend/src/components/HelloMessage.tsx`, and update `App.tsx` to a blank placeholder (no broken imports)

---

## Phase 1 — Backend: Data layer

- [x] 1.1 Add `ancestry` gem to Gemfile + rebuild Docker image
- [x] 1.2 Create migration: `nodes` table (node_type enum, title, description, code, ancestry, parent_id)
- [x] 1.3 Run migration inside Docker
- [x] 1.4 `Node` model + `spec/models/node_spec.rb` — ancestry config, validations, scopes

---

## Phase 2 — Backend: Services + Controller

- [x] 2.1 `Nodes::CreateService` + `spec/services/nodes/create_service_spec.rb`
- [x] 2.2 `Nodes::MoveService` + `spec/services/nodes/move_service_spec.rb`
- [x] 2.3 `Nodes::DestroyService` + `spec/services/nodes/destroy_service_spec.rb`
- [ ] 2.4 `Api::V1::NodesController` + routes + `spec/requests/api/v1/nodes_spec.rb`

---

## Phase 3 — Frontend: Data layer

- [ ] 3.1 `frontend/src/types/node.ts` — Node, NodeType, BreadcrumbItem, NodeDetail types
- [ ] 3.2 `frontend/src/services/nodesService.ts` + `nodesService.test.ts`
- [ ] 3.3 `frontend/src/hooks/useNodes.ts` + `useNodes.test.ts` — query hooks (`useRootNodes`, `useNode`, `useSearchNodes`) and mutation hooks (`useCreateNode`, `useUpdateNode`, `useMoveNode`, `useDeleteNode`)

---

## Phase 4 — Frontend: UI components

- [ ] 4.1 `Breadcrumb.tsx` + `Breadcrumb.test.tsx`
- [ ] 4.2 `NodeRow.tsx` + `NodeRow.test.tsx`
- [ ] 4.3 `NodeBrowser.tsx` + `NodeBrowser.test.tsx`
- [ ] 4.4 `NodeForm.tsx` + `NodeForm.test.tsx`
- [ ] 4.5 `SearchBar.tsx` + `SearchBar.test.tsx`
- [ ] 4.6 `SearchResults.tsx` + `SearchResults.test.tsx`
- [ ] 4.7 Wire into `App.tsx` — replace placeholder with NodeBrowser + SearchBar

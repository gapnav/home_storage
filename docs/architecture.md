# Home Storage — Architecture

## What it is

A catalog app to track physical belongings across nested storage locations (shed, boxes, rooms, attic, etc.). The core need: a tree of nodes where you can find "where is X?" and "what's in Y?".

---

## Domain Model

### Single `nodes` table

```
nodes
  id           bigint PK
  parent_id    bigint FK → nodes.id (null = root)
  ancestry     string  (managed by ancestry gem)
  node_type    enum    :storage | :thing
  title        string  NOT NULL
  description  text
  code         string  (nullable; label written on physical box)
  timestamps
```

**Why single table:** Storages and things share ~90% of their fields and live in the same tree. A `node_type` enum column cleanly handles the distinction without complicating tree traversal.

**Tree strategy: `ancestry` gem**
- Stores a materialized path string (`"1/4/17"`) in the `ancestry` column
- Provides `node.ancestors`, `node.descendants`, `node.children`, `node.path`, `Node.roots` out of the box
- Fast indexed string comparisons in Postgres, no recursive CTEs needed

### Rules
| Rule | Enforcement |
|---|---|
| Only storage nodes can have children | `Node` model validation + service layer |
| Non-empty storage cannot be deleted | `DestroyService` checks `node.children.any?` |
| `code` is globally unique | DB unique index + model validation |

---

## API

```
GET    /api/v1/nodes            # root nodes, or ?parent_id=X for children
POST   /api/v1/nodes            # create node
GET    /api/v1/nodes/:id        # node + direct children + ancestry path
PATCH  /api/v1/nodes/:id        # update title/description/code
DELETE /api/v1/nodes/:id        # delete (fails if non-empty storage)
PATCH  /api/v1/nodes/:id/move   # { parent_id: X }
GET    /api/v1/nodes/search     # ?q=term
```

### Response envelope
```json
{
  "data": {
    "id": 5,
    "nodeType": "storage",
    "title": "Microwave box",
    "description": null,
    "code": "A12",
    "parentId": 2,
    "path": [
      { "id": 1, "title": "Shed" },
      { "id": 2, "title": "Shelf A" },
      { "id": 5, "title": "Microwave box" }
    ],
    "children": [ ... ]
  }
}
```

Errors: `{ "errors": ["Cannot delete a storage that contains items"] }` with appropriate HTTP status.

---

## Backend Structure

```
app/models/node.rb
app/services/nodes/
  create_service.rb
  move_service.rb
  destroy_service.rb
app/controllers/api/v1/nodes_controller.rb
spec/models/node_spec.rb
spec/services/nodes/
  create_service_spec.rb
  move_service_spec.rb
  destroy_service_spec.rb
spec/requests/api/v1/nodes_spec.rb
```

---

## Frontend Structure

Navigation: simple drill-down state (`currentNodeId`). `null` = root view. No URL router.

```
frontend/src/
  types/node.ts
  services/nodesService.ts
  hooks/useNodes.ts          # React Query queries + mutations
  components/
    NodeBrowser/
      NodeBrowser.tsx        # breadcrumb + child list + create button
      NodeRow.tsx            # single row: icon, title, code badge, actions
      Breadcrumb.tsx         # ancestry path, clickable
    NodeForm/
      NodeForm.tsx           # create/edit modal
    Search/
      SearchBar.tsx
      SearchResults.tsx      # flat list with path per result
```

---

## Decisions Log

| Topic | Decision |
|---|---|
| Delete non-empty storage | Blocked — 422, user must empty it first |
| Things as containers | No — things are always leaf nodes |
| Code uniqueness | Global — unique DB index + model validation |
| Navigation | Simple in-memory state, no router |
| Tree implementation | `ancestry` gem (materialized path) |

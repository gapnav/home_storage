import type { Node, NodeDetail, SearchNode } from "../types/node";
import type { NodeType } from "../types/node";

const BASE = "/api/v1";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...options?.headers },
    ...options,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error((body as { errors?: string[] }).errors?.[0] ?? res.statusText);
  }
  if (res.status === 204) return undefined as T;
  const json = await res.json();
  return (json as { data: T }).data;
}

export interface CreateNodeParams {
  title: string;
  nodeType: NodeType;
  parentId?: number | null;
  description?: string | null;
  code?: string | null;
}

export interface UpdateNodeParams {
  title?: string;
  description?: string | null;
  code?: string | null;
  parentId?: number | null;
}

export const fetchRootNodes = (): Promise<Node[]> =>
  request<Node[]>("/nodes");

export const fetchChildNodes = (parentId: number): Promise<Node[]> =>
  request<Node[]>(`/nodes?parent_id=${parentId}`);

export const fetchNode = (id: number): Promise<NodeDetail> =>
  request<NodeDetail>(`/nodes/${id}`);

export const searchNodes = (q: string): Promise<SearchNode[]> =>
  request<SearchNode[]>(`/nodes?q=${encodeURIComponent(q)}`);

export const createNode = (params: CreateNodeParams): Promise<Node> =>
  request<Node>("/nodes", {
    method: "POST",
    body: JSON.stringify({
      node: {
        title: params.title,
        node_type: params.nodeType,
        parent_id: params.parentId ?? null,
        description: params.description ?? null,
        code: params.code ?? null,
      },
    }),
  });

export const updateNode = (id: number, params: UpdateNodeParams): Promise<Node> => {
  const node: Record<string, string | null | number> = {};
  if (params.title !== undefined) node.title = params.title;
  if (params.description !== undefined) node.description = params.description;
  if (params.code !== undefined) node.code = params.code;
  if (params.parentId !== undefined) node.parent_id = params.parentId;
  return request<Node>(`/nodes/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ node }),
  });
};

export const deleteNode = (id: number): Promise<void> =>
  request<void>(`/nodes/${id}`, { method: "DELETE" });

export const fetchAllNodes = (): Promise<Node[]> =>
  request<Node[]>("/nodes?flat=true");

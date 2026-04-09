import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import {
  fetchRootNodes,
  fetchChildNodes,
  fetchNode,
  searchNodes,
  createNode,
  updateNode,
  deleteNode,
} from "../services/nodesService";
import type { CreateNodeParams, UpdateNodeParams } from "../services/nodesService";

export const nodeKeys = {
  all: ["nodes"] as const,
  list: (parentId: number | null) => ["nodes", "list", parentId] as const,
  detail: (id: number) => ["nodes", id] as const,
  search: (q: string) => ["nodes", "search", q] as const,
};

export const useNodes = (parentId?: number | null, enabled = true) =>
  useQuery({
    queryKey: nodeKeys.list(parentId ?? null),
    queryFn: () =>
      parentId != null ? fetchChildNodes(parentId) : fetchRootNodes(),
    enabled,
  });

export const useNode = (id: number | null) => {
  const enabled = id !== null;
  return useQuery({
    queryKey: enabled ? nodeKeys.detail(id) : (["nodes", "detail", null] as const),
    queryFn: () => fetchNode(id!),
    enabled,
  });
};

export const useSearchNodes = (q: string) =>
  useQuery({
    queryKey: nodeKeys.search(q),
    queryFn: () => searchNodes(q),
    enabled: q.trim().length > 0,
  });

export const useCreateNode = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (params: CreateNodeParams) => createNode(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: nodeKeys.all });
    },
  });
};

export const useUpdateNode = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, params }: { id: number; params: UpdateNodeParams }) =>
      updateNode(id, params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: nodeKeys.all });
    },
  });
};

export const useDeleteNode = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteNode(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: nodeKeys.all });
    },
  });
};

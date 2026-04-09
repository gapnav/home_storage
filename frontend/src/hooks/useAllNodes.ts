import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchAllNodes } from "../services/nodesService";
import { nodeKeys } from "./useNodes";
import type { FlatNode, Node } from "../types/node";

function buildExcludedSet(childrenMap: Map<number, Node[]>, excludeId: number | undefined): Set<number> {
  const excluded = new Set<number>();
  if (excludeId === undefined) return excluded;

  const stack = [excludeId];
  while (stack.length) {
    const id = stack.pop()!;
    excluded.add(id);
    for (const child of childrenMap.get(id) ?? []) {
      stack.push(child.id);
    }
  }

  return excluded;
}

function buildFlatList(
  nodes: Node[],
  childrenMap: Map<number, Node[]>,
  excluded: Set<number>,
  depth = 0,
): FlatNode[] {
  const result: FlatNode[] = [];
  for (const node of nodes) {
    if (excluded.has(node.id)) continue;
    if (node.nodeType !== "storage") continue;
    result.push({ id: node.id, title: node.title, depth, parentId: node.parentId, nodeType: node.nodeType });
    const children = childrenMap.get(node.id) ?? [];
    if (children.length > 0) {
      result.push(...buildFlatList(children, childrenMap, excluded, depth + 1));
    }
  }
  return result;
}

export const useAllNodes = (
  excludeId?: number,
): { flatNodes: FlatNode[]; isLoading: boolean } => {
  const { data, isLoading } = useQuery({
    queryKey: nodeKeys.flat,
    queryFn: fetchAllNodes,
  });

  const flatNodes = useMemo(() => {
    const allNodes = data ?? [];

    const childrenMap = new Map<number, Node[]>();
    for (const node of allNodes) {
      if (node.parentId !== null) {
        const siblings = childrenMap.get(node.parentId) ?? [];
        siblings.push(node);
        childrenMap.set(node.parentId, siblings);
      }
    }

    const roots = allNodes.filter((n) => n.parentId === null);
    const excluded = buildExcludedSet(childrenMap, excludeId);
    return buildFlatList(roots, childrenMap, excluded);
  }, [data, excludeId]);

  return { flatNodes, isLoading };
};

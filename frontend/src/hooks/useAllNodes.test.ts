import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createElement } from "react";
import type { PropsWithChildren } from "react";
import { useAllNodes } from "./useAllNodes";
import * as service from "../services/nodesService";
import type { Node } from "../types/node";

vi.mock("../services/nodesService");

function makeNode(overrides: Partial<Node> & { id: number; title: string }): Node {
  return {
    nodeType: "storage",
    description: null,
    code: null,
    parentId: null,
    ...overrides,
  };
}

function wrapper({ children }: PropsWithChildren) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return createElement(QueryClientProvider, { client: queryClient }, children);
}

beforeEach(() => {
  vi.resetAllMocks();
});

describe("useAllNodes", () => {
  it("returns an empty flat list when there are no nodes", async () => {
    vi.mocked(service.fetchAllNodes).mockResolvedValue([]);
    const { result } = renderHook(() => useAllNodes(), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.flatNodes).toEqual([]);
  });

  it("returns root nodes with depth 0", async () => {
    const root = makeNode({ id: 1, title: "Garage" });
    vi.mocked(service.fetchAllNodes).mockResolvedValue([root]);
    const { result } = renderHook(() => useAllNodes(), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.flatNodes).toEqual([
      { id: 1, title: "Garage", depth: 0, parentId: null, nodeType: "storage" },
    ]);
  });

  it("returns children with increasing depth in depth-first order", async () => {
    const root = makeNode({ id: 1, title: "Garage" });
    const child = makeNode({ id: 2, title: "Shelf", parentId: 1 });
    const grandchild = makeNode({ id: 3, title: "Box", parentId: 2 });
    vi.mocked(service.fetchAllNodes).mockResolvedValue([root, child, grandchild]);
    const { result } = renderHook(() => useAllNodes(), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.flatNodes).toEqual([
      { id: 1, title: "Garage", depth: 0, parentId: null, nodeType: "storage" },
      { id: 2, title: "Shelf", depth: 1, parentId: 1, nodeType: "storage" },
      { id: 3, title: "Box", depth: 2, parentId: 2, nodeType: "storage" },
    ]);
  });

  it("excludes the given node from the flat list", async () => {
    const root = makeNode({ id: 1, title: "Garage" });
    const other = makeNode({ id: 2, title: "Attic" });
    vi.mocked(service.fetchAllNodes).mockResolvedValue([root, other]);
    const { result } = renderHook(() => useAllNodes(1), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.flatNodes).toEqual([
      { id: 2, title: "Attic", depth: 0, parentId: null, nodeType: "storage" },
    ]);
  });

  it("excludes descendants of the excluded node", async () => {
    const root = makeNode({ id: 1, title: "Garage" });
    const child = makeNode({ id: 2, title: "Shelf", parentId: 1 });
    const other = makeNode({ id: 3, title: "Attic" });
    vi.mocked(service.fetchAllNodes).mockResolvedValue([root, child, other]);
    const { result } = renderHook(() => useAllNodes(1), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.flatNodes).toEqual([
      { id: 3, title: "Attic", depth: 0, parentId: null, nodeType: "storage" },
    ]);
  });

  it("handles nodes deeper than 4 levels", async () => {
    const nodes = [
      makeNode({ id: 1, title: "L0" }),
      makeNode({ id: 2, title: "L1", parentId: 1 }),
      makeNode({ id: 3, title: "L2", parentId: 2 }),
      makeNode({ id: 4, title: "L3", parentId: 3 }),
      makeNode({ id: 5, title: "L4", parentId: 4 }),
      makeNode({ id: 6, title: "L5", parentId: 5 }),
    ];
    vi.mocked(service.fetchAllNodes).mockResolvedValue(nodes);
    const { result } = renderHook(() => useAllNodes(), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.flatNodes).toHaveLength(6);
    expect(result.current.flatNodes[5]).toEqual({ id: 6, title: "L5", depth: 5, parentId: 5, nodeType: "storage" });
  });

  it("filters out thing nodes from the flat list", async () => {
    const storage = makeNode({ id: 1, title: "Garage" });
    const thing = makeNode({ id: 2, title: "Hammer", nodeType: "thing" });
    vi.mocked(service.fetchAllNodes).mockResolvedValue([storage, thing]);
    const { result } = renderHook(() => useAllNodes(), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.flatNodes).toEqual([
      { id: 1, title: "Garage", depth: 0, parentId: null, nodeType: "storage" },
    ]);
  });
});

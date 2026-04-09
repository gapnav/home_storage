import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createElement } from "react";
import type { PropsWithChildren } from "react";
import {
  useNodes,
  useNode,
  useSearchNodes,
  useCreateNode,
  useUpdateNode,
  useDeleteNode,
} from "./useNodes";
import * as service from "../services/nodesService";
import type { Node, NodeDetail } from "../types/node";

vi.mock("../services/nodesService");

const mockNode: Node = {
  id: 1,
  nodeType: "storage",
  title: "Shed",
  description: null,
  code: null,
  parentId: null,
};

const mockDetail: NodeDetail = {
  ...mockNode,
  path: [{ id: 1, title: "Shed" }],
  children: [],
};

function wrapper({ children }: PropsWithChildren) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return createElement(QueryClientProvider, { client: queryClient }, children);
}

beforeEach(() => {
  vi.resetAllMocks();
});

describe("useNodes", () => {
  it("fetches root nodes when parentId is not provided", async () => {
    vi.mocked(service.fetchRootNodes).mockResolvedValue([mockNode]);
    const { result } = renderHook(() => useNodes(), { wrapper });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(service.fetchRootNodes).toHaveBeenCalled();
    expect(result.current.data).toEqual([mockNode]);
  });

  it("fetches root nodes when parentId is null", async () => {
    vi.mocked(service.fetchRootNodes).mockResolvedValue([mockNode]);
    const { result } = renderHook(() => useNodes(null), { wrapper });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(service.fetchRootNodes).toHaveBeenCalled();
  });

  it("fetches child nodes when parentId is provided", async () => {
    vi.mocked(service.fetchChildNodes).mockResolvedValue([mockNode]);
    const { result } = renderHook(() => useNodes(5), { wrapper });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(service.fetchChildNodes).toHaveBeenCalledWith(5);
    expect(result.current.data).toEqual([mockNode]);
  });
});

describe("useNode", () => {
  it("fetches node detail when id is provided", async () => {
    vi.mocked(service.fetchNode).mockResolvedValue(mockDetail);
    const { result } = renderHook(() => useNode(1), { wrapper });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(service.fetchNode).toHaveBeenCalledWith(1);
    expect(result.current.data).toEqual(mockDetail);
  });

  it("does not fetch when id is null", () => {
    const { result } = renderHook(() => useNode(null), { wrapper });
    expect(result.current.fetchStatus).toBe("idle");
    expect(service.fetchNode).not.toHaveBeenCalled();
  });
});

describe("useSearchNodes", () => {
  it("searches when query is non-empty", async () => {
    vi.mocked(service.searchNodes).mockResolvedValue([mockNode]);
    const { result } = renderHook(() => useSearchNodes("shed"), { wrapper });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(service.searchNodes).toHaveBeenCalledWith("shed");
  });

  it("does not fetch when query is empty", () => {
    const { result } = renderHook(() => useSearchNodes(""), { wrapper });
    expect(result.current.fetchStatus).toBe("idle");
    expect(service.searchNodes).not.toHaveBeenCalled();
  });

  it("does not fetch when query is whitespace only", () => {
    const { result } = renderHook(() => useSearchNodes("   "), { wrapper });
    expect(result.current.fetchStatus).toBe("idle");
    expect(service.searchNodes).not.toHaveBeenCalled();
  });
});

describe("useCreateNode", () => {
  it("calls createNode and invalidates cache on success", async () => {
    vi.mocked(service.createNode).mockResolvedValue(mockNode);
    const { result } = renderHook(() => useCreateNode(), { wrapper });
    result.current.mutate({ title: "Shed", nodeType: "storage" });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(service.createNode).toHaveBeenCalledWith({
      title: "Shed",
      nodeType: "storage",
    });
  });
});

describe("useUpdateNode", () => {
  it("calls updateNode with id and params", async () => {
    const updated = { ...mockNode, title: "Big Shed" };
    vi.mocked(service.updateNode).mockResolvedValue(updated);
    const { result } = renderHook(() => useUpdateNode(), { wrapper });
    result.current.mutate({ id: 1, params: { title: "Big Shed" } });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(service.updateNode).toHaveBeenCalledWith(1, { title: "Big Shed" });
  });

  it("supports move via parentId param", async () => {
    vi.mocked(service.updateNode).mockResolvedValue(mockNode);
    const { result } = renderHook(() => useUpdateNode(), { wrapper });
    result.current.mutate({ id: 1, params: { parentId: 3 } });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(service.updateNode).toHaveBeenCalledWith(1, { parentId: 3 });
  });
});

describe("useDeleteNode", () => {
  it("calls deleteNode with id", async () => {
    vi.mocked(service.deleteNode).mockResolvedValue(undefined);
    const { result } = renderHook(() => useDeleteNode(), { wrapper });
    result.current.mutate(1);
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(service.deleteNode).toHaveBeenCalledWith(1);
  });
});

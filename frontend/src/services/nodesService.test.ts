import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  fetchRootNodes,
  fetchChildNodes,
  fetchNode,
  searchNodes,
  createNode,
  updateNode,
  deleteNode,
} from "./nodesService";
import type { Node, NodeDetail } from "../types/node";

const mockNode: Node = {
  id: 1,
  nodeType: "storage",
  title: "Shed",
  description: null,
  code: null,
  parentId: null,
};

const mockNodeDetail: NodeDetail = {
  ...mockNode,
  path: [{ id: 1, title: "Shed" }],
  children: [],
};

function mockFetch(data: unknown, status = 200) {
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue({
      ok: status >= 200 && status < 300,
      status,
      statusText: "OK",
      json: () => Promise.resolve(status === 204 ? undefined : { data }),
    })
  );
}

function mockFetchError(errors: string[], status = 422) {
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue({
      ok: false,
      status,
      statusText: "Unprocessable Entity",
      json: () => Promise.resolve({ errors }),
    })
  );
}

beforeEach(() => {
  vi.unstubAllGlobals();
});

describe("fetchRootNodes", () => {
  it("GET /api/v1/nodes and returns array", async () => {
    mockFetch([mockNode]);
    const result = await fetchRootNodes();
    expect(fetch).toHaveBeenCalledWith("/api/v1/nodes", expect.any(Object));
    expect(result).toEqual([mockNode]);
  });
});

describe("fetchChildNodes", () => {
  it("GET /api/v1/nodes?parent_id=X", async () => {
    mockFetch([mockNode]);
    const result = await fetchChildNodes(5);
    expect(fetch).toHaveBeenCalledWith(
      "/api/v1/nodes?parent_id=5",
      expect.any(Object)
    );
    expect(result).toEqual([mockNode]);
  });
});

describe("fetchNode", () => {
  it("GET /api/v1/nodes/:id and returns NodeDetail", async () => {
    mockFetch(mockNodeDetail);
    const result = await fetchNode(1);
    expect(fetch).toHaveBeenCalledWith("/api/v1/nodes/1", expect.any(Object));
    expect(result).toEqual(mockNodeDetail);
  });
});

describe("searchNodes", () => {
  it("GET /api/v1/nodes?q=encoded+term", async () => {
    mockFetch([mockNode]);
    const result = await searchNodes("shed box");
    expect(fetch).toHaveBeenCalledWith(
      "/api/v1/nodes?q=shed%20box",
      expect.any(Object)
    );
    expect(result).toEqual([mockNode]);
  });
});

describe("createNode", () => {
  it("POST /api/v1/nodes with snake_case body", async () => {
    mockFetch(mockNode, 201);
    const result = await createNode({
      title: "Shed",
      nodeType: "storage",
      parentId: null,
    });
    const call = (fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(call[0]).toBe("/api/v1/nodes");
    expect(call[1].method).toBe("POST");
    const body = JSON.parse(call[1].body as string);
    expect(body.node.node_type).toBe("storage");
    expect(body.node.parent_id).toBeNull();
    expect(result).toEqual(mockNode);
  });
});

describe("updateNode", () => {
  it("PATCH /api/v1/nodes/:id with params", async () => {
    const updated = { ...mockNode, title: "Big Shed" };
    mockFetch(updated);
    const result = await updateNode(1, { title: "Big Shed" });
    const call = (fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(call[0]).toBe("/api/v1/nodes/1");
    expect(call[1].method).toBe("PATCH");
    expect(result).toEqual(updated);
  });
});

describe("updateNode — move", () => {
  it("sends parent_id when parentId is provided", async () => {
    mockFetch(mockNode);
    await updateNode(1, { parentId: 3 });
    const call = (fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(call[0]).toBe("/api/v1/nodes/1");
    const body = JSON.parse(call[1].body as string);
    expect(body.node.parent_id).toBe(3);
  });

  it("supports moving to root (null parentId)", async () => {
    mockFetch(mockNode);
    await updateNode(1, { parentId: null });
    const body = JSON.parse(
      (fetch as ReturnType<typeof vi.fn>).mock.calls[0][1].body as string
    );
    expect(body.node.parent_id).toBeNull();
  });
});

describe("deleteNode", () => {
  it("DELETE /api/v1/nodes/:id and returns void", async () => {
    mockFetch(undefined, 204);
    const result = await deleteNode(1);
    expect(fetch).toHaveBeenCalledWith("/api/v1/nodes/1", expect.any(Object));
    expect(result).toBeUndefined();
  });
});

describe("error handling", () => {
  it("throws with first error message from response", async () => {
    mockFetchError(["Title can't be blank"]);
    await expect(createNode({ title: "", nodeType: "thing" })).rejects.toThrow(
      "Title can't be blank"
    );
  });
});

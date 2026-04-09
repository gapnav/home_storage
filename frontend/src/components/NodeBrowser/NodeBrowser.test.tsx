import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import type { Node, NodeDetail } from "@/types/node";
import { NodeBrowser } from "./NodeBrowser";

vi.mock("@/hooks/useNodes", () => ({
  useNodes: vi.fn(),
  useNode: vi.fn(),
}));

import { useNodes, useNode } from "@/hooks/useNodes";

const mockUseNodes = vi.mocked(useNodes);
const mockUseNode = vi.mocked(useNode);

const rootNodes: Node[] = [
  { id: 1, nodeType: "storage", title: "Shed", description: null, code: null, parentId: null },
  { id: 2, nodeType: "thing", title: "Ladder", description: null, code: "L01", parentId: null },
];

const shedDetail: NodeDetail = {
  id: 1,
  nodeType: "storage",
  title: "Shed",
  description: null,
  code: null,
  parentId: null,
  path: [{ id: 1, title: "Shed" }],
  children: [
    { id: 3, nodeType: "storage", title: "Shelf A", description: null, code: null, parentId: 1 },
  ],
};

const defaultProps = {
  onCreateNode: vi.fn(),
  onEditNode: vi.fn(),
  onDeleteNode: vi.fn(),
};

beforeEach(() => {
  vi.clearAllMocks();
  mockUseNodes.mockReturnValue({ data: rootNodes, isLoading: false, isError: false } as ReturnType<typeof useNodes>);
  mockUseNode.mockReturnValue({ data: undefined, isLoading: false, isError: false } as ReturnType<typeof useNode>);
});

describe("NodeBrowser", () => {
  it("renders root nodes on initial load", () => {
    render(<NodeBrowser {...defaultProps} />);
    expect(screen.getByText("Shed")).toBeInTheDocument();
    expect(screen.getByText("Ladder")).toBeInTheDocument();
  });

  it("shows loading state", () => {
    mockUseNodes.mockReturnValue({ data: undefined, isLoading: true, isError: false } as ReturnType<typeof useNodes>);
    render(<NodeBrowser {...defaultProps} />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it("shows error state", () => {
    mockUseNodes.mockReturnValue({ data: undefined, isLoading: false, isError: true } as ReturnType<typeof useNodes>);
    render(<NodeBrowser {...defaultProps} />);
    expect(screen.getByText(/failed to load/i)).toBeInTheDocument();
  });

  it("shows empty state when there are no nodes", () => {
    mockUseNodes.mockReturnValue({ data: [], isLoading: false, isError: false } as ReturnType<typeof useNodes>);
    render(<NodeBrowser {...defaultProps} />);
    expect(screen.getByText(/nothing here yet/i)).toBeInTheDocument();
  });

  it("does not show breadcrumb at root", () => {
    render(<NodeBrowser {...defaultProps} />);
    expect(screen.queryByRole("navigation", { name: "breadcrumb" })).not.toBeInTheDocument();
  });

  it("drills into a storage node and shows its children and breadcrumb", () => {
    mockUseNode.mockReturnValue({ data: shedDetail, isLoading: false, isError: false } as ReturnType<typeof useNode>);
    render(<NodeBrowser {...defaultProps} />);

    fireEvent.click(screen.getByRole("button", { name: "Shed" }));

    expect(screen.getByRole("navigation", { name: "breadcrumb" })).toBeInTheDocument();
    expect(screen.getByText("Shelf A")).toBeInTheDocument();
  });

  it("navigates back to root via breadcrumb Home button", () => {
    mockUseNode.mockReturnValue({ data: shedDetail, isLoading: false, isError: false } as ReturnType<typeof useNode>);
    render(<NodeBrowser {...defaultProps} />);

    fireEvent.click(screen.getByRole("button", { name: "Shed" }));
    fireEvent.click(screen.getByRole("button", { name: "Home" }));

    expect(screen.queryByRole("navigation", { name: "breadcrumb" })).not.toBeInTheDocument();
    expect(screen.getByText("Shed")).toBeInTheDocument();
    expect(screen.getByText("Ladder")).toBeInTheDocument();
  });

  it("calls onCreateNode with null when Add item is clicked at root", () => {
    const onCreateNode = vi.fn();
    render(<NodeBrowser {...defaultProps} onCreateNode={onCreateNode} />);
    fireEvent.click(screen.getByRole("button", { name: /add item/i }));
    expect(onCreateNode).toHaveBeenCalledTimes(1);
    expect(onCreateNode).toHaveBeenCalledWith(null);
  });

  it("calls onCreateNode with current node id when Add item is clicked inside a node", () => {
    const onCreateNode = vi.fn();
    mockUseNode.mockReturnValue({ data: shedDetail, isLoading: false, isError: false } as ReturnType<typeof useNode>);
    render(<NodeBrowser {...defaultProps} onCreateNode={onCreateNode} />);

    fireEvent.click(screen.getByRole("button", { name: "Shed" }));
    fireEvent.click(screen.getByRole("button", { name: /add item/i }));

    expect(onCreateNode).toHaveBeenCalledTimes(1);
    expect(onCreateNode).toHaveBeenCalledWith(1);
  });

  it("calls onEditNode when edit is triggered on a node", () => {
    const onEditNode = vi.fn();
    render(<NodeBrowser {...defaultProps} onEditNode={onEditNode} />);
    fireEvent.click(screen.getByRole("button", { name: "Edit Shed" }));
    expect(onEditNode).toHaveBeenCalledTimes(1);
    expect(onEditNode).toHaveBeenCalledWith(rootNodes[0]);
  });

  it("calls onDeleteNode when delete is triggered on a node", () => {
    const onDeleteNode = vi.fn();
    render(<NodeBrowser {...defaultProps} onDeleteNode={onDeleteNode} />);
    fireEvent.click(screen.getByRole("button", { name: "Delete Ladder" }));
    expect(onDeleteNode).toHaveBeenCalledTimes(1);
    expect(onDeleteNode).toHaveBeenCalledWith(2);
  });

  it("shows empty state and no breadcrumb when detail data is undefined after drilling in", () => {
    // detail query still loading or returned nothing
    mockUseNode.mockReturnValue({ data: undefined, isLoading: false, isError: false } as ReturnType<typeof useNode>);
    render(<NodeBrowser {...defaultProps} />);

    fireEvent.click(screen.getByRole("button", { name: "Shed" }));

    expect(screen.queryByRole("navigation", { name: "breadcrumb" })).not.toBeInTheDocument();
    expect(screen.getByText(/nothing here yet/i)).toBeInTheDocument();
  });

  it("shows loading state when drilled into a node that is still fetching", () => {
    mockUseNode.mockReturnValue({ data: undefined, isLoading: true, isError: false } as ReturnType<typeof useNode>);
    render(<NodeBrowser {...defaultProps} />);

    fireEvent.click(screen.getByRole("button", { name: "Shed" }));

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });
});

import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ParentPicker } from "./ParentPicker";
import type { FlatNode } from "@/types/node";

vi.mock("@/hooks/useAllNodes", () => ({
  useAllNodes: vi.fn(),
}));

import { useAllNodes } from "@/hooks/useAllNodes";

const mockUseAllNodes = vi.mocked(useAllNodes);

const flatNodes: FlatNode[] = [
  { id: 2, title: "Attic", depth: 0, parentId: null },
  { id: 3, title: "Shelf", depth: 1, parentId: 2 },
];

const wrap = (ui: React.ReactElement) => {
  const client = new QueryClient();
  return render(<QueryClientProvider client={client}>{ui}</QueryClientProvider>);
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe("ParentPicker", () => {
  it("renders a disabled select with Loading\u2026 while loading", () => {
    mockUseAllNodes.mockReturnValue({ flatNodes: [], isLoading: true });
    wrap(<ParentPicker nodeId={1} value={null} onChange={vi.fn()} />);
    const select = screen.getByRole("combobox");
    expect(select).toBeDisabled();
    expect(select).toHaveTextContent("Loading\u2026");
  });

  it("renders 'No parent (root)' as first option", () => {
    mockUseAllNodes.mockReturnValue({ flatNodes: [], isLoading: false });
    wrap(<ParentPicker nodeId={1} value={null} onChange={vi.fn()} />);
    const options = screen.getAllByRole("option");
    expect(options[0]).toHaveTextContent("No parent (root)");
    expect(options[0]).toHaveValue("");
  });

  it("renders one option per flat node after the root option", () => {
    mockUseAllNodes.mockReturnValue({ flatNodes, isLoading: false });
    wrap(<ParentPicker nodeId={1} value={null} onChange={vi.fn()} />);
    const options = screen.getAllByRole("option");
    // First is "No parent", then 2 flat nodes
    expect(options).toHaveLength(3);
    expect(options[1]).toHaveValue("2");
    expect(options[2]).toHaveValue("3");
  });

  it("pre-selects the current value", () => {
    mockUseAllNodes.mockReturnValue({ flatNodes, isLoading: false });
    wrap(<ParentPicker nodeId={1} value={2} onChange={vi.fn()} />);
    expect(screen.getByRole("combobox")).toHaveValue("2");
  });

  it("selects 'No parent' when value is null", () => {
    mockUseAllNodes.mockReturnValue({ flatNodes, isLoading: false });
    wrap(<ParentPicker nodeId={1} value={null} onChange={vi.fn()} />);
    expect(screen.getByRole("combobox")).toHaveValue("");
  });

  it("calls onChange with null when 'No parent' option is selected", () => {
    mockUseAllNodes.mockReturnValue({ flatNodes, isLoading: false });
    const onChange = vi.fn();
    wrap(<ParentPicker nodeId={1} value={2} onChange={onChange} />);
    fireEvent.change(screen.getByRole("combobox"), { target: { value: "" } });
    expect(onChange).toHaveBeenCalledWith(null);
  });

  it("calls onChange with numeric id when a node option is selected", () => {
    mockUseAllNodes.mockReturnValue({ flatNodes, isLoading: false });
    const onChange = vi.fn();
    wrap(<ParentPicker nodeId={1} value={null} onChange={onChange} />);
    fireEvent.change(screen.getByRole("combobox"), { target: { value: "2" } });
    expect(onChange).toHaveBeenCalledWith(2);
  });

  it("calls useAllNodes with the nodeId to exclude it from options", () => {
    mockUseAllNodes.mockReturnValue({ flatNodes: [], isLoading: false });
    wrap(<ParentPicker nodeId={42} value={null} onChange={vi.fn()} />);
    expect(mockUseAllNodes).toHaveBeenCalledWith(42);
  });

  it("indents child nodes with non-breaking spaces", () => {
    mockUseAllNodes.mockReturnValue({ flatNodes, isLoading: false });
    wrap(<ParentPicker nodeId={1} value={null} onChange={vi.fn()} />);
    const options = screen.getAllByRole("option");
    // depth-0 node has no leading spaces
    expect(options[1].textContent).toBe("Attic");
    // depth-1 node has 2 non-breaking spaces
    expect(options[2].textContent).toBe("\u00A0\u00A0Shelf");
  });

  it("forwards id prop to the select element", () => {
    mockUseAllNodes.mockReturnValue({ flatNodes: [], isLoading: false });
    wrap(<ParentPicker id="node-parent" nodeId={1} value={null} onChange={vi.fn()} />);
    expect(screen.getByRole("combobox")).toHaveAttribute("id", "node-parent");
  });
});

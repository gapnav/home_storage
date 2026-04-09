import { render, screen, fireEvent } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { describe, expect, it, vi, beforeEach } from "vitest";
import type { Node } from "@/types/node";
import { SearchResults } from "./SearchResults";

vi.mock("@/hooks/useNodes", () => ({
  useSearchNodes: vi.fn(),
}));

import { useSearchNodes } from "@/hooks/useNodes";

const mockUseSearchNodes = vi.mocked(useSearchNodes);

const makeQueryMock = (overrides = {}) =>
  ({
    data: undefined,
    isLoading: false,
    error: null,
    ...overrides,
  }) as ReturnType<typeof useSearchNodes>;

const nodeA: Node = {
  id: 1,
  nodeType: "storage",
  title: "Box A",
  description: null,
  code: "BA1",
  parentId: null,
};

const nodeB: Node = {
  id: 2,
  nodeType: "thing",
  title: "Lamp",
  description: null,
  code: null,
  parentId: 1,
};

const wrap = (ui: React.ReactElement) => {
  const client = new QueryClient();
  return render(
    <QueryClientProvider client={client}>{ui}</QueryClientProvider>,
  );
};

const defaultProps = {
  onNavigate: vi.fn() as (id: number) => void,
  onEdit: vi.fn() as (node: Node) => void,
  onDelete: vi.fn() as (id: number) => void,
};

beforeEach(() => {
  vi.clearAllMocks();
  mockUseSearchNodes.mockReturnValue(makeQueryMock());
});

describe("SearchResults", () => {
  it("renders nothing when query is empty", () => {
    const { container } = wrap(
      <SearchResults query="" {...defaultProps} />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("renders nothing when query is only whitespace", () => {
    const { container } = wrap(
      <SearchResults query="   " {...defaultProps} />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("shows searching indicator while loading", () => {
    mockUseSearchNodes.mockReturnValue(makeQueryMock({ isLoading: true }));
    wrap(<SearchResults query="box" {...defaultProps} />);
    expect(screen.getByText("Searching…")).toBeInTheDocument();
  });

  it("shows error message on failure", () => {
    mockUseSearchNodes.mockReturnValue(
      makeQueryMock({ error: new Error("Network error") }),
    );
    wrap(<SearchResults query="box" {...defaultProps} />);
    expect(screen.getByRole("alert")).toHaveTextContent("Network error");
  });

  it("shows no-results message when data is empty", () => {
    mockUseSearchNodes.mockReturnValue(makeQueryMock({ data: [] }));
    wrap(<SearchResults query="xyz" {...defaultProps} />);
    expect(screen.getByText(/no results for/i)).toBeInTheDocument();
  });

  it("renders a row for each result", () => {
    mockUseSearchNodes.mockReturnValue(
      makeQueryMock({ data: [nodeA, nodeB] }),
    );
    wrap(<SearchResults query="box" {...defaultProps} />);
    expect(screen.getByText("Box A")).toBeInTheDocument();
    expect(screen.getByText("Lamp")).toBeInTheDocument();
  });

  it("calls onNavigate when a storage result title is clicked", () => {
    const onNavigate = vi.fn();
    mockUseSearchNodes.mockReturnValue(makeQueryMock({ data: [nodeA] }));
    wrap(
      <SearchResults
        query="box"
        onNavigate={onNavigate}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Box A" }));
    expect(onNavigate).toHaveBeenCalledWith(1);
  });

  it("calls onEdit when the edit button is clicked", () => {
    const onEdit = vi.fn();
    mockUseSearchNodes.mockReturnValue(makeQueryMock({ data: [nodeA] }));
    wrap(
      <SearchResults
        query="box"
        onNavigate={vi.fn()}
        onEdit={onEdit}
        onDelete={vi.fn()}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Edit Box A" }));
    expect(onEdit).toHaveBeenCalledWith(nodeA);
  });

  it("calls onDelete when the delete button is clicked", () => {
    const onDelete = vi.fn();
    mockUseSearchNodes.mockReturnValue(makeQueryMock({ data: [nodeA] }));
    wrap(
      <SearchResults
        query="box"
        onNavigate={vi.fn()}
        onEdit={vi.fn()}
        onDelete={onDelete}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Delete Box A" }));
    expect(onDelete).toHaveBeenCalledWith(nodeA.id);
  });
});

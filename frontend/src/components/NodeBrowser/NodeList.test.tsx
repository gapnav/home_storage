import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { Node } from "@/types/node";
import { NodeList } from "./NodeList";

vi.mock("@/components/icons", () => ({
  StorageIcon: () => <svg />,
  ThingIcon: () => <svg />,
  EditIcon: () => <svg />,
  DeleteIcon: () => <svg />,
}));

const nodeA: Node = {
  id: 1,
  nodeType: "storage",
  title: "Box A",
  description: null,
  code: null,
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

const defaultCallbacks = {
  onNavigate: vi.fn(),
  onEdit: vi.fn(),
  onDelete: vi.fn(),
};

describe("NodeList", () => {
  it("shows the loading message while loading", () => {
    render(
      <NodeList
        nodes={[]}
        isLoading={true}
        isError={false}
        emptyMessage="Nothing here."
        {...defaultCallbacks}
      />,
    );
    expect(screen.getByText("Loading…")).toBeInTheDocument();
  });

  it("shows a custom loading message", () => {
    render(
      <NodeList
        nodes={[]}
        isLoading={true}
        isError={false}
        emptyMessage="Nothing here."
        loadingMessage="Searching…"
        {...defaultCallbacks}
      />,
    );
    expect(screen.getByText("Searching…")).toBeInTheDocument();
  });

  it("shows the default error message when isError is true", () => {
    render(
      <NodeList
        nodes={[]}
        isLoading={false}
        isError={true}
        emptyMessage="Nothing here."
        {...defaultCallbacks}
      />,
    );
    expect(screen.getByRole("alert")).toHaveTextContent("Failed to load.");
  });

  it("shows a custom error message", () => {
    render(
      <NodeList
        nodes={[]}
        isLoading={false}
        isError={true}
        emptyMessage="Nothing here."
        errorMessage="Network error"
        {...defaultCallbacks}
      />,
    );
    expect(screen.getByRole("alert")).toHaveTextContent("Network error");
  });

  it("shows the empty message when nodes is empty", () => {
    render(
      <NodeList
        nodes={[]}
        isLoading={false}
        isError={false}
        emptyMessage="Nothing here yet."
        {...defaultCallbacks}
      />,
    );
    expect(screen.getByText("Nothing here yet.")).toBeInTheDocument();
  });

  it("renders a row for each node", () => {
    render(
      <NodeList
        nodes={[nodeA, nodeB]}
        isLoading={false}
        isError={false}
        emptyMessage="Nothing here."
        {...defaultCallbacks}
      />,
    );
    expect(screen.getByText("Box A")).toBeInTheDocument();
    expect(screen.getByText("Lamp")).toBeInTheDocument();
  });

  it("calls onNavigate when a storage node title is clicked", () => {
    const onNavigate = vi.fn();
    render(
      <NodeList
        nodes={[nodeA]}
        isLoading={false}
        isError={false}
        emptyMessage="Nothing here."
        onNavigate={onNavigate}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Box A" }));
    expect(onNavigate).toHaveBeenCalledWith(1);
  });

  it("calls onEdit with the node when edit is clicked", () => {
    const onEdit = vi.fn();
    render(
      <NodeList
        nodes={[nodeA]}
        isLoading={false}
        isError={false}
        emptyMessage="Nothing here."
        onNavigate={vi.fn()}
        onEdit={onEdit}
        onDelete={vi.fn()}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Edit Box A" }));
    expect(onEdit).toHaveBeenCalledWith(nodeA);
  });

  it("calls onDelete with the node id when delete is clicked", () => {
    const onDelete = vi.fn();
    render(
      <NodeList
        nodes={[nodeA]}
        isLoading={false}
        isError={false}
        emptyMessage="Nothing here."
        onNavigate={vi.fn()}
        onEdit={vi.fn()}
        onDelete={onDelete}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Delete Box A" }));
    expect(onDelete).toHaveBeenCalledWith(nodeA.id);
  });
});

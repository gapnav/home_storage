import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { Node } from "@/types/node";
import { NodeRow } from "./NodeRow";

const storageNode: Node = {
  id: 1,
  nodeType: "storage",
  title: "Shed",
  description: null,
  code: "S01",
  parentId: null,
};

const thingNode: Node = {
  id: 2,
  nodeType: "thing",
  title: "Drill",
  description: null,
  code: null,
  parentId: 1,
};

describe("NodeRow", () => {
  it("renders the node title", () => {
    render(
      <NodeRow
        node={storageNode}
        onNavigate={vi.fn()}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />,
    );
    expect(screen.getByText("Shed")).toBeInTheDocument();
  });

  it("renders code badge when code is present", () => {
    render(
      <NodeRow
        node={storageNode}
        onNavigate={vi.fn()}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />,
    );
    expect(screen.getByText("S01")).toBeInTheDocument();
  });

  it("does not render code badge when code is null", () => {
    render(
      <NodeRow
        node={thingNode}
        onNavigate={vi.fn()}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />,
    );
    expect(screen.queryByText("S01")).not.toBeInTheDocument();
  });

  it("renders storage node title as a button", () => {
    render(
      <NodeRow
        node={storageNode}
        onNavigate={vi.fn()}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />,
    );
    expect(screen.getByRole("button", { name: "Shed" })).toBeInTheDocument();
  });

  it("renders thing node title as plain text, not a button", () => {
    render(
      <NodeRow
        node={thingNode}
        onNavigate={vi.fn()}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />,
    );
    expect(
      screen.queryByRole("button", { name: "Drill" }),
    ).not.toBeInTheDocument();
    expect(screen.getByText("Drill")).toBeInTheDocument();
  });

  it("calls onNavigate with node id when storage title is clicked", () => {
    const onNavigate = vi.fn();
    render(
      <NodeRow
        node={storageNode}
        onNavigate={onNavigate}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Shed" }));
    expect(onNavigate).toHaveBeenCalledTimes(1);
    expect(onNavigate).toHaveBeenCalledWith(1);
  });

  it("calls onEdit with the node when edit button is clicked", () => {
    const onEdit = vi.fn();
    render(
      <NodeRow
        node={storageNode}
        onNavigate={vi.fn()}
        onEdit={onEdit}
        onDelete={vi.fn()}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Edit Shed" }));
    expect(onEdit).toHaveBeenCalledTimes(1);
    expect(onEdit).toHaveBeenCalledWith(storageNode);
  });

  it("renders path breadcrumb when path is provided", () => {
    render(
      <NodeRow
        node={thingNode}
        path={[{ id: 10, title: "Garage" }, { id: 11, title: "Shelf" }]}
        onNavigate={vi.fn()}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />,
    );
    expect(screen.getByText("Home / Garage / Shelf")).toBeInTheDocument();
  });

  it("does not render path breadcrumb when path is absent", () => {
    render(
      <NodeRow
        node={storageNode}
        onNavigate={vi.fn()}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />,
    );
    expect(screen.queryByText(/^Home \//)).not.toBeInTheDocument();
  });

  it("calls onDelete with node id when delete button is clicked", () => {
    const onDelete = vi.fn();
    render(
      <NodeRow
        node={storageNode}
        onNavigate={vi.fn()}
        onEdit={vi.fn()}
        onDelete={onDelete}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Delete Shed" }));
    expect(onDelete).toHaveBeenCalledTimes(1);
    expect(onDelete).toHaveBeenCalledWith(1);
  });
});

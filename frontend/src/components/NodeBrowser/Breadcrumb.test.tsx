import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Breadcrumb } from "./Breadcrumb";

describe("Breadcrumb", () => {
  it("always renders a Home button", () => {
    render(<Breadcrumb path={[]} onNavigate={vi.fn()} />);
    expect(screen.getByRole("button", { name: "Home" })).toBeInTheDocument();
  });

  it("calls onNavigate(null) exactly once when Home is clicked", async () => {
    const onNavigate = vi.fn();
    render(<Breadcrumb path={[]} onNavigate={onNavigate} />);
    await userEvent.click(screen.getByRole("button", { name: "Home" }));
    expect(onNavigate).toHaveBeenCalledTimes(1);
    expect(onNavigate).toHaveBeenCalledWith(null);
  });

  it("renders intermediate nodes as buttons and last node as plain text", () => {
    const path = [
      { id: 1, title: "Shed" },
      { id: 2, title: "Shelf A" },
      { id: 5, title: "Microwave box" },
    ];
    render(<Breadcrumb path={path} onNavigate={vi.fn()} />);
    expect(screen.getByRole("button", { name: "Shed" })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Shelf A" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Microwave box" }),
    ).not.toBeInTheDocument();
    expect(screen.getByText("Microwave box")).toBeInTheDocument();
  });

  it("renders a single-item path as plain text, not a button", () => {
    const path = [{ id: 5, title: "Microwave box" }];
    render(<Breadcrumb path={path} onNavigate={vi.fn()} />);
    expect(
      screen.queryByRole("button", { name: "Microwave box" }),
    ).not.toBeInTheDocument();
    expect(screen.getByText("Microwave box")).toBeInTheDocument();
  });

  it("calls onNavigate exactly once with the correct id for the first intermediate item", async () => {
    const onNavigate = vi.fn();
    const path = [
      { id: 1, title: "Shed" },
      { id: 2, title: "Shelf A" },
      { id: 5, title: "Microwave box" },
    ];
    render(<Breadcrumb path={path} onNavigate={onNavigate} />);
    await userEvent.click(screen.getByRole("button", { name: "Shed" }));
    expect(onNavigate).toHaveBeenCalledTimes(1);
    expect(onNavigate).toHaveBeenCalledWith(1);
  });

  it("calls onNavigate exactly once with the correct id for a middle intermediate item", async () => {
    const onNavigate = vi.fn();
    const path = [
      { id: 1, title: "Shed" },
      { id: 2, title: "Shelf A" },
      { id: 5, title: "Microwave box" },
    ];
    render(<Breadcrumb path={path} onNavigate={onNavigate} />);
    await userEvent.click(screen.getByRole("button", { name: "Shelf A" }));
    expect(onNavigate).toHaveBeenCalledTimes(1);
    expect(onNavigate).toHaveBeenCalledWith(2);
  });
});

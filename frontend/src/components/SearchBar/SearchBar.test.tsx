import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { SearchBar } from "./SearchBar";

describe("SearchBar", () => {
  it("renders a search input", () => {
    render(<SearchBar value="" onChange={vi.fn()} />);
    expect(screen.getByRole("searchbox")).toBeInTheDocument();
  });

  it("displays the current value", () => {
    render(<SearchBar value="shelf" onChange={vi.fn()} />);
    expect(screen.getByRole("searchbox")).toHaveValue("shelf");
  });

  it("calls onChange with new value when user types", () => {
    const onChange = vi.fn();
    render(<SearchBar value="" onChange={onChange} />);
    fireEvent.change(screen.getByRole("searchbox"), {
      target: { value: "box" },
    });
    expect(onChange).toHaveBeenCalledWith("box");
  });

  it("has an accessible label", () => {
    render(<SearchBar value="" onChange={vi.fn()} />);
    expect(screen.getByRole("searchbox", { name: /search/i })).toBeInTheDocument();
  });
});

import { useEffect, useState } from "react";
import type { Node, BreadcrumbItem } from "@/types/node";
import { StorageIcon, ThingIcon, EditIcon, DeleteIcon } from "@/components/icons";

interface Props {
  node: Node;
  path?: BreadcrumbItem[];
  onNavigate: (id: number) => void;
  onEdit: (node: Node) => void;
  onDelete: (id: number) => void;
}

export const NodeRow = ({ node, path, onNavigate, onEdit, onDelete }: Props) => {
  const isStorage = node.nodeType === "storage";
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    if (!confirming) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") setConfirming(false); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [confirming]);

  return (
    <li className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-zinc-800">
      <span className="shrink-0">
        {isStorage ? <StorageIcon /> : <ThingIcon />}
      </span>

      <span className="min-w-0 flex-1 flex flex-col">
        {isStorage ? (
          <button
            type="button"
            className="truncate text-left font-medium text-zinc-300 hover:text-blue-400 hover:underline"
            onClick={() => onNavigate(node.id)}
          >
            {node.title}
          </button>
        ) : (
          <span className="truncate font-medium text-zinc-300">
            {node.title}
          </span>
        )}
        {path && path.length > 0 && (
          <span className="truncate text-xs text-zinc-500">
            Home / {path.map((p) => p.title).join(" / ")}
          </span>
        )}
      </span>

      {node.code && (
        <span className="shrink-0 rounded bg-zinc-700 px-2 py-0.5 font-mono text-xs text-zinc-400">
          {node.code}
        </span>
      )}

      <span className="flex shrink-0 items-center gap-1">
        {confirming ? (
          <>
            <span className="text-xs text-zinc-400">Delete?</span>
            <button
              type="button"
              aria-label={`Confirm delete ${node.title}`}
              className="rounded px-2 py-1 text-xs font-medium text-red-500 hover:bg-red-950"
              onClick={() => { setConfirming(false); onDelete(node.id); }}
            >
              Yes
            </button>
            <button
              type="button"
              aria-label="Cancel delete"
              className="rounded px-2 py-1 text-xs font-medium text-zinc-400 hover:bg-zinc-700"
              onClick={() => setConfirming(false)}
            >
              No
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              aria-label={`Edit ${node.title}`}
              className="rounded p-1 text-zinc-500 hover:bg-zinc-700 hover:text-zinc-300"
              onClick={() => onEdit(node)}
            >
              <EditIcon />
            </button>
            <button
              type="button"
              aria-label={`Delete ${node.title}`}
              className="rounded p-1 text-zinc-500 hover:bg-red-950 hover:text-red-500"
              onClick={() => setConfirming(true)}
            >
              <DeleteIcon />
            </button>
          </>
        )}
      </span>
    </li>
  );
};

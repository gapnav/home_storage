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

  return (
    <li className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-gray-50">
      <span className="shrink-0">
        {isStorage ? <StorageIcon /> : <ThingIcon />}
      </span>

      <span className="min-w-0 flex-1 flex flex-col">
        {isStorage ? (
          <button
            type="button"
            className="truncate text-left font-medium text-gray-900 hover:text-blue-600 hover:underline"
            onClick={() => onNavigate(node.id)}
          >
            {node.title}
          </button>
        ) : (
          <span className="truncate font-medium text-gray-900">
            {node.title}
          </span>
        )}
        {path && path.length > 0 && (
          <span className="truncate text-xs text-gray-400">
            Home / {path.map((p) => p.title).join(" / ")}
          </span>
        )}
      </span>

      {node.code && (
        <span className="shrink-0 rounded bg-gray-100 px-2 py-0.5 font-mono text-xs text-gray-500">
          {node.code}
        </span>
      )}

      <span className="flex shrink-0 items-center gap-1">
        <button
          type="button"
          aria-label={`Edit ${node.title}`}
          className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
          onClick={() => onEdit(node)}
        >
          <EditIcon />
        </button>
        <button
          type="button"
          aria-label={`Delete ${node.title}`}
          className="rounded p-1 text-gray-400 hover:bg-red-50 hover:text-red-600"
          onClick={() => onDelete(node.id)}
        >
          <DeleteIcon />
        </button>
      </span>
    </li>
  );
};

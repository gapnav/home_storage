import type { Node, BreadcrumbItem } from "@/types/node";
import { NodeRow } from "./NodeRow";

interface Props {
  nodes: Array<Node & { path?: BreadcrumbItem[] }>;
  isLoading: boolean;
  isError: boolean;
  emptyMessage: string;
  loadingMessage?: string;
  errorMessage?: string;
  onNavigate: (id: number) => void;
  onEdit: (node: Node) => void;
  onDelete: (id: number) => void;
}

export const NodeList = ({
  nodes,
  isLoading,
  isError,
  emptyMessage,
  loadingMessage = "Loading…",
  errorMessage = "Failed to load.",
  onNavigate,
  onEdit,
  onDelete,
}: Props) => {
  if (isLoading) {
    return <p role="status" className="p-4 text-sm text-zinc-500">{loadingMessage}</p>;
  }

  if (isError) {
    return (
      <p role="alert" className="p-4 text-sm text-red-500">
        {errorMessage}
      </p>
    );
  }

  if (!nodes.length) {
    return (
      <p className="py-4 text-center text-sm text-zinc-500">{emptyMessage}</p>
    );
  }

  return (
    <ul className="divide-y divide-zinc-700">
      {nodes.map((node) => (
        <NodeRow
          key={node.id}
          node={node}
          path={node.path}
          onNavigate={onNavigate}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
};

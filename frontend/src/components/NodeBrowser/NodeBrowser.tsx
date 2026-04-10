import type { Node } from "@/types/node";
import { useNodes, useNode } from "@/hooks/useNodes";
import { Breadcrumb } from "./Breadcrumb";
import { NodeList } from "./NodeList";
import { PlusIcon } from "@/components/icons";

interface Props {
  currentNodeId: number | null;
  onNavigate: (id: number | null) => void;
  onCreateNode: (parentId: number | null) => void;
  onEditNode: (node: Node) => void;
  onDeleteNode: (id: number) => void;
}

export const NodeBrowser = ({ currentNodeId, onNavigate, onCreateNode, onEditNode, onDeleteNode }: Props) => {
  const childrenQuery = useNodes(currentNodeId);
  const detailQuery = useNode(currentNodeId);

  const isLoading = childrenQuery.isLoading;
  const isError = childrenQuery.isError;

  const children: Node[] = childrenQuery.data ?? [];

  const path =
    currentNodeId !== null ? (detailQuery.data?.path ?? []) : [];

  return (
    <div className="flex flex-col gap-4">
      {path.length > 0 && (
        <Breadcrumb path={path} onNavigate={onNavigate} />
      )}

      <NodeList
        nodes={children}
        isLoading={isLoading}
        isError={isError}
        emptyMessage="Nothing here yet."
        onNavigate={onNavigate}
        onEdit={onEditNode}
        onDelete={onDeleteNode}
      />

      <div className="flex justify-end">
        <button
          type="button"
          className="flex items-center gap-1 rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
          onClick={() => onCreateNode(currentNodeId)}
        >
          <PlusIcon />
          Add item
        </button>
      </div>
    </div>
  );
};

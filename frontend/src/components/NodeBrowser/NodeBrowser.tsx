import type { Node } from "@/types/node";
import { useNodes, useNode } from "@/hooks/useNodes";
import { Breadcrumb } from "./Breadcrumb";
import { NodeList } from "./NodeList";
import { PlusIcon } from "@/components/icons";
import { ActionButton } from "@/components/ui/ActionButton";

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
        <ActionButton className="flex items-center gap-1" onClick={() => onCreateNode(currentNodeId)}>
          <PlusIcon />
          Add item
        </ActionButton>
      </div>
    </div>
  );
};

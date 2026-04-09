import { useState } from "react";
import type { Node } from "@/types/node";
import { useNodes, useNode } from "@/hooks/useNodes";
import { Breadcrumb } from "./Breadcrumb";
import { NodeList } from "./NodeList";
import { PlusIcon } from "@/components/icons";

interface Props {
  onCreateNode: (parentId: number | null) => void;
  onEditNode: (node: Node) => void;
  onDeleteNode: (id: number) => void;
}

export const NodeBrowser = ({ onCreateNode, onEditNode, onDeleteNode }: Props) => {
  const [currentNodeId, setCurrentNodeId] = useState<number | null>(null);

  const rootQuery = useNodes(null, currentNodeId === null);
  const detailQuery = useNode(currentNodeId);

  const isLoading =
    currentNodeId === null ? rootQuery.isLoading : detailQuery.isLoading;
  const isError =
    currentNodeId === null ? rootQuery.isError : detailQuery.isError;

  const children: Node[] =
    currentNodeId === null
      ? (rootQuery.data ?? [])
      : (detailQuery.data?.children ?? []);

  const path =
    currentNodeId !== null ? (detailQuery.data?.path ?? []) : [];

  return (
    <div className="flex flex-col gap-4">
      {path.length > 0 && (
        <Breadcrumb path={path} onNavigate={setCurrentNodeId} />
      )}

      <NodeList
        nodes={children}
        isLoading={isLoading}
        isError={isError}
        emptyMessage="Nothing here yet."
        onNavigate={setCurrentNodeId}
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

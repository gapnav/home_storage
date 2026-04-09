import type { Node } from "@/types/node";
import { useSearchNodes } from "@/hooks/useNodes";
import { NodeList } from "@/components/NodeBrowser/NodeList";

interface Props {
  query: string;
  onDismiss: () => void;
  onEdit: (node: Node) => void;
  onDelete: (id: number) => void;
}

export const SearchResults = ({ query, onDismiss, onEdit, onDelete }: Props) => {
  const { data, isLoading, error } = useSearchNodes(query);

  if (!query.trim()) return null;

  return (
    <NodeList
      nodes={data ?? []}
      isLoading={isLoading}
      isError={error !== null}
      loadingMessage="Searching…"
      errorMessage={error?.message}
      emptyMessage={`No results for "${query}"`}
      onNavigate={onDismiss}
      onEdit={onEdit}
      onDelete={onDelete}
    />
  );
};

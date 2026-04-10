import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { Node } from "@/types/node";
import { useDeleteNode } from "@/hooks/useNodes";
import { useDebounce } from "@/hooks/useDebounce";
import { NodeBrowser } from "@/components/NodeBrowser/NodeBrowser";
import { NodeForm } from "@/components/NodeForm/NodeForm";
import { SearchBar } from "@/components/SearchBar/SearchBar";
import { SearchResults } from "@/components/SearchResults/SearchResults";

type FormState =
  | { mode: "create"; parentId: number | null }
  | { mode: "edit"; node: Node };

const queryClient = new QueryClient();

const AppContent = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedQuery = useDebounce(searchQuery, 300);
  const [currentNodeId, setCurrentNodeId] = useState<number | null>(null);
  const [formState, setFormState] = useState<FormState | null>(null);
  const deleteNode = useDeleteNode();

  const isSearching = debouncedQuery.trim().length > 0;

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Home Storage</h1>

      <div className="mb-4">
        <SearchBar value={searchQuery} onChange={setSearchQuery} />
      </div>

      {deleteNode.error && (
        <p role="alert" className="mb-4 text-sm text-red-600">
          {deleteNode.error.message}
        </p>
      )}

      {isSearching ? (
        <SearchResults
          query={debouncedQuery}
          onNavigate={(id) => { setCurrentNodeId(id); setSearchQuery(""); }}
          onEdit={(node) => setFormState({ mode: "edit", node })}
          onDelete={(id) => deleteNode.mutate(id)}
        />
      ) : (
        <NodeBrowser
          currentNodeId={currentNodeId}
          onNavigate={setCurrentNodeId}
          onCreateNode={(parentId) => setFormState({ mode: "create", parentId })}
          onEditNode={(node) => setFormState({ mode: "edit", node })}
          onDeleteNode={(id) => deleteNode.mutate(id)}
        />
      )}

      {formState !== null &&
        (formState.mode === "create" ? (
          <NodeForm
            mode="create"
            parentId={formState.parentId}
            onClose={() => setFormState(null)}
          />
        ) : (
          <NodeForm
            mode="edit"
            node={formState.node}
            onClose={() => setFormState(null)}
          />
        ))}
    </div>
  );
};

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
}

import { useEffect, useRef, useState } from "react";
import type { Node, NodeType } from "@/types/node";
import { useCreateNode, useUpdateNode } from "@/hooks/useNodes";
import { TextInput } from "@/components/ui/TextInput";
import { TextArea } from "@/components/ui/TextArea";
import { FieldLabel } from "@/components/ui/FieldLabel";
import { ActionButton } from "@/components/ui/ActionButton";
import { ParentPicker } from "./ParentPicker";

interface CreateProps {
  mode: "create";
  parentId: number | null;
  onClose: () => void;
}

interface EditProps {
  mode: "edit";
  node: Node;
  onClose: () => void;
}

type Props = CreateProps | EditProps;

export const NodeForm = (props: Props) => {
  const { mode, onClose } = props;

  const initial = mode === "edit" ? props.node : null;

  const [title, setTitle] = useState(initial?.title ?? "");
  const [nodeType, setNodeType] = useState<NodeType>("storage");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [code, setCode] = useState(initial?.code ?? "");
  const [parentId, setParentId] = useState<number | null>(initial?.parentId ?? null);

  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    dialogRef.current?.focus();
    return () => previouslyFocused?.focus();
  }, []);

  const createNode = useCreateNode();
  const updateNode = useUpdateNode();

  const isPending = createNode.isPending || updateNode.isPending;
  const error = createNode.error ?? updateNode.error;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (mode === "create") {
      createNode.mutate(
        {
          title,
          nodeType,
          parentId: props.parentId,
          description: description || null,
          code: code || null,
        },
        { onSuccess: onClose },
      );
    } else {
      updateNode.mutate(
        {
          id: props.node.id,
          params: {
            title,
            description: description || null,
            code: code || null,
            parentId,
          },
        },
        { onSuccess: onClose },
      );
    }
  };

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="node-form-title"
      tabIndex={-1}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 focus:outline-none"
    >
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <h2
          id="node-form-title"
          className="mb-4 text-lg font-semibold text-gray-900"
        >
          {mode === "create" ? "Add item" : "Edit item"}
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {mode === "create" && (
            <fieldset>
              <legend className="mb-1 text-sm font-medium text-gray-700">
                Type
              </legend>
              <div className="flex gap-4">
                {(["storage", "thing"] as NodeType[]).map((t) => (
                  <label key={t} className="flex items-center gap-2 text-sm">
                    <input
                      type="radio"
                      name="nodeType"
                      value={t}
                      checked={nodeType === t}
                      onChange={() => setNodeType(t)}
                    />
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </label>
                ))}
              </div>
            </fieldset>
          )}

          <div className="flex flex-col gap-1">
            <FieldLabel htmlFor="node-title">
              Title <span aria-hidden="true">*</span>
            </FieldLabel>
            <TextInput
              id="node-title"
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {mode === "edit" && (
            <div className="flex flex-col gap-1">
              <FieldLabel htmlFor="node-parent">Parent</FieldLabel>
              <ParentPicker
                id="node-parent"
                nodeId={props.node.id}
                value={parentId}
                onChange={setParentId}
              />
            </div>
          )}

          <div className="flex flex-col gap-1">
            <FieldLabel htmlFor="node-description">Description</FieldLabel>
            <TextArea
              id="node-description"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1">
            <FieldLabel htmlFor="node-code">Code</FieldLabel>
            <TextInput
              id="node-code"
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
          </div>

          {error && (
            <p role="alert" className="text-sm text-red-600">
              {error.message}
            </p>
          )}

          <div className="flex justify-end gap-2">
            <ActionButton variant="secondary" onClick={onClose} disabled={isPending}>
              Cancel
            </ActionButton>
            <ActionButton type="submit" disabled={isPending}>
              {isPending ? "Saving…" : "Save"}
            </ActionButton>
          </div>
        </form>
      </div>
    </div>
  );
};

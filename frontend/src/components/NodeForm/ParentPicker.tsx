import { useAllNodes } from "@/hooks/useAllNodes";

interface Props {
  id?: string;
  nodeId: number;
  value: number | null;
  onChange: (parentId: number | null) => void;
}

const selectClasses =
  "rounded-md border border-zinc-700 bg-zinc-700 px-3 py-2 text-sm text-zinc-300 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500";

export const ParentPicker = ({ id, nodeId, value, onChange }: Props) => {
  const { flatNodes, isLoading } = useAllNodes(nodeId);

  if (isLoading) {
    return (
      <select id={id} disabled className={selectClasses}>
        <option>{"Loading\u2026"}</option>
      </select>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    onChange(val === "" ? null : Number(val));
  };

  return (
    <select
      id={id}
      value={value === null ? "" : String(value)}
      onChange={handleChange}
      className={selectClasses}
    >
      <option value="">No parent (root)</option>
      {flatNodes.map((node) => (
        <option key={node.id} value={String(node.id)}>
          {"\u00A0\u00A0".repeat(node.depth)}
          {node.title}
        </option>
      ))}
    </select>
  );
};

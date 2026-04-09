import { TextInput } from "@/components/ui/TextInput";

interface Props {
  value: string;
  onChange: (q: string) => void;
}

export const SearchBar = ({ value, onChange }: Props) => (
  <TextInput
    type="search"
    placeholder="Search items…"
    value={value}
    onChange={(e) => onChange(e.target.value)}
    aria-label="Search"
    className="w-full"
  />
);

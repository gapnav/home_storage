type Props = React.InputHTMLAttributes<HTMLInputElement>;

export const TextInput = ({ className = "", ...props }: Props) => (
  <input
    className={`rounded-md border border-zinc-700 bg-zinc-700 px-3 py-2 text-sm text-zinc-300 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 ${className}`}
    {...props}
  />
);

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
}

const variantClasses: Record<NonNullable<Props["variant"]>, string> = {
  primary:
    "rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50",
  secondary:
    "rounded-md border border-zinc-700 px-4 py-2 text-sm font-medium text-zinc-300 hover:bg-zinc-700 disabled:opacity-50",
};

export const ActionButton = ({
  variant = "primary",
  className = "",
  ...props
}: Props) => (
  <button
    type="button"
    className={`${variantClasses[variant]} ${className}`}
    {...props}
  />
);

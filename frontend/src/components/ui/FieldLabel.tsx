type Props = React.LabelHTMLAttributes<HTMLLabelElement>;

export const FieldLabel = ({ className = "", ...props }: Props) => (
  <label
    className={`text-sm font-medium text-zinc-300 ${className}`}
    {...props}
  />
);

type Props = React.LabelHTMLAttributes<HTMLLabelElement>;

export const FieldLabel = ({ className = "", ...props }: Props) => (
  <label
    className={`text-sm font-medium text-gray-700 ${className}`}
    {...props}
  />
);

type Props = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export const TextArea = ({ className = "", ...props }: Props) => (
  <textarea
    className={`rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 ${className}`}
    {...props}
  />
);

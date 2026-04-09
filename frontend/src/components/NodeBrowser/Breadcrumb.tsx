import type { BreadcrumbItem } from "@/types/node";

interface Props {
  path: BreadcrumbItem[];
  onNavigate: (id: number | null) => void;
}

export const Breadcrumb = ({ path, onNavigate }: Props) => {
  return (
    <nav aria-label="breadcrumb">
      <ol className="flex items-center gap-1 text-sm text-gray-600">
        <li>
          <button
            type="button"
            className="hover:text-gray-900 hover:underline"
            onClick={() => onNavigate(null)}
          >
            Home
          </button>
        </li>
        {path.map((item, index) => {
          const isLast = index === path.length - 1;
          return (
            <li key={item.id} className="flex items-center gap-1">
              <span className="text-gray-400">/</span>
              {isLast ? (
                <span
                  aria-current="page"
                  className="font-medium text-gray-900"
                >
                  {item.title}
                </span>
              ) : (
                <button
                  type="button"
                  className="hover:text-gray-900 hover:underline"
                  onClick={() => onNavigate(item.id)}
                >
                  {item.title}
                </button>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

interface Props {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}

export default function Pagination({
  page,
  totalPages,
  onChange,
}: Props) {
  if (totalPages <= 1) return null;

  const getPages = () => {
    const pages: number[] = [];

    const start = Math.max(1, page - 1);
    const end = Math.min(totalPages, page + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  };

  return (
    <div className="mt-6 flex  flex-row items-center justify-center  sm:justify-end gap-3">

      {/* Prev Button */}
      <button
        className="btn btn-sm"
        disabled={page === 1}
        onClick={() => onChange(page - 1)}
      >
        <span className="hidden sm:inline">Prev</span>
        <span className="sm:hidden">‹</span>
      </button>

      {/* Page Numbers */}
      <div className="flex items-center gap-1">
        {getPages().map((p) => (
          <button
            key={p}
            onClick={() => onChange(p)}
            className={`btn btn-sm ${
              p === page
                ? "btn-primary"
                : "btn-ghost"
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      {/* Next Button */}
      <button
        className="btn btn-sm"
        disabled={page === totalPages}
        onClick={() => onChange(page + 1)}
      >
        <span className="hidden sm:inline">Next</span>
        <span className="sm:hidden">›</span>
      </button>

      {/* Desktop Info */}
      <div className="hidden sm:flex text-sm text-base-content/60 ml-3">
        Page {page} of {totalPages}
      </div>
    </div>
  );
}
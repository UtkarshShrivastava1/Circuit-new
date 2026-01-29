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
  return (
    <div className="flex justify-end gap-2 mt-4">
      <button
        className="btn btn-sm"
        disabled={page === 1}
        onClick={() => onChange(page - 1)}
      >
        Prev
      </button>

      <span className="text-sm text-base-content/70 flex items-center">
        Page {page} of {totalPages}
      </span>

      <button
        className="btn btn-sm"
        disabled={page === totalPages}
        onClick={() => onChange(page + 1)}
      >
        Next
      </button>
    </div>
  );
}

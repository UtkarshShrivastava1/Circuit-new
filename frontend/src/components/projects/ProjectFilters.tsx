type Filter = "all" | "active" | "completed" | "on-hold";

interface Props {
  value: Filter;
  onChange: (v: Filter) => void;
}

export default function ProjectFilters({ value, onChange }: Props) {
  return (
    <div className="tabs tabs-boxed bg-base-200 w-fit mb-4">
      {(["all", "active", "completed", "on-hold"] as Filter[]).map(
        (f) => (
          <button
            key={f}
            className={`tab ${value === f ? "tab-active" : ""}`}
            onClick={() => onChange(f)}
          >
            {f.replace("-", " ")}
          </button>
        )
      )}
    </div>
  );
}

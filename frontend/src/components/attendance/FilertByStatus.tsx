type Status = "all" | "approved" | "pending" | "rejected";

interface Props {
  value: Status;
  onChange: (value: Status) => void;
}

export function StatusPills({ value, onChange }: Props) {
  const items: { id: Status; label: string }[] = [
    { id: "all", label: "All" },
    { id: "approved", label: "Approved" },
    { id: "pending", label: "Pending" },
    { id: "rejected", label: "Rejected" },
  ];

  return (
    <div className="flex gap-2 flex-wrap">
      {items.map((item) => (
        <button
          key={item.id}
          onClick={() => onChange(item.id)}
          className={`px-3 py-1.5 rounded-full text-sm border transition
            ${
              value === item.id
                ? "bg-primary text-primary-content border-primary"
                : "bg-base-100 border-base-300 hover:bg-base-200"
            }`}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}

interface StatusBadgeProps {
  status: "pending" | "approved" | "rejected"| "Paid" | "Unpaid" | "generate";
  size?: "sm" | "md";
}

const STATUS_CONFIG = {
  pending: {
    label: "Pending",
    icon: "",
    className: "bg-warning/20 text-warning border-warning/30",
  },
  approved: {
    label: "Approved",
    icon: "",
    className: "bg-success/20 text-success border-success/30",
  },
  rejected: {
    label: "Rejected",
    icon: "",
    className: "bg-error/20 text-error border-error/30",
  },
  Paid: {
    label: "Paid",
    icon: "",
    className: "bg-success/20 text-success border-success/30",
  },
  Unpaid: {
    label: "Unpaid",
    icon: "",
    className: "bg-error/20 text-error border-error/30",
  },
  generated: {
    label :"Generate",
    icon : "",
    className: "bg-warning/20 text-warning border-warning/30"
  },
  

};

export default function StatusBadge({
  status,
  size = "sm",
}: StatusBadgeProps) {
  const config = STATUS_CONFIG[status];

  return (
    <span
      className={`
        inline-flex items-center gap-1
        rounded-full border
        ${size === "sm" ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-sm"}
        font-medium
        ${config.className}
      `}
    >
      <span>{config.icon}</span>
      {config.label}
    </span>
  );
}

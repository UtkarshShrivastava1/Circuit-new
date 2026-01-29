interface StatusBadgeProps {
  status: "pending" | "approved" | "rejected";
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const styles = {
    pending: "badge-warning",
    approved: "badge-success",
    rejected: "badge-error",
  };

  return (
    <span className={`badge badge-sm px-2 py-2  ${styles[status]}`}>
      {status}
    </span>
  );
}

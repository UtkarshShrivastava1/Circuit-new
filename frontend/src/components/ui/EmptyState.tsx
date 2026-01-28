interface EmptyStateProps {
  message?: string;
}

export default function EmptyState({
  message = "No data available",
}: EmptyStateProps) {
  return (
    <div className="text-center p-10 text-base-content/60">
      {message}
    </div>
  );
}

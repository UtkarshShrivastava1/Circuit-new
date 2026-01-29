interface EmptyStateProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export default function EmptyState({
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center border border-dashed border-base-300 rounded-lg p-10 bg-base-100">
      <h3 className="font-medium text-base-content">
        {title}
      </h3>

      {description && (
        <p className="text-sm text-base-content/60 mt-1">
          {description}
        </p>
      )}

      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

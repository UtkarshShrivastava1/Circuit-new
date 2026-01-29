interface StatCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  helperText?: string;
}

export default function StatCard({
  title,
  value,
  icon,
  helperText,
}: StatCardProps) {
  return (
    <div className="bg-base-100 border border-base-300 rounded-lg p-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-base-content/60">{title}</p>
        {icon && <div className="text-primary">{icon}</div>}
      </div>

      <p className="text-2xl font-semibold text-base-content mt-2">
        {value}
      </p>

      {helperText && (
        <p className="text-xs text-base-content/50 mt-1">
          {helperText}
        </p>
      )}
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string | number;
 text?: "success" | "warning" | "info" | "error";
  icon?: React.ReactNode;
  helperText?: string;
  variant?: "success" | "warning" | "info" | "error";
}

export default function StatCard({
  title,
  value,
  icon,
  helperText,
  text,
   variant,
}: StatCardProps) {


  const variantClass = variant
    ? `border-${variant} text-${variant}`
    : "border-base-300";

    const textClass = text ? `text-${text}` : "text-base-content";
  return (
    <div className={`bg-base-100 border ${variantClass} rounded-lg p-4`}>
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-base-content/100">{title}</p>
        {icon && <div className="text-primary">{icon}</div>}
      </div>

      <p className={`text-2xl font-semibold ${textClass} mt-2`}>
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

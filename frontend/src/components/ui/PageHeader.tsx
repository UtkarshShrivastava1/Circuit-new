interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export default function PageHeader({
  title,
  subtitle,
  action,
}: PageHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6 text-base-content">
      <div>
        <h1 className="text-xl font-semibold text-base-content dark:text-base-100">
          {title}
        </h1>
        {subtitle && (
          <p className="text-sm text-base-content/60 mt-1 dark:text-base-200">
            {subtitle}
          </p>
        )}
      </div>

      {action && <div>{action}</div>}
    </div>
  );
}

import type { ReactNode } from "react";

interface Props {
  title?: string;
  children: ReactNode;
}

export default function PageContainer({ title, children }: Props) {
  return (
    <div className="p-6">
      {title && <h1 className="text-2xl font-semibold mb-4">{title}</h1>}
      {children}
    </div>
  );
}

import type { ReactNode } from "react";

interface TableProps {
  headers: ReactNode[];
  children: ReactNode; 
}

export default function Table({ headers, children }: TableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="table table-zebra w-full">
        <thead>
          <tr>
            {headers.map((h,i) => (
                <th key={i}>{h}</th> 
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

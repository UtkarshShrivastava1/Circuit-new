import type { ReactNode } from "react";

interface TableProps {
  headers: ReactNode[];
  children: ReactNode; 
}

export default function Table({ headers, children }: TableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="table table-zebra w-full border-2 border-base-300 rounded-lg">
        <thead>
          <tr className="bg-base-300 text-base-content uppercase">
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

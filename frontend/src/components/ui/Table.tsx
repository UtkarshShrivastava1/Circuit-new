import type { ReactNode } from "react";

interface TableProps {
  headers: ReactNode[];
  children: ReactNode; 
}

export default function Table({ headers, children }: TableProps) {
  return (
    <div className="overflow-x-auto rounded-lg">
      <table className="table table-zebra w-full border-2 border-primary/40 rounded-lg ">
        <thead className="rounded-lg ">
          <tr className="bg-primary text-primary-content uppercase">
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

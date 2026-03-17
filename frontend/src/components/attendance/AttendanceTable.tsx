import { useState } from "react";
import StatusBadge from "../ui/StatusBadge";
import Button from "../ui/Button";
import type { AttendanceRecord } from "../../type/attendance";
import Table from "../ui/Table";



interface Props {
  records: AttendanceRecord[];
  role: UserRole;
}


export default function AttendanceTable({ records, role }: Props) {
  const isAdmin = role === "admin";
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const selectableRecords = records.filter(
    (r) => r.status === "pending"
  );

  const allSelected =
    selectableRecords.length > 0 &&
    selectableRecords.every((r) => selectedIds.includes(r.id));

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    setSelectedIds(
      allSelected ? [] : selectableRecords.map((r) => r.id)
    );
  };

  return (
    <div className="bg-base-100 border border-base-300 rounded-lg overflow-hidden">
     <div className="overflow-x-auto">
      {/* ✅ Bulk Action Bar (ADMIN ONLY) */}
      {isAdmin && selectedIds.length > 0 && (
        <div className="sticky bottom-0 z-10 bg-base-200 border-t border-base-300 px-4 py-3 flex justify-between items-center">
          <span className="text-sm">{selectedIds.length} selected</span>
          <div className="flex gap-2">
            <Button variant="primary">Approve</Button>
            <Button variant="error">Reject</Button>
          </div>
        </div>
      )}
     


      <Table
        headers={[
          ...(isAdmin
            ? [
                <input
                  type="checkbox"
                  checked={allSelected}
                  disabled={selectableRecords.length === 0}
                  onChange={toggleSelectAll}
                />,
              ]
            : []),
          "Employee",
          "Date",
          "Check In",
          "Status",
          ...(isAdmin ? ["Action"] : []),
        ]}
      >
        {records.map((r) => (
          <tr key={r.id} className="text-base-content text-sm">

            {/* ✅ Checkbox only for admin */}
            {isAdmin && (
              <td>
                <input
                  type="checkbox"
                  checked={selectedIds.includes(r.id)}
                  disabled={r.status !== "pending"}
                  onChange={() => toggleSelect(r.id)}
                />
              </td>
            )}

            <td>{r.employee}</td>
            <td>{r.date}</td>
            <td>{r.checkIn}</td>

            <td>
              <StatusBadge status={r.status} />
            </td>

            {/* ✅ Action column only for admin */}
            {isAdmin && (
              <td className="text-right">
                {r.status === "pending" && (
                  <div className="flex justify-end gap-2">
                    <Button size="xs" variant="primary">
                      Approve
                    </Button>
                    <Button size="xs" variant="error">
                      Reject
                    </Button>
                  </div>
                )}
                {r.status === "rejected" && (
                  <div className="flex justify-end gap-2">
                    <Button size="xs" variant="primary">
                      Approve
                    </Button>
                  </div>
                )}
                {r.status === "approved" && (
                  <div className="flex justify-end gap-2">
                    <Button size="xs" variant="error">
                      Reject
                    </Button>
                  </div>
                )}
              </td>
            )}
          </tr>
        ))}
      </Table>
      </div>
    </div>
  );
}








{/* <table className="table table-zebra w-full">
        <thead>
          <tr>
            <th>
              <input
                type="checkbox"
                checked={allSelected}
                disabled={selectableRecords.length === 0}
                onChange={toggleSelectAll}
              />
            </th>
            <th>Employee</th>
            <th>Date</th>
            <th>Check In</th>
            <th>Status</th>
            <th className="text-right">Action</th>
          </tr>
        </thead>

        <tbody>
          {records.map((r) => {
            const isSelectable = r.status === "pending";

            return (
              <tr key={r.id} className="text-base-content">
                <td>
                  <input
                    type="checkbox"
                    disabled={!isSelectable}
                    checked={selectedIds.includes(r.id)}
                    onChange={() => toggleSelect(r.id)}
                  />
                </td>

                <td>{r.employee}</td>
                <td>{r.date}</td>
                <td>{r.checkIn}</td>

                <td>
                  <StatusBadge status={r.status} />
                </td>

                <td className="text-right">
                  {r.status === "pending" && (
                    <div className="flex justify-end gap-2">
                      <Button variant="primary" size="xs">
                        Approve
                      </Button>
                      <Button variant="error" size="xs">
                        Reject
                      </Button>
                    </div>
                  )}

                  {r.status === "approved" && (
                    <Button variant="error" size="xs">
                      Reject
                    </Button>
                  )}

                  {r.status === "rejected" && (
                    <Button variant="primary" size="xs">
                      Approve
                    </Button>
                  )}
                </td>
                
              </tr>
            );
          })}
        </tbody>
      </table> */}
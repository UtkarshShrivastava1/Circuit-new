import { useState } from "react";
import StatusBadge from "../ui/StatusBadge";
import Button from "../ui/Button";
import type { AttendanceRecord } from "../../type/attendance";

interface Props {
  records: AttendanceRecord[];
}

export default function AttendanceTable({ records }: Props) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // ✅ Only pending records are selectable
  const selectableRecords = records.filter(
    (r) => r.status === "pending"
  );

  const allSelected =
    selectableRecords.length > 0 &&
    selectableRecords.every((r) =>
      selectedIds.includes(r.id)
    );

  /* ---------- Selection handlers ---------- */

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(selectableRecords.map((r) => r.id));
    }
  };

  /* ---------- Bulk actions ---------- */

  const approveSelected = () => {
    console.log("Approve:", selectedIds);
    setSelectedIds([]);
  };

  const rejectSelected = () => {
    console.log("Reject:", selectedIds);
    setSelectedIds([]);
  };

  return (
    <div className="bg-base-100 border border-base-300 rounded-lg overflow-hidden">
      <table className="table table-zebra w-full">
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
      </table>

      {/* ✅ Bulk Action Bar */}
      {selectedIds.length > 0 && (
        <div className="flex items-center justify-between gap-4 bg-base-200 border-t border-base-300 px-4 py-3">
          <span className="text-sm text-base-content/70">
            {selectedIds.length} selected
          </span>

          <div className="flex gap-2">
            <Button variant="primary" onClick={approveSelected}>
              Approve Selected
            </Button>
            <Button variant="error" onClick={rejectSelected}>
              Reject Selected
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

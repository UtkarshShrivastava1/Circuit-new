import { useState } from "react";
import StatusBadge from "../ui/StatusBadge";
import Button from "../ui/Button";
import type { AttendanceRecord, UserRole } from "../../type/attendance";
import Table from "../ui/Table";
import { useAuth } from "@/auth/AuthContext";
import { approveAttendance } from "@/services/attendanceService";
import { toast } from "react-toastify";

interface Props {
  records: (AttendanceRecord & { attendanceDocId: string; employeeId: string })[];
  role: UserRole;
  onUpdate: () => void;
}


export default function AttendanceTable({ records, role, onUpdate }: Props) {
  const isAdmin = role === "admin" || role === "owner";
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const { auth } = useAuth();

  const handleApproval = async (
    attendanceDocId: string,
    employeeId: string,
    status: "PRESENT" | "ABSENT"
  ) => {
    if (!auth?.slug) return;
    await toast.promise(
      approveAttendance(auth.slug, attendanceDocId, { employeeId, status }),
      {
        pending: "Updating status...",
        success: "Status updated!",
        error: "Update failed.",
      }
    );
    onUpdate();
  };

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

  const handleBulkAction = async (status: "PRESENT" | "ABSENT") => {
    if (!auth?.slug) return;
    const selectedRecords = records.filter((r) => selectedIds.includes(r.id));

    const promises = selectedRecords.map((rec) =>
      approveAttendance(auth.slug!, rec.attendanceDocId, { employeeId: rec.employeeId, status })
    );

    await toast.promise(Promise.all(promises), {
      pending: `Updating ${promises.length} records...`,
      success: `${promises.length} records updated successfully!`,
      error: "Some updates failed. Please review.",
    });
    onUpdate();
    setSelectedIds([]);
  };

   

  return (
    <div className="bg-base-100 border border-base-300 rounded-lg overflow-hidden">
     <div className="overflow-x-auto">
      {/* ✅ Bulk Action Bar (ADMIN ONLY) */}
      {isAdmin && selectedIds.length > 0 && (
        <div className="sticky bottom-0 z-10 bg-base-200 border-t border-base-300 px-4 py-3 flex justify-between items-center">
          <span className="text-sm">{selectedIds.length} selected</span>
          <div className="flex gap-2">
            <Button variant="primary" onClick={() => handleBulkAction("PRESENT")}>Approve</Button>
            <Button variant="error" onClick={() => handleBulkAction("ABSENT")}>Reject</Button>
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
                    <Button size="xs" variant="primary" onClick={() => handleApproval(r.attendanceDocId, r.employeeId, "PRESENT")}>
                      Present
                    </Button>
                    <Button size="xs" variant="error" onClick={() => handleApproval(r.attendanceDocId, r.employeeId, "ABSENT")}>
                      Absent
                    </Button>
                  </div>
                )}
                {r.status === "rejected" && (
                  <div className="flex justify-end gap-2">
                    <Button size="xs" variant="primary" onClick={() => handleApproval(r.attendanceDocId, r.employeeId, "PRESENT")}>
                      Present
                    </Button>
                  </div>
                )}
                {r.status === "approved" && (
                  <div className="flex justify-end gap-2">
                    <Button size="xs" variant="error" onClick={() => handleApproval(r.attendanceDocId, r.employeeId, "ABSENT")}>
                     Absent
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
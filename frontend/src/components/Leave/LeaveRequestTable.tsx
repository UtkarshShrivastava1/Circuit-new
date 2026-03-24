import Button from "@/components/ui/Button";
import StatusBadge from "@/components/ui/StatusBadge";
import type { LeaveRequest } from "@/type/leave";
import { leaveTypeIcon } from "@/type/leave";
import { useState } from "react";

interface Props {
  requests: LeaveRequest[];
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onBulkApprove?: (ids: string[]) => void;
  onBulkReject?: (ids: string[]) => void;
}


export default function LeaveRequestTable({
  requests,
  onApprove,
  onReject,
  onBulkApprove,
  onBulkReject,
}: Props) {
  if (requests.length === 0) {
    return (
      <div className="text-center text-sm text-base-content/60 p-6">
        No leave requests found
      </div>
    );
  }

  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(requests.map((r) => r.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
    if (e.target.checked) {
      setSelectedIds((prev) => [...prev, id]);
    } else {
      setSelectedIds((prev) => prev.filter((selectedId) => selectedId !== id));
    }
  };

  const handleBulkApprove = () => {
    if (onBulkApprove) {
      onBulkApprove(selectedIds);
      setSelectedIds([]);
    }
  };

  const handleBulkReject = () => {
    if (onBulkReject) {
      onBulkReject(selectedIds);
      setSelectedIds([]);
    }
  };


  return (
    <>
      {selectedIds.length > 0 && (
        <div className="flex gap-2 mb-4 bg-base-200 p-3 rounded-lg items-center justify-between">
          <span className="text-sm font-medium">{selectedIds.length} selected</span>
          <div className="flex gap-2">
            <Button size="sm" variant="primary" onClick={handleBulkApprove}>
              Approve Selected
            </Button>
            <Button size="sm" variant="error" onClick={handleBulkReject}>
              Reject Selected
            </Button>
          </div>
        </div>
      )}

      {/* ================= DESKTOP TABLE ================= */}
      <div className="hidden md:block bg-base-100 border border-base-300 rounded-lg overflow-hidden">
        <table className="table table-zebra w-full text-base-content">
          <thead>
            <tr>
              <th>
                <input type="checkbox" 
                checked={selectedIds.length === requests.length && requests.length > 0}
                onChange={handleSelectAll}
                className="checkbox checkbox-sm checkbox-base-content-300"
                />
              </th>
              <th>Employee</th>
              <th>Leave Type</th>
              <th>Dates</th>
              <th>Status</th>
              <th className="text-right">Action</th>
            </tr>
          </thead>

          <tbody> 
            {requests.map((r) => {
              const Icon = leaveTypeIcon[r.type];
              return (
                <tr key={r.id}>
                  <td className="font-medium">

                    <input type="checkbox"
                      checked={selectedIds.includes(r.id)}
                      onChange={(e) => handleSelectOne(e, r.id)}
                      className="checkbox checkbox-sm"
                    />
                  </td>
                  <td className="font-medium">{r.employee}</td>

                  <td className="flex items-center gap-2">
                    <Icon />
                    <span className="capitalize">{r.type}</span>
                  </td>

                  <td>
                    {r.fromDate}
                    {r.toDate && ` → ${r.toDate}`}
                  </td>

                  <td>
                    <StatusBadge status={r.status} />
                  </td>

                  <td className="text-right">
                    <div className="flex justify-end gap-2">
                      {(r.status === "pending" || r.status === "rejected") && (
                        <Button
                          size="xs"
                          variant="primary"
                          onClick={() => onApprove(r.id)}
                        >
                          Approve
                        </Button>
                      )}
                      {(r.status === "pending" || r.status === "approved") && (
                        <Button
                          size="xs"
                          variant="error"
                          onClick={() => onReject(r.id)}
                        >
                          Reject
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ================= MOBILE CARDS ================= */}
      <div className="md:hidden space-y-3">
        {requests.map((r) => {
          const Icon = leaveTypeIcon[r.type];
          return (
            <div
              key={r.id}
              className="bg-base-100 border border-base-300 rounded-xl p-4 space-y-3"
            >
              <div className="flex justify-between items-start">
                <div className="flex gap-3">
                  <input type="checkbox"
                    checked={selectedIds.includes(r.id)}
                    onChange={(e) => handleSelectOne(e, r.id)}
                    className="checkbox checkbox-sm mt-1"
                  />
                  <div>
                    <p className="font-semibold">{r.employee}</p>
                    <div className="flex items-center gap-2 text-sm text-base-content/60">
                      <Icon />
                      <span className="capitalize">{r.type}</span>
                    </div>
                  </div>
                </div>

                <StatusBadge status={r.status} />
              </div>

              <div className="text-sm">
                <span className="text-base-content/60">Dates:</span>{" "}
                {r.fromDate}
                {r.toDate && ` → ${r.toDate}`}
              </div>

              {(r.status === "pending" || r.status === "approved" || r.status === "rejected") && (
                <div className="flex gap-2 pt-2">
                  {(r.status === "pending" || r.status === "rejected") && (
                    <Button
                      className="flex-1"
                      size="sm"
                      variant="primary"
                      onClick={() => onApprove(r.id)}
                    >
                      Approve
                    </Button>
                  )}
                  {(r.status === "pending" || r.status === "approved") && (
                    <Button
                      className="flex-1"
                      size="sm"
                      variant="error"
                      onClick={() => onReject(r.id)}
                    >
                      Reject
                    </Button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}

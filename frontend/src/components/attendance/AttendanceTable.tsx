import StatusBadge from "../ui/StatusBadge";
import type { AttendanceRecord } from "../../type/attendance";

interface Props {
  records: AttendanceRecord[];
}

export default function AttendanceTable({ records }: Props) {
  return (
    <div className="bg-base-100 border border-base-300 rounded-lg overflow-hidden">
      <table className="table table-zebra w-full">
        <thead>
          <tr>
            <th>Employee</th>
            <th>Date</th>
            <th>Check In</th>
            <th>Status</th>
            <th className="text-right">Action</th>
          </tr>
        </thead>

        <tbody>
          {records.map((r) => (
            <tr key={r.id} className="text-base-content">
              <td>{r.employee}</td>
              <td>{r.date}</td>
              <td>{r.checkIn}</td>
              <td>
                <StatusBadge status={r.status} />
              </td>
              <td className="text-right">
                {r.status === "pending" && (
                  <div className="flex justify-end gap-2">
                    <button className="btn btn-xs btn-success">
                      Approve
                    </button>
                    <button className="btn btn-xs btn-error">
                      Reject
                    </button>
                  </div>
                )}

                {r.status === "approved" && (
                  <button className="btn btn-xs btn-error">
                    Reject
                  </button>
                )}

                {r.status === "rejected" && (
                  <button className="btn btn-xs btn-success">
                    Approve
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

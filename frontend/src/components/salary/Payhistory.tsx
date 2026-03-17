import { useState } from "react";
import type { PayrollRecord } from "../../type/payslip";
import { MOCK_PAYROLL } from "../../mock/payroll";
import { MdDownload, MdVisibility, MdFilterList } from "react-icons/md";
import Button from "@/components/ui/Button";
import Select from "@/components/ui/Select";
import Input from "@/components/ui/Input";
import StatusBadge from "../ui/StatusBadge";

/* ---------------- COMPONENT ---------------- */

export default function PayrollHistory() {
  const [records] = useState<PayrollRecord[]>(MOCK_PAYROLL);
  const [monthFilter, setMonthFilter] = useState("");
  const [search, setSearch] = useState("");

  const filtered = records.filter((r) => {
    const matchesMonth = monthFilter ? r.month === monthFilter : true;

    const matchesSearch = r.employeeName
      .toLowerCase()
      .includes(search.toLowerCase());

    return matchesMonth && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* HEADER */}

      {/* FILTER BAR */}
      {/* FILTER BAR */}
<div className="bg-base-100 border border-base-300 rounded-xl p-4 flex flex-col sm:flex-row sm:flex-wrap gap-3 sm:items-center sm:justify-between shadow">

  <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">

    <Input
      placeholder="Search employee..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      className="w-full sm:w-56 bg-base-200 border-base-300 text-base-content placeholder:text-base-content/75"
    />

    <Select
      value={monthFilter}
      onChange={(e) => setMonthFilter(e.target.value)}
      className="w-full sm:w-40 bg-base-200 border-base-300 text-base-content pr-8"
    >
      <option value="">All Months</option>
      <option value="2026-01">Jan 2026</option>
      <option value="2026-02">Feb 2026</option>
    </Select>

    <Button
      variant="outline"
      className="flex items-center gap-2 border-base-300 hover:bg-base-200"
    >
      <MdFilterList size={18} />
      Advanced Filter
    </Button>

  </div>
</div>
      {/* TABLE */}
      {/* <div className="bg-base-100 text-base-content border border-base-300 rounded-xl overflow-hidden">
  <div className="overflow-x-auto">

        <table className="table w-full ">
          <thead>
            <tr>
              <th>Employee</th>
              <th>Month</th>
              <th>Gross</th>
              <th>Deductions</th>
              <th>Net Pay</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((record) => (
              <tr key={record.id} className="hover:bg-base-200 text-base-content">

                <td>
                  <div>
                    <p className="font-medium text-base-content">
                      {record.employeeName}
                    </p>
                    <p className="text-xs text-base-content/60">
                      {record.role}
                    </p>
                  </div>
                </td>

                <td>{record.month}</td>

                <td>₹ {record.gross}</td>
                <td className="text-error">
                  ₹ {record.deductions}
                </td>

                <td className="font-semibold text-primary">
                  ₹ {record.netPay}
                </td>

                <td>
                 
                  <StatusBadge status={record.status} />
                </td>

                <td>
                  <div className="flex gap-2">

                    <button className="btn btn-sm btn-ghost text-base-content">
                      <MdVisibility size={18} />
                    </button>

                    <button className="btn btn-sm btn-ghost text-base-content">
                      <MdDownload size={18} />
                    </button>

                  </div>
                </td>

              </tr>
            ))}
          </tbody>
        </table>
  </div> */}

      <div className="hidden md:block bg-base-100 border border-base-300 rounded-xl overflow-hidden shadow">
        <div className="overflow-x-auto">
          <table className="table w-full text-base-content">
            <thead className="bg-base-200 text-base-content">
              <tr>
                <th>Employee</th>
                <th>Month</th>
                <th>Gross</th>
                <th>Deductions</th>
                <th>Net Pay</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((record) => (
                <tr key={record.id} className="hover:bg-base-200">
                  <td>
                    <div>
                      <p className="font-medium">{record.employeeName}</p>
                      <p className="text-xs text-base-content/60">
                        {record.role}
                      </p>
                    </div>
                  </td>

                  <td>{record.month}</td>

                  <td>₹ {record.gross}</td>

                  <td className="text-error">₹ {record.deductions}</td>

                  <td className="font-semibold text-primary">
                    ₹ {record.netPay}
                  </td>

                  <td>
                    <StatusBadge status={record.status} />
                  </td>

                  <td>
                    <div className="flex gap-2">
                      <button className="btn btn-sm btn-ghost">
                        <MdVisibility size={18} />
                      </button>

                      <button className="btn btn-sm btn-ghost">
                        <MdDownload size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="md:hidden space-y-4">
        {filtered.map((record) => (
          <div
            key={record.id}
            className="bg-base-100 border border-base-300 rounded-xl p-4 shadow"
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="font-semibold text-base-content">
                  {record.employeeName}
                </p>
                <p className="text-xs text-base-content/60">{record.role}</p>
              </div>

              <StatusBadge status={record.status} />
            </div>

            <div className="text-sm space-y-1 text-base-content/80">
              <p>
                <span className="font-medium">Month:</span> {record.month}
              </p>
              <p>
                <span className="font-medium">Gross:</span> ₹ {record.gross}
              </p>

              <p className="text-error">
                <span className="font-medium">Deductions:</span> ₹{" "}
                {record.deductions}
              </p>

              <p className="font-semibold text-primary">
                Net Pay: ₹ {record.netPay}
              </p>
            </div>

            <div className="flex gap-3 mt-3">
              <button className="btn btn-sm btn-outline  btn-primary flex-1 ">
                <MdVisibility size={18} />
              </button>

              <button className="btn btn-success btn-sm btn-outline flex-1">
                <MdDownload size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="p-6 text-center text-sm text-base-content/60">
          No payroll records found.
        </div>
      )}
    </div>
  );
}

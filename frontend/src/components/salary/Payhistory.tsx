import { useState } from "react";
import type { PayrollRecord } from "../../type/payslip";
import { MOCK_PAYROLL } from "../../mock/payroll";
import {
  MdDownload,
  MdVisibility,
  MdFilterList,
} from "react-icons/md";
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
    const matchesMonth =
      monthFilter ? r.month === monthFilter : true;

    const matchesSearch =
      r.employeeName
        .toLowerCase()
        .includes(search.toLowerCase());

    return matchesMonth && matchesSearch;
  });

  return (
    <div className="space-y-6">

      {/* HEADER */}
     

      {/* FILTER BAR */}
      <div className="bg-base-100 border border-base-300 rounded-xl p-4 flex flex-col md:flex-row gap-4 md:items-center md:justify-between">

      
          <Input
            placeholder="Search employee..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-48"
          />

          <Select
            value={monthFilter}
            onChange={(e) => setMonthFilter(e.target.value)}
            className="text-base-content"
          >
            <option value="">All Months</option>
            <option value="2026-01">Jan 2026</option>
            <option value="2026-02">Feb 2026</option>
          </Select>

        <Button variant="outline">
          <MdFilterList className="mr-1" size={18} />
          Advanced Filter
        </Button>
      </div>

      {/* TABLE */}
      <div className="bg-base-100 text-base-content border border-base-300 rounded-xl overflow-hidden">

        <table className="table w-full">
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

        {filtered.length === 0 && (
          <div className="p-6 text-center text-sm text-base-content/60">
            No payroll records found.
          </div>
        )}
      </div>
    </div>
  );
}

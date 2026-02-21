import SalaryRow from "./salaryRow";
import { useMemo } from "react";

interface SalaryBreakdown {
  basic: number;
  da: number;
  hra: number;
  special: number;
  epf: number;
  professionalTax: number;
}

interface Props {
  data: SalaryBreakdown;
  isEstimate?: boolean;
}



export default function SalarySlipPreview({
  data,
  isEstimate = true,
}: Props) {
  const parse = (value: any) => Number(value) || 0;

const salarySummary = useMemo(() => {
  const gross =
    parse(data.basic) +
    parse(data.da) +
    parse(data.hra) +
    parse(data.special);

  const totalDeductions =
    parse(data.epf) +
    parse(data.professionalTax);

  return {
    gross,
    totalDeductions,
    netPay: gross - totalDeductions,
  };
}, [data]);


  return (
    <div className="bg-base-100 border border-base-300 rounded-2xl p-6 shadow-md space-y-6">

      {/* HEADER */}
      <div className="flex items-center justify-between pb-4 border-b border-base-300">
        <div>
          <h2 className="text-lg font-semibold text-base-content">
            Pro-forma Salary Slip
          </h2>
          <p className="text-xs text-base-content/60">
            Salary breakdown preview
          </p>
        </div>

        {isEstimate && (
          <span className="badge badge-outline text-xs">
            ESTIMATE
          </span>
        )}
      </div>

      {/* ================= EARNINGS ================= */}
      <div>
        <h3 className="text-sm font-semibold text-base-content mb-3">
          Earnings
        </h3>

        <div className="space-y-2 text-sm">
          <SalaryRow label="Basic Salary" amount={data.basic} />
          <SalaryRow label="Dearness Allowance" amount={data.da} />
          <SalaryRow label="House Rent Allowance" amount={data.hra} />
          <SalaryRow label="Special Allowance" amount={data.special} />
        </div>

        <div className="mt-4 pt-3 border-t border-base-300 flex justify-between font-semibold text-base-content">
          <span>Gross Earnings</span>
          <span>₹ {salarySummary.gross.toLocaleString()}</span>
        </div>
      </div>

      {/* ================= DEDUCTIONS ================= */}
      <div>
        <h3 className="text-sm font-semibold text-base-content mb-3">
          Deductions
        </h3>

        <div className="space-y-2 text-sm">
          <SalaryRow
            label="EPF Employee Share"
            amount={data.epf}
          />
          <SalaryRow
            label="Professional Tax"
            amount={data.professionalTax}
          />
        </div>

        <div className="mt-4 pt-3 border-t border-base-300 flex justify-between font-semibold text-error">
          <span>Total Deductions</span>
          <span>₹ {salarySummary.totalDeductions.toLocaleString()}</span>
        </div>
      </div>

      {/* ================= NET PAY ================= */}
      <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 flex justify-between items-center">
        <span className="text-sm font-semibold text-base-content">
          Net Pay
        </span>
        <span className="text-lg font-bold text-primary">
          ₹ {salarySummary.netPay.toLocaleString()}
        </span>
      </div>
    </div>
  );
}

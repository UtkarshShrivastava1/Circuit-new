import { useEffect, useState } from "react";
import Button from "@/components/ui/Button";

export interface PolicyData {
  casual: number;
  sick: number;
  paid: number;
}

interface Props {
  policy?: PolicyData | null;
  isAdmin?: boolean;
  onSave?: (data: PolicyData) => void;
}

export default function LeavePolicy({ policy, isAdmin = false, onSave }: Props) {
  const [formData, setFormData] = useState<PolicyData>({
    casual: 12,
    sick: 8,
    paid: 15,
  });

  useEffect(() => {
    if (policy) {
      setFormData({
        casual: policy.casual,
        sick: policy.sick,
        paid: policy.paid,
      });
    }
  }, [policy]);

  const handleChange = (field: keyof PolicyData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: Number(value) || 0 }));
  };

  return (
    <div className="bg-base-100 border  rounded-xl p-6 space-y-6 border-primary/60">
      <div className="flex justify-between items-center border-base-300 pb-3 text-base-content border-b-1 border-b-base-content">
        <h3 className="text-lg font-semibold">
          Company Leave Policy
        </h3>
        {isAdmin && (
          <Button variant="primary" onClick={() => onSave?.(formData)}>
            Save Policy
          </Button>
        )}
      </div>

      <div className="space-y-4 text-sm text-base-content/80">
        <div className="flex justify-between items-start md:items-center p-3 bg-base-200 rounded-lg">
          <div>
            <h4 className="font-medium text-base-content">Casual Leave</h4>
            <p className="text-xs text-base-content">Cannot carry forward to the next year.</p>
          </div>
          {isAdmin ? (
            <input type="number" className="text-base-content input input-sm input-bordered w-24 text-center" value={formData.casual} onChange={(e) => handleChange("casual", e.target.value)} />
          ) : (
            <span className="font-semibold text-base-content bg-base-100 px-3 py-1 rounded-md">{formData.casual} Days</span>
          )}
        </div>

        <div className="flex justify-between items-start md:items-center p-3 bg-base-200 rounded-lg">
          <div>
            <h4 className="font-medium text-base-content">Sick Leave</h4>
            <p className="text-xs text-base-content">Medical certificate required if more than 2 days.</p>
          </div>
          {isAdmin ? (
            <input type="number"  className="text-base-content input input-sm input-bordered w-24 text-center" value={formData.sick} onChange={(e) => handleChange("sick", e.target.value)} />
          ) : (
            <span className="font-semibold text-base-content bg-base-100 px-3 py-1 rounded-md">{formData.sick} Days</span>
          )}
        </div>

        <div className="flex justify-between items-start md:items-center p-3 bg-base-200 rounded-lg">
          <div>
            <h4 className="font-medium text-base-content">Paid Leave</h4>
            <p className="text-xs text-base-content">Up to 5 days can be carried forward.</p>
          </div>
          {isAdmin ? (
            <input type="number" className="text-base-content input input-sm input-bordered w-24 text-center" value={formData.paid} onChange={(e) => handleChange("paid", e.target.value)} />
          ) : (
            <span className="font-semibold text-base-content bg-base-100 px-3 py-1 rounded-md">{formData.paid} Days</span>
          )}
        </div>

        <div>
          <h4 className="font-medium">
            Approval Process
          </h4>
          <p>
            All leave requests must be approved by reporting manager.
          </p>
        </div>

        <div>
          <h4 className="font-medium">
            Conflict Rule
          </h4>
          <p>
            Leave may be rejected if multiple team members apply for same dates.
          </p>
        </div>

      </div>
    </div>
  );
}
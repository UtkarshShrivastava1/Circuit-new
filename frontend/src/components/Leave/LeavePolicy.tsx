export default function LeavePolicy() {
  return (
    <div className="bg-base-100 border border-base-300 rounded-xl p-6 space-y-6">

      <h3 className="text-lg font-semibold">
        Leave Policy
      </h3>

      <div className="space-y-4 text-sm text-base-content/80">

        <div>
          <h4 className="font-medium">
            Casual Leave
          </h4>
          <p>
            12 days per year. Cannot carry forward.
          </p>
        </div>

        <div>
          <h4 className="font-medium">
            Sick Leave
          </h4>
          <p>
            8 days per year. Medical certificate required if more than 2 days.
          </p>
        </div>

        <div>
          <h4 className="font-medium">
            Paid Leave
          </h4>
          <p>
            15 days per year. 5 days can be carried forward.
          </p>
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
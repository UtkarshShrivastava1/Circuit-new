import Table  from "../ui/Table"
import StatusBadge from '../ui/StatusBadge';
import Button from '../ui/Button';
import { useNavigate } from 'react-router-dom';

const records = [
  {
    id: "1",
    employee: "Salman Khan",
    date: "2024-08-31",
    checkIn: "09:00 AM",
    status: "Unpaid",
    amount: "$3000",
  },
  {
    id: "2",
    employee: "Aamir Khan",
    date: "2024-08-31",
    checkIn: "09:15 AM",
    status: "Paid",
    amount: "$5000",
  },
  {
    id: "3",
    employee: "Shahrukh Khan",
    date: "2024-08-31",
    checkIn: "08:45 AM",
    status: "Unpaid",
    amount: "$4000",
  },
];

const PayrollDashboard = () => {
    const isAdmin = true; // Change to false to test non-admin view
    // const [selectedIds, setSelectedIds] = React.useState<string[]>([]);

    // const toggleSelect = (id: string) => {
    //   setSelectedIds((prev) =>
    //     prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    //   );
    // }

    // Add this helper function above your component
const getProgressValue = (status: string) => {
  switch (status.toLowerCase()) {
    case 'paid': return 100;
    case 'approved': return 90;
    case 'pending': return 50;
    case 'unpaid': 
    case 'rejected': return 0;
    default: return 0;
  }
};
const navigate = useNavigate();


  return (
    <div>
       <div className="stats shadow bg-base-100 w-full mb-6">
  {/* This Month Revenue */}
  <div className="stat">
    <div className="stat-figure text-primary">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-8 h-8">
        <path stroke="currentColor" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
      </svg>
    </div>
    <div className="stat-title">This Month Revenue</div>
    <div className="stat-value text-primary">₹1,20,000</div>
    <div className="stat-desc">+12% from last month</div>
  </div>

  {/* Pending Disbursement */}
  <div className="stat">
    <div className="stat-figure text-warning">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-8 h-8">
        <path stroke="currentColor" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
      </svg>
    </div>
    <div className="stat-title">Pending Disbursement</div>
    <div className="stat-value text-primary">₹45,000</div>
    <div className="stat-desc text-warning">3 payrolls</div>
  </div>

  {/* Active Staff */}
  <div className="stat">
    <div className="stat-figure text-success">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-8 h-8">
        <path stroke="currentColor" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
      </svg>
    </div>
    <div className="stat-title">Active Staff</div>
    <div className="stat-value text-primary">28</div>
    <div className="stat-desc">↑ 2 from last month</div>
  </div>
</div>


<div className="flex items-center justify-between p-6 bg-base-100/80 backdrop-blur-sm border-b border-base-300 rounded-xl mb-6 shadow-sm">
  {/* Title Section */}
  <div className="flex items-center gap-3">
    <div className="w-12 h-12 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl flex items-center justify-center shadow-lg">
      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    </div>
    <div>
      <h1 className="text-2xl font-bold bg-gradient-to-r from-base-content to-primary bg-clip-text text-transparent">Payroll Dashboard</h1>
      <p className="text-sm text-base-content/60">Manage employee payments & track disbursements</p>
    </div>
  </div>

  {/* Progress Chip */}
  <div className="flex items-center gap-3 p-3 bg-base-200/50 backdrop-blur-sm rounded-xl border border-base-300 shadow-md hover:shadow-lg transition-all duration-200 group">
    <div className="flex items-center gap-2">
      <span className="text-xs font-medium text-base-content/80 group-hover:text-base-content transition-colors">Overall Progress</span>
      <div className="flex items-center gap-1.5">
        <progress 
          className="progress progress-primary w-20 h-1.5 shadow-inner" 
          value={getProgressValue(records.find(r => r.status === "Paid")?.status || "pending")} 
          max="100"
        />
        <span className="text-xs font-mono text-primary font-semibold">
          {getProgressValue(records.find(r => r.status === "Paid")?.status || "pending")}%
        </span>
      </div>
    </div>
    <div className="w-2 h-2 bg-success/50 rounded-full animate-pulse" />
  </div>
</div>


      <Table headers={["Employee", "Month","Salary","Status","Quick Action"]}

      >
 {records.map((r) => (
          <tr key={r.id} className="text-base-content">

            {/* ✅ Checkbox only for admin */}
            {/* {isAdmin && (
              <td>
                <input
                  type="checkbox"
                  checked={selectedIds.includes(r.id)}
                  disabled={r.status !== "pending"}
                  onChange={() => toggleSelect(r.id)}
                />
              </td>
            )} */}

            <td>{r.employee}</td>
            <td>{r.date}</td>
             
            <td>{r.amount}</td>

          <td>
              <StatusBadge status={r.status}  />
            </td>

            {/* ✅ Action column only for admin */}
            {isAdmin && (
              <td className="text-right">
                {/* {r.status === "Paid" || r.status === "Unpaid" && ( */}
                  <div className="flex justify-left gap-2">
                    <Button size="xs" variant="primary"
                    onClick={() => navigate(`/payroll/${r.id}`)}
                    >
                      Manage
                    </Button>
                  </div>
                {/* )} */}
               
              </td>
            )}
          </tr>
        ))}


      </Table>

      
    </div>
  )
}

export default PayrollDashboard

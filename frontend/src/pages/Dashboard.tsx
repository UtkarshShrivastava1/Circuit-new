// import PageHeader from "../components/ui/PageHeader";
import StatCard from "../components/ui/StatCard";
import EmptyState from "../components/ui/EmptyState";
import {
  MdPeople,
  MdEventAvailable,
  MdWorkspaces,
  MdPendingActions,
} from "react-icons/md";

export default function Dashboard() {
  // Dummy data
  const stats = [
    {
      title: "Employees",
      value: 24,
      icon: <MdPeople size={20} />,
      helperText: "Total active employees",
    },
    {
      title: "Present Today",
      value: 18,
      icon: <MdEventAvailable size={20} />,
      helperText: "Attendance marked",
    },
    {
      title: "Active Projects",
      value: 6,
      icon: <MdWorkspaces size={20} />,
      helperText: "Ongoing projects",
    },
    {
      title: "Pending Leaves",
      value: 3,
      icon: <MdPendingActions size={20} />,
      helperText: "Needs approval",
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* <PageHeader
        title="Dashboard"
        subtitle="Overview of your organization"
      /> */}

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <StatCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            helperText={stat.helperText}
          />
        ))}
      </div>

      {/* RECENT ACTIVITY (EMPTY STATE FOR NOW) */}
      <div>
        <h2 className="text-lg font-semibold text-base-content mb-3">
          Recent Activity
        </h2>

        <EmptyState
          title="No activity yet"
          description="Recent attendance, tasks, and project updates will appear here."
        />
      </div>
    </div>
  );
}

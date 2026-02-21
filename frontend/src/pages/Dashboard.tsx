// import PageHeader from "../components/ui/PageHeader";
import StatCard from "../components/ui/StatCard";
import EmptyState from "../components/ui/EmptyState";
import confetti from "canvas-confetti";
import {
  MdPeople,
  MdEventAvailable,
  MdWorkspaces,
  MdPendingActions,
 
} from "react-icons/md";
import { isBirthdayToday } from "@/utils/dateUtils";
import { useEffect, useState } from "react";
import SingleBirthdayCard from "@/components/members/SingleBirthdayCard";

import BirthdayCarousel from "@/components/members/BirthdayCarousel";
import type { Member } from "@/type/member";

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

 const employees: Member[] = [
  {
    id: "1",
    name: "Ritika",
    role:"admin",
    email: "ritika@example.com",
    designation: "Software Developer",
    dateOfBirth: "2003-02-21",
  }
,
  {
    id: "2",
    name: "Rahul",
    email: "rahul@example.com",
    designation:"UI Designer",
    role: "employee",
    dateOfBirth: "2002-02-21",
  }
  ,
  {
    id: "3",
    name: "Ravi",
    email: "rahul@example.com",
    designation:"UI Designer",
    role: "employee",
    dateOfBirth: "2002-02-21",
  }
];

  const birthdayEmployees = employees.filter((emp) => isBirthdayToday(emp.dateOfBirth));

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (birthdayEmployees.length > 0) {
      confetti({
        particleCount: 150,
        spread: 90,
        origin: { y: 0.6 },
      });
    }
  }, [birthdayEmployees]);
 useEffect(() => {
  if (birthdayEmployees.length <= 1) return;

  const interval = setInterval(() => {
    setCurrentIndex((prev) =>
      prev === birthdayEmployees.length - 1 ? 0 : prev + 1
    );
  }, 4000); 

  return () => clearInterval(interval);
}, [birthdayEmployees.length]);
 
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
  {/* BIRTHDAY SECTION */}
{birthdayEmployees.length > 0 && (
  <div className="mb-6">
  {birthdayEmployees.length === 1 && (
  <div className="bg-white rounded-2xl shadow-sm p-6">
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-lg font-semibold">
        🎂 Birthday Today
      </h2>
    </div>

    <SingleBirthdayCard employee={birthdayEmployees[0]} />
  </div>
)}

   {birthdayEmployees.length === 2 && (
  <div className="bg-white rounded-2xl shadow-sm p-6">
    <h2 className="text-lg font-semibold mb-4">
      🎂 Birthdays Today
    </h2>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {birthdayEmployees.map((emp) => (
        <SingleBirthdayCard key={emp.id} employee={emp} />
      ))}
    </div>
  </div>
)}
    {birthdayEmployees.length > 2 && (
      <BirthdayCarousel
        employees={birthdayEmployees}
        currentIndex={currentIndex}
        setCurrentIndex={setCurrentIndex}
      />
    )}
  </div>
)}
    
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

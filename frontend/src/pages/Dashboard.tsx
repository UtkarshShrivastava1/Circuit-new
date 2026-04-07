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
import { useAuth } from "@/auth/AuthContext";
import { getMembers } from "@/services/memberService";
import { getAttendance, getMyAttendance } from "@/services/attendanceService";
import { getProject } from "@/services/projectServices";
import api from "@/services/api";
import { getAllLeaves } from "@/services/leaveService";

// Helper to format MongoDB timestamps to "x mins ago"
function timeAgo(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.round((now.getTime() - date.getTime()) / 1000);
  if (seconds < 60) return `Just now`;
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes} mins ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} hours ago`;
  const days = Math.round(hours / 24);
  if (days < 7) return `${days} days ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function Dashboard() {
  const { auth } = useAuth();
  const isAdmin = auth?.user?.role === "admin" || auth?.user?.role === "owner";
  const [loading, setLoading] = useState(true);
  const [employees, setEmployees] = useState<Member[]>([]);
  const [statsData, setStatsData] = useState({
    totalEmployees: 0,
    presentToday: 0,
    activeProjects: 0,
    pendingLeaves: 0,
    myAttendanceStatus: "Not Marked",
  });

  const [activities, setActivities] = useState<any[]>([]);

  useEffect(() => {
    if (!auth.slug) return;

    const fetchDashboardData = async (isSilent = false) => {
      if (!isSilent) setLoading(true);
      try {
        const todayISO = new Date().toISOString().split("T")[0];

        // Fetch primary data concurrently
        const [membersRes, attendanceRes, projectsRes] = await Promise.allSettled(
          isAdmin 
            ? [
                getMembers(auth.slug),
                getAttendance(auth.slug, { date: todayISO }),
                getProject(auth.slug)
              ]
            : [
                getMembers(auth.slug),
                getMyAttendance(auth.slug, { date: todayISO }),
                getProject(auth.slug)
              ]
        );

        let fetchedMembers: Member[] = [];
        if (membersRes.status === "fulfilled") {
          fetchedMembers = membersRes.value.data?.members || [];
          setEmployees(fetchedMembers);
        }

        let presentCount = 0;
        let myStatus = "Not Marked";
        
        if (attendanceRes.status === "fulfilled" && isAdmin) {
          const attendanceDocs = attendanceRes.value.data?.data || attendanceRes.value.data || [];
          attendanceDocs.forEach((doc: any) => {
            (doc.records || []).forEach((r: any) => {
              const status = (r.status || "").toUpperCase();
              if (status === "PRESENT" || status === "HALF_DAY") presentCount++;
            });
          });
        } else if (attendanceRes.status === "fulfilled" && !isAdmin) {
          const myDocs = attendanceRes.value.data?.data || [];
          if (myDocs.length > 0 && myDocs[0].record) {
            myStatus = myDocs[0].record.status || "Not Marked";
          }
        }

        let activeProjectsCount = 0;
        if (projectsRes.status === "fulfilled") {
          const projectsList = projectsRes.value.data?.projects || [];
          activeProjectsCount = projectsList.filter(
            (p: any) => (p.projectState || "active").toLowerCase() === "active"
          ).length;
        }

        // Fetch leaves (best effort depending on route configuration)
        let pendingLeavesCount = 0;
        // TODO: Uncomment and update the endpoint once the backend route for leaves is ready
        if (isAdmin) {
          try {
            const leavesRes = await getAllLeaves(auth.slug);
            const leavesList = leavesRes.data?.leaves || leavesRes.data?.data || [];
            pendingLeavesCount = leavesList.filter((l: any) => (l.status || "").toLowerCase() === "pending").length;
          } catch (e) {
            console.error("Could not fetch leaves", e);
          }
        }

        // Fetch recent activities from backend
        try {
          const activityEndpoint = isAdmin
            ? `/activity/${auth.slug}`
            : `/activity/${auth.slug}?userId=${(auth.user as any)?.userId || (auth.user as any)?._id}`;
            
          const activityRes = await api.get(activityEndpoint);
          setActivities(activityRes.data?.activities || activityRes.data?.data || []);
        } catch (e) {
          console.error("Could not fetch activities", e);
        }

        setStatsData({
          totalEmployees: fetchedMembers.length,
          presentToday: presentCount,
          activeProjects: activeProjectsCount,
          pendingLeaves: pendingLeavesCount,
          myAttendanceStatus: myStatus,
        });
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        if (!isSilent) setLoading(false);
      }
    };

    fetchDashboardData();

    // Auto-refresh every 30 seconds to catch admin changes (silent refresh)
    const intervalId = setInterval(() => fetchDashboardData(true), 30000);
    return () => clearInterval(intervalId);
  }, [auth.slug, isAdmin]);

  const adminStats = [
    {
      title: "Employees",
      value: statsData.totalEmployees,
      icon: <MdPeople size={20} />,
      helperText: "Total active employees",
    },
    {
      title: "Present Today",
      value: statsData.presentToday,
      icon: <MdEventAvailable size={20} />,
      helperText: "Attendance marked",
    },
    {
      title: "Active Projects",
      value: statsData.activeProjects,
      icon: <MdWorkspaces size={20} />,
      helperText: "Ongoing projects",
    },
    {
      title: "Pending Leaves",
      value: statsData.pendingLeaves,
      icon: <MdPendingActions size={20} />,
      helperText: "Needs approval",
    },
  ];

  const employeeStats = [
    {
      title: "My Active Projects",
      value: statsData.activeProjects,
      icon: <MdWorkspaces size={20} />,
      helperText: "Projects you are assigned to",
    },
    {
      title: "Today's Attendance",
      value: statsData.myAttendanceStatus,
      icon: <MdEventAvailable size={20} />,
      helperText: "Your current status",
    },
  ];

  const statsToRender = isAdmin ? adminStats : employeeStats;

  const birthdayEmployees = employees.filter((emp) => emp.dateOfBirth && isBirthdayToday(emp.dateOfBirth));

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
      <div className={`grid grid-cols-1 sm:grid-cols-2 ${isAdmin ? 'lg:grid-cols-4' : 'lg:grid-cols-2'} gap-4`}>
        {statsToRender.map((stat) => (
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

        {activities.length > 0 ? (
          <div className="bg-base-100 rounded-2xl shadow-sm border border-base-300 p-6">
            <ul className="space-y-4">
              {activities.map((activity) => (
                
                <li key={activity._id || activity.id} className="flex justify-between items-start sm:items-center text-sm border-b border-base-200 pb-3 last:border-0 last:pb-0">
                  <div className="flex items-center gap-3">
                    {activity.user && (
                      <div className="w-9 h-9 rounded-full bg-base-200 border border-base-300 flex items-center justify-center overflow-hidden shrink-0">
                        {activity.user.imageUrl ? (
                          <img src={activity.user.imageUrl} alt={activity.user.name || "User"} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-sm font-medium text-base-content/60">
                            {(activity.user?.name || "?").toUpperCase()}
                           
                          </span>
                        )} 
                      </div>
                    )}
                    <div className="flex flex-col">
                      <span className="text-base-content font-medium">{activity.action || "Activity"}</span>
                      <span className="text-base-content/70 text-xs">{activity.message || activity.title}</span>
                    </div>
                  </div>
                  <span className="text-base-content/50 text-xs whitespace-nowrap shrink-0 mt-1 sm:mt-0">
                    {activity.time || (activity.createdAt ? timeAgo(activity.createdAt) : "")}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <EmptyState
            title="No activity yet"
            description="Recent attendance, tasks, and project updates will appear here."
          />
        )}
      </div>
    </div>
  );
}

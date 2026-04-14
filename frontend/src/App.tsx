import React, { useState, Suspense, useEffect } from "react";
import { Routes, Route, Outlet, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { socket } from "./socket";
// import Notifications from "./pages/Notifications";
import ProjectChat from "./components/projects/ProjectChat";
// import Members from "./pages/Members";
// import MemberDetails from "./pages/MemberDetails";
// import AdminProfile from "./pages/AdminProfile";
// import AddMember from "./pages/AddMember";
// import CreateProject from "./pages/CreateProject";
import Notifications from "./pages/Notifications";
import SettingsPage from "./pages/Settings";
// import Settings from "./pages/Settings";
// import HomePage from "./pages/HomePage";
import OrganizationPage from "./pages/Organization/OrganizationRegistrationPage";
import { useAuth } from "./auth/AuthContext";
import WorkUpdates from "./pages/WorkUpdate";


/* Pages (lazy) */
const AppLayout = React.lazy(() => import("./components/layout/AppLayout"));
const PageContainer = React.lazy(() => import("./components/layout/PageContainer"));
// const Login = React.lazy(() => import("./pages/Login"));
const Dashboard = React.lazy(() => import("./pages/Dashboard"));
const Attendance = React.lazy(() => import("./pages/Attendance"));
const Projects = React.lazy(() => import("./pages/Projects"));
const ProjectWorkspace = React.lazy(() => import("./pages/ProjectWorkspace"));
const TaskDashboard = React.lazy(() => import("./pages/Tasks"));
const LeaveDashboard = React.lazy(() => import("./pages/LeaveDashboard"));

const SalaryStructure = React.lazy(() => import("./pages/SalaryStructure"));
const PayrollDashboard = React.lazy(
  () => import("./pages/PayrollDashboard"),
);
const GeneratePaySlip = React.lazy(
  () => import("./components/salary/GeneratePaySlip"),
);
const PayHistory = React.lazy(() => import("./components/salary/Payhistory"));
const EmployeePayslip = React.lazy(() => import("./components/salary/EmployeePayslip"));
const PayrollPolicySetup = React.lazy(() => import("./components/salary/PayrollPolicySetup"));

const Members = React.lazy(() => import("./pages/Members"));
const MemberDetails = React.lazy(() => import("./pages/MemberDetails"));
const AdminProfile = React.lazy(() => import("./pages/AdminProfile"));
const AddMember = React.lazy(() => import("./pages/AddMember"));
const CreateProject = React.lazy(() => import("./pages/CreateProject"));
const Login = React.lazy(() => import("./pages/Login"));
const AddMemberPage = React.lazy(() => import("./pages/AddMembers"));


/* ---------- Layout Wrapper ---------- */

function LayoutWrapper() {
  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  );
}

export default function App() {
  const { auth } = useAuth();
  const isManagement = ['admin', 'owner', 'manager'].includes(auth?.user?.role || '');

  useEffect(() => {
    if (auth?.user) {
      socket.connect();

      const onConnect = () => {
        console.log("✅ Socket connected successfully! ID:", socket.id);
      };

      const onNotification = (data: any) => {
        console.log("🔔 Real-time notification received via socket:", data);
        try {
          // Ensure you have placed 'notification.mp3' in your frontend public/ directory
          const audio = new Audio("/notification.mp3");
          audio.play();
        } catch (err) {
          console.error("Audio play failed (maybe browser autoplay blocked it?):", err);
        }
      };

      socket.on("connect", onConnect);
      socket.on("new_notification", onNotification);

      return () => {
        console.log("🔌 Socket disconnected");
        socket.off("connect", onConnect);
        socket.off("new_notification", onNotification);
        socket.disconnect();
      };
    }
  }, [auth?.user]);

  return (
    <>
   { !auth.user ?
   <Login />   :
    <Suspense fallback={
      <div className="flex flex-col justify-center items-center h-screen bg-base-100">
        <span className="loading loading-spinner loading-lg text-primary"></span>
        <p className="mt-4 text-lg font-medium text-base-content/70">Loading...</p>
      </div>
    }>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/organizationRegister" element={<OrganizationPage />} />

        {/* If the user is logged in but hasn't registered an organization yet, force them to the registration page */}
        {(!auth?.slug && !auth?.user?.organization) ? (
          <Route path="*" element={<Navigate to="/organizationRegister" replace />} />
        ) : (
          /* Protected Layout Routes */
          <Route element={<LayoutWrapper />}>
            <Route
              path="/"
              element={
                <PageContainer title="Dashboard" subtitle="Overview">
                  <Dashboard />
                </PageContainer>
              }
            />
            <Route
              path="/attendance"
              element={
                <PageContainer title="Attendance" subtitle="Daily validation">
                  <Attendance />
                </PageContainer>
              }
            />
            <Route
              path="/projects"
              element={
                <PageContainer title="Projects">
                  <Projects />
                </PageContainer>
              }
            />
            <Route path="/work-updates" element={
              <WorkUpdates/>


            }
            />
            <Route
              path="/tasks"
              element={
                <PageContainer title="Tasks">
                  <TaskDashboard />
                </PageContainer>
              }
            />
            <Route
              path="/leaves"
              element={
                <PageContainer title="My Leaves" subtitle="Track your leave requests">
                  <LeaveDashboard />
                </PageContainer>
              }
            />

            {/* My Salary - For all employees to view their own payslips */}
            <Route
              path="/my-salary"
              element={
                <PageContainer title="My Salary">
                  <EmployeePayslip />
                </PageContainer>
              }
            />


            {/* Payroll - Restricted to Admin, Owner, and Manager */}
            {isManagement && (
              <>
                <Route
                  path="/payroll/dashboard"
                  element={
                    <PageContainer title="Payroll Dashboard">
                      <PayrollDashboard />
                    </PageContainer>
                  }
                />
                <Route
                  path="/payroll/salary-structure"
                  element={
                    <PageContainer title="Salary Structure">
                      <SalaryStructure />
                    </PageContainer>
                  }
                />
                <Route
                  path="/payroll/generate"
                  element={
                    <PageContainer title="Generate Pay Slip">
                      <GeneratePaySlip />
                    </PageContainer>
                  }
                />
                <Route
                  path="/payroll/history"
                  element={
                    <PageContainer title="Payroll History">
                      <PayHistory />
                    </PageContainer>
                  }
                />
                <Route
                  path="/payroll/policy"
                  element={
                    <PageContainer title="Payroll Policy Setup">
                      <PayrollPolicySetup />
                    </PageContainer>
                  }
                />
              </>
            )}

            <Route path="/projects/:id" element={<ProjectWorkspace />}>
               <Route path="chat" element={<ProjectChat />} />
            </Route>
            <Route path="/members" element={<PageContainer title="Members"><Members /></PageContainer>} />
            <Route path="/members/:id" element={<PageContainer><MemberDetails /></PageContainer>} />
            <Route path="/profile/:id" element={<AdminProfile />} />
            <Route path="/addMember" element={<AddMember />} />
            <Route path="/createProject" element={<PageContainer><CreateProject /></PageContainer>} />
            <Route path="/notifications" element={<PageContainer><Notifications /></PageContainer>} />
            <Route path="/createMember" element={<PageContainer><AddMemberPage /></PageContainer>} />
            <Route path="/settings" element={<SettingsPage />} />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        )}
      </Routes>
      <ToastContainer />
    </Suspense>
   }
   </>
  );
}
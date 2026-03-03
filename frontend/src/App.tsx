import React, { Suspense } from "react";
import { Routes, Route, Outlet, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

/* ---------- Lazy Pages ---------- */

const AppLayout = React.lazy(() => import("./components/layout/AppLayout"));
const PageContainer = React.lazy(() => import("./components/layout/PageContainer"));

const Dashboard = React.lazy(() => import("./pages/Dashboard"));
const Attendance = React.lazy(() => import("./pages/Attendance"));
const Projects = React.lazy(() => import("./pages/Projects"));
const ProjectWorkspace = React.lazy(() => import("./pages/ProjectWorkspace"));
const TaskDashboard = React.lazy(() => import("./pages/Tasks"));
const LeaveDashboard = React.lazy(() => import("./pages/LeaveDashboard"));

const SalaryStructure = React.lazy(() => import("./pages/SalaryStructure"));
const PayrollDashboard = React.lazy(() => import("./components/salary/PayrollDashboard"));
const GeneratePaySlip = React.lazy(() => import("./components/salary/GeneratePaySlip"));
const PayHistory = React.lazy(() => import("./components/salary/Payhistory"));

const Members = React.lazy(() => import("./pages/Members"));
const MemberDetails = React.lazy(() => import("./pages/MemberDetails"));
const AdminProfile = React.lazy(() => import("./pages/AdminProfile"));
const AddMember = React.lazy(() => import("./pages/AddMember"));
const CreateProject = React.lazy(() => import("./pages/CreateProject"));
const Login = React.lazy(() => import("./pages/Login"));

/* ---------- Layout Wrapper ---------- */

function LayoutWrapper() {
  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  );
}

export default function App() {
  return (
    <Suspense fallback={<div className="p-6 flex justify-center items-center mt-10">Loading...</div>}>
      <Routes>

        {/* Redirect root to login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Public Route */}
        <Route path="/login" element={<Login />} />

        {/* Protected Layout Routes */}
        <Route element={<LayoutWrapper />}>

          <Route
            path="/dashboard"
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
              <PageContainer title=" My Leaves"  subtitle="Track your leave requests">
                <LeaveDashboard />
              </PageContainer>
            }
          />

          {/* Payroll */}
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

          {/* Members */}
          <Route
            path="/members"
            element={
              <PageContainer title="Members">
                <Members />
              </PageContainer>
            }
          />

          <Route
            path="/members/:id"
            element={
              <PageContainer>
                <MemberDetails />
              </PageContainer>
            }
          />

          <Route path="/projects/:id" element={<ProjectWorkspace />} />
          <Route path="/adminProfile/:id" element={<AdminProfile />} />
          <Route path="/addMember" element={<AddMember />} />
          <Route path="/createProject" element={
            <PageContainer>
                <CreateProject />
              </PageContainer>
            
            } />

        </Route>

      </Routes>

      <ToastContainer />
    </Suspense>
  );
}

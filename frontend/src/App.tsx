import { Routes, Route } from "react-router-dom";
import React,{ useState  } from "react";
const AppLayout = React.lazy(() => import("./components/layout/AppLayout"));
const PageContainer = React.lazy(() => import("./components/layout/PageContainer"));

const Dashboard = React.lazy(() => import("./pages/Dashboard"));
const Attendance = React.lazy(() => import("./pages/Attendance"));

const Projects = React.lazy(() => import("./pages/Projects"));
const ProjectWorkspace = React.lazy(() => import("./pages/ProjectWorkspace"));

const TaskDashboard = React.lazy(() => import("./pages/Tasks"));

const LeaveDashboard = React.lazy(() => import("./pages/LeaveDashboard"));


// Salary 
const SalaryStructureModal = React.lazy (() => import  ("./pages/SalaryStructure"));
const PayrollDashboard = React.lazy (() => import  ("./components/salary/PayrollDashboard"));
const GeneratePaySlip  = React.lazy (() => import  ("./components/salary/GeneratePaySlip"));
const Payhistory = React.lazy (() => import  ("./components/salary/Payhistory"));

// import AdminDashboard from "./pages/adminDashboard";
export default function App() {
  const [notifications, setNotifications] =
  useState<Notification[]>([]);
import { Routes, Route, Outlet ,Navigate} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import AppLayout from "./components/layout/AppLayout";
import PageContainer from "./components/layout/PageContainer";
import Dashboard from "./pages/Dashboard";
import Attendance from "./pages/Attendance";
import Projects from "./pages/Projects";
import ProjectWorkspace from "./pages/ProjectWorkspace";
import Members from "./pages/Members";
import MemberDetails from "./pages/MemberDetails";
import AdminProfile from "./pages/AdminProfile";
import AddMember from "./pages/AddMember";
import {CreateProject} from "./pages/CreateProject";
import Login from "./pages/Login";

function LayoutWrapper() {
  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  );
}
export default function App() {
  return (<>
    <Routes>
       <Route path="/" element={<Navigate to="/login" replace />} />

      {/*Public Route (NO Layout) */}
      <Route path="/login" element={<Login />} />

      <Route element={<LayoutWrapper />}>

        <Route
          path="/"
          element={
            <PageContainer
              title="Dashboard"
              subtitle="Overview of your organization"
            >
              <Dashboard />
            </PageContainer>
          }
        />

        <Route
          path="/attendance"
          element={
            <PageContainer
              title="Attendance"
              subtitle="Validate daily attendance"
              action={
                <button className="btn btn-primary btn-sm">Export</button>
              }
            >
              <Attendance />
            </PageContainer>
          }
        />

        
        <Route
          path="/projects"
          element={
            <PageContainer
              title="Projects"
              subtitle="Track ongoing and completed projects"
            >
              <Projects />
            </PageContainer>
          }
        />
        <Route
          path="/tasks"
          element={
            <PageContainer
              title="Tasks"
              subtitle="Track ongoing and completed tasks"
            >
              <TaskDashboard />
            </PageContainer>
          }
        />
        <Route
          path="/leaves"
          element={
            <PageContainer
              title="Leaves"
              subtitle="Track ongoing and completed leaves"
            >
              <LeaveDashboard  />
            </PageContainer>
          }
        />
        <Route
          path="/payroll/salary-structure"
          element={
            <PageContainer
              title="Salary Structure"
              subtitle="Manage salary structures"
            >
              <SalaryStructureModal />
            </PageContainer>
          }
        />
        <Route
          path="/payroll/dashboard"
          element={
            <PageContainer
              title="Payroll Dashboard"
              subtitle="Track ongoing and completed payroll activities"
            >
              <PayrollDashboard  />
            </PageContainer>
          }
        />
        <Route
          path="payroll/generate"
          element={
            <PageContainer
              title="Generate Pay Slip"
              subtitle="Pay Slip"
            >
              <GeneratePaySlip  />
            </PageContainer>
          }
        />
        <Route
          path="payroll/history"
          element={
            <PageContainer
              title=" Pay History"
              subtitle="Monthly pays of the employee"
            >
              <Payhistory  />
            </PageContainer>
          }
        />

        <Route
          path="/members"
          element={
            <PageContainer
              title="Members"
              subtitle="Manage your team members"
            >
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
        {/* <Route path="/Dashboard" element={<AdminDashboard />} /> */}
      </Routes>
    </AppLayout>

        <Route
          path="/adminProfile/:id"
          element={
            <PageContainer>
              <AdminProfile />
            </PageContainer>
          }
        />

        <Route
          path="/addMember"
          element={
            <PageContainer>
              <AddMember />
            </PageContainer>
          }
        />

        <Route
          path="/createProject"
          element={
            <PageContainer>
              <CreateProject />
            </PageContainer>
          }
        />

      </Route>
      
    </Routes>
      <ToastContainer />
    </>
  );
}


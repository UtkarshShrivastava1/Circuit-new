



// import React, { useState, Suspense } from "react";
// import { Routes, Route, Outlet, Navigate } from "react-router-dom";
// import { ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// import Notifications from "./pages/Notifications";
// import ProjectChat from "./components/projects/ProjectChat";
// import SettingsPage from "./pages/Settings";
// import HomePage from "./pages/HomePage";
// import OrganizationPage from "./pages/Organization/OrganizationRegistrationPage";

// /* ---------- Lazy Pages ---------- */

// const AppLayout = React.lazy(() => import("./components/layout/AppLayout"));
// const PageContainer = React.lazy(() => import("./components/layout/PageContainer"));

// const Dashboard = React.lazy(() => import("./pages/Dashboard"));
// const Attendance = React.lazy(() => import("./pages/Attendance"));
// const Projects = React.lazy(() => import("./pages/Projects"));
// const ProjectWorkspace = React.lazy(() => import("./pages/ProjectWorkspace"));
// const TaskDashboard = React.lazy(() => import("./pages/Tasks"));
// const LeaveDashboard = React.lazy(() => import("./pages/LeaveDashboard"));

// const SalaryStructure = React.lazy(() => import("./pages/SalaryStructure"));
// const PayrollDashboard = React.lazy(
//   () => import("./components/salary/PayrollDashboard")
// );
// const GeneratePaySlip = React.lazy(
//   () => import("./components/salary/GeneratePaySlip")
// );
// const PayHistory = React.lazy(() => import("./components/salary/Payhistory"));

// const Members = React.lazy(() => import("./pages/Members"));
// const MemberDetails = React.lazy(() => import("./pages/MemberDetails"));
// const AdminProfile = React.lazy(() => import("./pages/AdminProfile"));
// const AddMember = React.lazy(() => import("./pages/AddMember"));
// const CreateProject = React.lazy(() => import("./pages/CreateProject"));
// const Login = React.lazy(() => import("./pages/Login"));
// const AddMemberPage = React.lazy(() => import("./pages/AddMembers"));

// /* ---------- Layout Wrapper ---------- */

// function LayoutWrapper() {
//   return (
//     <AppLayout>
//       <Outlet />
//     </AppLayout>
//   );
// }

// /* ---------- Protected Route ---------- */

// function ProtectedRoute({ token }: { token: string }) {
//   if (!token) {
//     return <Navigate to="/login" replace />;
//   }
//   return <LayoutWrapper />;
// }

// export default function App() {
//   const [token, setToken] = useState(localStorage.getItem("token") || "");

//   return (
//     <Suspense
//       fallback={
//         <div className="p-6 flex justify-center items-center mt-10">
//           Loading...
//         </div>
//       }
//     >
//       <Routes>
//         {/* Public Routes */}
//         <Route path="/login" element={<Login setToken={setToken} />} />
//         <Route path="/organizationRegister" element={<OrganizationPage />} />

//         {/* Protected Routes */}
//         <Route element={<ProtectedRoute token={token} />}>
//           <Route
//             path="/"
//             element={
//               <PageContainer title="Dashboard" subtitle="Overview">
//                 <Dashboard />
//               </PageContainer>
//             }
//           />

//           <Route
//             path="/attendance"
//             element={
//               <PageContainer title="Attendance" subtitle="Daily validation">
//                 <Attendance />
//               </PageContainer>
//             }
//           />

//           <Route
//             path="/projects"
//             element={
//               <PageContainer title="Projects">
//                 <Projects />
//               </PageContainer>
//             }
//           />

//           <Route
//             path="/tasks"
//             element={
//               <PageContainer title="Tasks">
//                 <TaskDashboard />
//               </PageContainer>
//             }
//           />

//           <Route
//             path="/leaves"
//             element={
//               <PageContainer title="My Leaves">
//                 <LeaveDashboard />
//               </PageContainer>
//             }
//           />

//           <Route path="/projects/:id" element={<ProjectWorkspace />}>
//             <Route path="chat" element={<ProjectChat />} />
//           </Route>

//           <Route path="/members" element={<Members />} />
//           <Route path="/members/:id" element={<MemberDetails />} />
//           <Route path="/adminProfile/:id" element={<AdminProfile />} />
//           <Route path="/addMember" element={<AddMember />} />
//           <Route path="/createProject" element={<CreateProject />} />
//           <Route path="/notifications" element={<Notifications />} />
//           <Route path="/createMember" element={<AddMemberPage />} />
//           <Route path="/settings" element={<SettingsPage />} />
//         </Route>

//         {/* Fallback */}
//         <Route path="*" element={<Navigate to="/" />} />
//       </Routes>

//       <ToastContainer />
//     </Suspense>
//   );
// }

import React, { Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider } from "./auth/AuthContext";
import { ProtectedRoute } from "./auth/ProtectedRoute";
import OrganizationPage from "./pages/Organization/OrganizationRegistrationPage";
import ProjectWorkspace from "./pages/ProjectWorkspace";
import ProjectChat from "./components/projects/ProjectChat";
import Members from "./pages/Members";
import MemberDetails from "./pages/MemberDetails";
import AdminProfile from "./pages/AdminProfile";
import AddMember from "./pages/AddMember";
import CreateProject from "./pages/CreateProject";
import Notifications from "./pages/Notifications";
import SettingsPage from "./pages/Settings";
import TaskDashboard from "./pages/Tasks";
import LeaveDashboard from "./pages/LeaveDashboard";


/* Pages (lazy) */
const AppLayout = React.lazy(() => import("./components/layout/AppLayout"));
const PageContainer = React.lazy(() => import("./components/layout/PageContainer"));
const Login = React.lazy(() => import("./pages/Login"));
const Dashboard = React.lazy(() => import("./pages/Dashboard"));
const Attendance = React.lazy(() => import("./pages/Attendance"));
const Projects = React.lazy(() => import("./pages/Projects"));
// ... add other pages as before

export default function App() {
  return (
    <AuthProvider>
      <Suspense fallback={<div className="p-6 flex justify-center items-center mt-10">Loading...</div>}>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/organizationRegister" element={<OrganizationPage />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
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
              <PageContainer title="My Leaves">
                <LeaveDashboard />
              </PageContainer>
            }
          />
          <Route path="/projects/:id" element={<ProjectWorkspace />}>
             <Route path="chat" element={<ProjectChat />} />
          </Route>

        <Route path="/members" element={<Members />} />
           <Route path="/members/:id" element={<MemberDetails />} />
          <Route path="/adminProfile/:id" element={<AdminProfile />} />
          <Route path="/addMember" element={<AddMember />} />
          <Route path="/createProject" element={<CreateProject />} />
           <Route path="/notifications" element={<Notifications />} />
          <Route path="/createMember" element={<AddMember />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
         

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <ToastContainer />
      </Suspense>
    </AuthProvider>
  );
}
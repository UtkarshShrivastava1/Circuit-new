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
          path="/dashboard"
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


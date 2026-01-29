import { Routes, Route } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout";
import PageContainer from "./components/layout/PageContainer";
import Dashboard from "./pages/Dashboard";
import Attendance from "./pages/Attendance";

export default function App() {
  return (
    <AppLayout>
      <Routes>
        <Route
          path="/dashboard"
          element={<PageContainer title="Dashboard"  subtitle="Overview of your organization" ><Dashboard/></PageContainer>}
        />
        <Route
          path="/attendance"
          element={<PageContainer   title="Attendance"
  subtitle="Validate daily attendance"
  action={<button className="btn btn-primary btn-sm">Export</button>}><Attendance/></PageContainer>}
        />
        <Route
          path="/projects"
          element={<PageContainer title="Projects">Projects</PageContainer>}
        />
      </Routes>
    </AppLayout>
  );
}

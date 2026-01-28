import { Routes, Route } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout";
import PageContainer from "./components/layout/PageContainer";

export default function App() {
  return (
    <AppLayout>
      <Routes>
        <Route
          path="/dashboard"
          element={<PageContainer title="Dashboard">Dashboard</PageContainer>}
        />
        <Route
          path="/attendance"
          element={<PageContainer title="Attendance">Attendance</PageContainer>}
        />
        <Route
          path="/projects"
          element={<PageContainer title="Projects">Projects</PageContainer>}
        />
      </Routes>
    </AppLayout>
  );
}

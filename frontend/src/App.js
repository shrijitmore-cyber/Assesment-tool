import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Landing from "@/pages/Landing";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Dashboard from "@/pages/Dashboard";
import Assessments from "@/pages/Assessments";
import TakeAssessment from "@/pages/TakeAssessment";
import Results from "@/pages/Results";
import OrgPanel from "@/pages/OrgPanel";
import AdminUsers from "@/pages/AdminUsers";
import AdminOrgs from "@/pages/AdminOrgs";
import ConsultantView from "@/pages/ConsultantView";
import "@/App.css";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/assessments"
            element={
              <ProtectedRoute>
                <Assessments />
              </ProtectedRoute>
            }
          />
          <Route
            path="/responses/:id/take"
            element={
              <ProtectedRoute>
                <TakeAssessment />
              </ProtectedRoute>
            }
          />
          <Route
            path="/responses/:id/results"
            element={
              <ProtectedRoute>
                <Results />
              </ProtectedRoute>
            }
          />

          <Route
            path="/org"
            element={
              <ProtectedRoute roles={["org_admin"]}>
                <OrgPanel />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute roles={["super_admin"]}>
                <AdminUsers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/orgs"
            element={
              <ProtectedRoute roles={["super_admin"]}>
                <AdminOrgs />
              </ProtectedRoute>
            }
          />
          <Route
            path="/consultant"
            element={
              <ProtectedRoute roles={["consultant", "super_admin"]}>
                <ConsultantView />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

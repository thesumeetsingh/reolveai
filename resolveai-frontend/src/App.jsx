import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import ProjectDetails from "./pages/ProjectDetails";
import Support from "./pages/Support";
import SupportCreate from "./pages/SupportCreate";
import IncidentDetails from "./pages/IncidentDetails";
import Admin from "./pages/Admin";

import ProtectedRoute from "./components/ProtectedRoute";
import AppLayout from "./components/AppLayout";
import { useAuth } from "./context/AuthContext";

function AdminRoute() {
  return <ProtectedRoute requireAdmin />;
}

function RootRoute() {
  const { isAuthenticated } = useAuth();

  // Login redirects to "/". Authenticated users must enter through
  // the existing protected /dashboard route so AppLayout is rendered.
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Home />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/" element={<RootRoute />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/projects/:projectId" element={<ProjectDetails />} />
            <Route path="/support" element={<Support />} />
            <Route path="/support/new" element={<SupportCreate />} />
            <Route
              path="/incidents/:supportRequestId"
              element={<IncidentDetails />}
            />

            <Route element={<AdminRoute />}>
              <Route path="/admin" element={<Admin />} />
            </Route>
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
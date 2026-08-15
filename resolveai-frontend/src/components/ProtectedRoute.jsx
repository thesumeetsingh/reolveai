import {
  Navigate,
  Outlet,
} from "react-router-dom";

import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({
  requireAdmin = false,
}) {
  const {
    isAuthenticated,
    user,
  } = useAuth();

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  if (requireAdmin) {
    const isAdmin =
      user?.authorities?.some(
        (authority) =>
          authority.authority ===
          "ROLE_ADMIN"
      ) ?? false;

    if (!isAdmin) {
      return (
        <Navigate
          to="/"
          replace
        />
      );
    }
  }

  return <Outlet />;
}
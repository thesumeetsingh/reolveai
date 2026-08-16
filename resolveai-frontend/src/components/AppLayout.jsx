import { useCallback, useEffect, useState } from "react";

import {
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  FolderKanban,
  LayoutDashboard,
  Menu,
  Moon,
  Settings,
  Sun,
  X,
} from "lucide-react";

import {
  NavLink,
  Outlet,
  useNavigate,
} from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import api from "../services/api";

import "./AppLayout.css";

export default function AppLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [systemStatus, setSystemStatus] = useState("checking");

  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const isAdmin =
    user?.authorities?.some(
      (authority) => authority.authority === "ROLE_ADMIN"
    ) ?? false;

  const navigation = [
    {
      label: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "Projects",
      path: "/projects",
      icon: FolderKanban,
    },
    {
      label: "Support Requests",
      path: "/support",
      icon: ClipboardList,
    },
  ];

  if (isAdmin) {
    navigation.push({
      label: "Administration",
      path: "/admin",
      icon: Settings,
    });
  }

  const checkSystemStatus = useCallback(async () => {
    try {
      setSystemStatus("checking");
      await api.get("/employee/dashboard", {
        timeout: 6000,
      });
      setSystemStatus("operational");
    } catch (error) {
      if (error.response) {
        setSystemStatus(
          error.response.status === 401
            ? "auth"
            : "degraded"
        );
      } else {
        setSystemStatus("offline");
      }
    }
  }, []);

  useEffect(() => {
    const initialCheck = window.setTimeout(
      checkSystemStatus,
      0
    );

    const interval = window.setInterval(
      checkSystemStatus,
      30000
    );

    return () => {
      window.clearTimeout(initialCheck);
      window.clearInterval(interval);
    };
  }, [checkSystemStatus]);

  const handleLogout = () => {
    setProfileOpen(false);
    logout();
    navigate("/login");
  };

  const statusConfig = {
    checking: {
      label: "Checking system",
      className: "status-checking",
    },
    operational: {
      label: "System operational",
      className: "status-operational",
    },
    degraded: {
      label: "Backend degraded",
      className: "status-degraded",
    },
    offline: {
      label: "Backend unavailable",
      className: "status-offline",
    },
    auth: {
      label: "Authentication issue",
      className: "status-degraded",
    },
  };

  const currentStatus = statusConfig[systemStatus];

  return (
    <div
      className={`app-layout ${
        sidebarCollapsed ? "sidebar-collapsed" : ""
      }`}
    >
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <div className="brand-mark">R</div>
            {!sidebarCollapsed && (
              <span className="brand-name">ResolveAI</span>
            )}
          </div>

          <button
            className="sidebar-collapse"
            onClick={() =>
              setSidebarCollapsed((current) => !current)
            }
            aria-label="Toggle sidebar"
          >
            {sidebarCollapsed ? (
              <ChevronRight size={17} />
            ) : (
              <ChevronLeft size={17} />
            )}
          </button>
        </div>

        <nav className="sidebar-navigation">
          <div className="navigation-section">
            {!sidebarCollapsed && (
              <span className="navigation-title">
                Workspace
              </span>
            )}

            {navigation.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `navigation-item ${
                      isActive
                        ? "navigation-item-active"
                        : ""
                    }`
                  }
                  title={
                    sidebarCollapsed
                      ? item.label
                      : undefined
                  }
                >
                  <Icon size={18} />
                  {!sidebarCollapsed && (
                    <span>{item.label}</span>
                  )}
                </NavLink>
              );
            })}
          </div>
        </nav>

        <div className="sidebar-bottom">
          {!sidebarCollapsed && (
            <button
              type="button"
              className={`sidebar-status ${currentStatus.className}`}
              onClick={checkSystemStatus}
              title="Click to check the backend again"
            >
              <span className="status-dot" />
              <span>{currentStatus.label}</span>
              {systemStatus === "checking" && (
                <span className="status-spinner" />
              )}
            </button>
          )}
        </div>
      </aside>

      <div className="app-main">
        <header className="topbar">
          <div className="topbar-left">
            <button
              className="mobile-menu-button"
              onClick={() =>
                setSidebarCollapsed((current) => !current)
              }
              aria-label="Toggle navigation"
            >
              <Menu size={20} />
            </button>

            <span className="topbar-title">ResolveAI</span>
          </div>

          <div className="topbar-actions">
            <button
              className="theme-button"
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun size={18} />
              ) : (
                <Moon size={18} />
              )}
            </button>

            <div className="profile-container">
              <button
                className="profile-button"
                onClick={() =>
                  setProfileOpen((current) => !current)
                }
                aria-label="Open profile menu"
              >
                <div className="profile-avatar">
                  {user?.username
                    ?.charAt(0)
                    ?.toUpperCase() || "U"}
                </div>
              </button>

              {profileOpen && (
                <div className="profile-menu">
                  <div className="profile-menu-user">
                    <div className="profile-menu-avatar">
                      {user?.username
                        ?.charAt(0)
                        ?.toUpperCase() || "U"}
                    </div>
                    <div>
                      <strong>
                        {user?.username || "User"}
                      </strong>
                      <span>
                        {isAdmin
                          ? "Administrator"
                          : "Employee"}
                      </span>
                    </div>
                  </div>

                  <div className="profile-menu-divider" />

                  <button
                    className="profile-menu-item profile-logout"
                    onClick={handleLogout}
                  >
                    <X size={16} />
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="app-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

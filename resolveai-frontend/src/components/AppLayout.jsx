import { useState } from "react";

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

import "./AppLayout.css";

export default function AppLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] =
    useState(false);

  const [profileOpen, setProfileOpen] =
    useState(false);

  const {
    user,
    logout,
  } = useAuth();

  const {
    theme,
    toggleTheme,
  } = useTheme();

  const navigate = useNavigate();

  const isAdmin =
    user?.authorities?.some(
      (authority) =>
        authority.authority ===
        "ROLE_ADMIN"
    ) ?? false;

  const navigation = [
    {
      label: "Dashboard",
      path: "/",
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

  const handleLogout = () => {
    setProfileOpen(false);
    logout();
    navigate("/login");
  };

  return (
    <div
      className={`app-layout ${
        sidebarCollapsed
          ? "sidebar-collapsed"
          : ""
      }`}
    >

      <aside className="sidebar">

        <div className="sidebar-header">

          <div className="sidebar-brand">

            <div className="brand-mark">
              R
            </div>

            {!sidebarCollapsed && (
              <span className="brand-name">
                ResolveAI
              </span>
            )}

          </div>

          <button
            className="sidebar-collapse"
            onClick={() =>
              setSidebarCollapsed(
                (current) => !current
              )
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

            {navigation.map(
              (item) => {
                const Icon =
                  item.icon;

                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({
                      isActive,
                    }) =>
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
                      <span>
                        {item.label}
                      </span>
                    )}
                  </NavLink>
                );
              }
            )}

          </div>

        </nav>

        <div className="sidebar-bottom">

          {!sidebarCollapsed && (
            <div className="sidebar-status">
              <span className="status-dot" />
              <span>
                System operational
              </span>
            </div>
          )}

        </div>

      </aside>

      <div className="app-main">

        <header className="topbar">

          <div className="topbar-left">

            <button
              className="mobile-menu-button"
              onClick={() =>
                setSidebarCollapsed(
                  (current) => !current
                )
              }
            >
              <Menu size={20} />
            </button>

            <span className="topbar-title">
              ResolveAI
            </span>

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
                  setProfileOpen(
                    (current) => !current
                  )
                }
              >
                <div className="profile-avatar">
                  {user?.username
                    ?.charAt(0)
                    ?.toUpperCase() ||
                    "U"}
                </div>
              </button>

              {profileOpen && (
                <div className="profile-menu">

                  <div className="profile-menu-user">

                    <div className="profile-menu-avatar">
                      {user?.username
                        ?.charAt(0)
                        ?.toUpperCase() ||
                        "U"}
                    </div>

                    <div>
                      <strong>
                        {user?.username ||
                          "User"}
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
                    onClick={
                      handleLogout
                    }
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
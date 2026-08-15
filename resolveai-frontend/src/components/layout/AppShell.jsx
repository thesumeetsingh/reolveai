import { useState } from "react";
import {
  Activity,
  Bot,
  ChevronLeft,
  ChevronRight,
  FolderKanban,
  LayoutDashboard,
  Moon,
  Settings,
  ShieldCheck,
  Sun,
  User,
} from "lucide-react";

import { useTheme } from "../../context/ThemeContext";

import "./AppShell.css";

const navigation = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Projects",
    icon: FolderKanban,
  },
  {
    label: "Incidents",
    icon: Activity,
  },
  {
    label: "AI Assistant",
    icon: Bot,
  },
];

const bottomNavigation = [
  {
    label: "Profile",
    icon: User,
  },
  {
    label: "Settings",
    icon: Settings,
  },
];

export default function AppShell({ children, isAdmin = false }) {
  const [collapsed, setCollapsed] = useState(false);
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="app-shell">
      <aside
        className={`sidebar ${
          collapsed ? "sidebar-collapsed" : ""
        }`}
      >
        <div className="sidebar-header">
          <div className="brand">
            <div className="brand-mark">R</div>

            {!collapsed && (
              <span className="brand-name">ResolveAI</span>
            )}
          </div>

          <button
            className="collapse-button"
            onClick={() => setCollapsed((value) => !value)}
            aria-label={
              collapsed
                ? "Expand navigation"
                : "Collapse navigation"
            }
          >
            {collapsed ? (
              <ChevronRight size={18} />
            ) : (
              <ChevronLeft size={18} />
            )}
          </button>
        </div>

        <nav className="sidebar-navigation">
          <div className="navigation-section">
            {!collapsed && (
              <span className="navigation-label">
                Workspace
              </span>
            )}

            {navigation.map((item) => {
              const Icon = item.icon;

              return (
                <button
                  className="navigation-item"
                  key={item.label}
                  title={collapsed ? item.label : undefined}
                >
                  <Icon size={19} strokeWidth={1.8} />

                  {!collapsed && (
                    <span>{item.label}</span>
                  )}
                </button>
              );
            })}

            {isAdmin && (
              <>
                {!collapsed && (
                  <span className="navigation-label admin-label">
                    Administration
                  </span>
                )}

                <button
                  className="navigation-item"
                  title={collapsed ? "Admin" : undefined}
                >
                  <ShieldCheck
                    size={19}
                    strokeWidth={1.8}
                  />

                  {!collapsed && <span>Admin</span>}
                </button>
              </>
            )}
          </div>
        </nav>

        <div className="sidebar-bottom">
          {bottomNavigation.map((item) => {
            const Icon = item.icon;

            return (
              <button
                className="navigation-item"
                key={item.label}
                title={collapsed ? item.label : undefined}
              >
                <Icon size={19} strokeWidth={1.8} />

                {!collapsed && (
                  <span>{item.label}</span>
                )}
              </button>
            );
          })}
        </div>
      </aside>

      <div
        className={`main-container ${
          collapsed ? "main-container-expanded" : ""
        }`}
      >
        <header className="top-header">
          <div className="header-spacer" />

          <div className="header-actions">
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

            <button
              className="profile-button"
              aria-label="Profile"
            >
              <div className="profile-avatar">U</div>
            </button>
          </div>
        </header>

        <main className="main-content">{children}</main>
      </div>
    </div>
  );
}
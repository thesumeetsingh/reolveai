import { useEffect, useMemo, useState } from "react";

import {
  AlertCircle,
  ArrowRight,
  FolderKanban,
  RefreshCw,
  Search,
  ShieldAlert,
  Users,
} from "lucide-react";

import { Link } from "react-router-dom";

import {
  getAdminDashboard,
  getAdminSupportRequests,
  getAdminUsers,
} from "../services/adminService";
import { getProjects } from "../services/projectService";

import "./Admin.css";

function label(value) {
  return String(value || "—")
    .replaceAll("_", " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

export default function Admin() {
  const [dashboard, setDashboard] = useState(null);
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [userSearch, setUserSearch] = useState("");
  const [incidentSearch, setIncidentSearch] = useState("");
  const [projectSearch, setProjectSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const loadAdmin = async (refresh = false) => {
    try {
      if (refresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const [dashboardData, userData, projectData, incidentData] =
        await Promise.all([
          getAdminDashboard(),
          getAdminUsers(),
          getProjects(),
          getAdminSupportRequests(),
        ]);

      setDashboard(dashboardData);
      setUsers(Array.isArray(userData) ? userData : []);
      setProjects(Array.isArray(projectData) ? projectData : []);
      setIncidents(Array.isArray(incidentData) ? incidentData : []);
    } catch (err) {
      console.error("Failed to load admin data:", err);
      setError(
        err.response?.data?.message ||
          "Unable to load administration data."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    let cancelled = false;

    const loadInitialAdmin = async () => {
      try {
        setLoading(true);
        setError("");

        const [dashboardData, userData, projectData, incidentData] =
          await Promise.all([
            getAdminDashboard(),
            getAdminUsers(),
            getProjects(),
            getAdminSupportRequests(),
          ]);

        if (cancelled) {
          return;
        }

        setDashboard(dashboardData);
        setUsers(Array.isArray(userData) ? userData : []);
        setProjects(Array.isArray(projectData) ? projectData : []);
        setIncidents(Array.isArray(incidentData) ? incidentData : []);
      } catch (err) {
        if (!cancelled) {
          console.error("Failed to load admin data:", err);
          setError(
            err.response?.data?.message ||
              "Unable to load administration data."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadInitialAdmin();

    return () => {
      cancelled = true;
    };
  }, []);

  const filteredUsers = useMemo(() => {
    const query = userSearch.trim().toLowerCase();

    if (!query) {
      return users;
    }

    return users.filter((user) =>
      [
        user.firstName,
        user.lastName,
        user.username,
        user.email,
        user.status,
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(query))
    );
  }, [users, userSearch]);

  const filteredProjects = useMemo(() => {
    const query = projectSearch.trim().toLowerCase();

    if (!query) {
      return projects;
    }

    return projects.filter((project) =>
      [project.projectCode, project.projectName, project.status]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(query))
    );
  }, [projects, projectSearch]);

  const filteredIncidents = useMemo(() => {
    const query = incidentSearch.trim().toLowerCase();

    const sorted = [...incidents].sort((a, b) => {
      const aDate = new Date(a.updatedAt || a.createdAt || 0).getTime();
      const bDate = new Date(b.updatedAt || b.createdAt || 0).getTime();
      return bDate - aDate;
    });

    if (!query) {
      return sorted;
    }

    return sorted.filter((incident) =>
      [
        incident.ticketNumber,
        incident.title,
        incident.projectName,
        incident.projectCode,
        incident.severity,
        incident.status,
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(query))
    );
  }, [incidents, incidentSearch]);

  return (
    <div className="admin-page">
      <section className="admin-header">
        <div>
          <p className="admin-eyebrow">Administration</p>
          <h1>System overview</h1>
          <p>
            Manage employees, inspect projects, and monitor incidents across
            ResolveAI.
          </p>
        </div>

        <button
          type="button"
          className="admin-refresh-button"
          onClick={() => loadAdmin(true)}
          disabled={loading || refreshing}
        >
          <RefreshCw
            size={14}
            className={refreshing ? "admin-refresh-spin" : ""}
          />
          Refresh
        </button>
      </section>

      {error && (
        <div className="admin-error">
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      <section className="admin-stats">
        <div className="admin-stat">
          <Users size={17} />
          <span>Employees</span>
          <strong>{loading ? "—" : dashboard?.totalEmployees ?? 0}</strong>
        </div>

        <div className="admin-stat">
          <FolderKanban size={17} />
          <span>Active projects</span>
          <strong>{loading ? "—" : dashboard?.activeProjects ?? 0}</strong>
        </div>

        <div className="admin-stat">
          <AlertCircle size={17} />
          <span>Open incidents</span>
          <strong>{loading ? "—" : dashboard?.openIncidents ?? 0}</strong>
        </div>

        <div className="admin-stat">
          <ShieldAlert size={17} />
          <span>Critical incidents</span>
          <strong>{loading ? "—" : dashboard?.criticalIncidents ?? 0}</strong>
        </div>
      </section>

      <section className="admin-grid">
        <div className="admin-panel">
          <div className="admin-panel-header admin-panel-header-with-tools">
            <div>
              <h2>Employees</h2>
              <p>Registered ResolveAI users</p>
            </div>

            <div className="admin-search">
              <Search size={13} />
              <input
                value={userSearch}
                onChange={(event) => setUserSearch(event.target.value)}
                placeholder="Search users"
              />
            </div>
          </div>

          <div className="admin-table">
            {filteredUsers.length ? (
              filteredUsers.map((employee) => (
                <div className="admin-table-row" key={employee.userId}>
                  <div>
                    <strong>
                      {employee.firstName} {employee.lastName}
                    </strong>
                    <span>@{employee.username}</span>
                  </div>
                  <span>{employee.email}</span>
                  <span
                    className={`admin-status admin-status-${String(
                      employee.status
                    ).toLowerCase()}`}
                  >
                    {employee.status}
                  </span>
                </div>
              ))
            ) : (
              <div className="admin-empty">No employees match the search.</div>
            )}
          </div>
        </div>

        <div className="admin-panel">
          <div className="admin-panel-header admin-panel-header-with-tools">
            <div>
              <h2>Incidents</h2>
              <p>All support requests reported across ResolveAI</p>
            </div>

            <div className="admin-search">
              <Search size={13} />
              <input
                value={incidentSearch}
                onChange={(event) => setIncidentSearch(event.target.value)}
                placeholder="Search incidents"
              />
            </div>
          </div>

          <div className="admin-table">
            {filteredIncidents.length ? (
              filteredIncidents.map((incident) => (
                <Link
                  key={incident.supportRequestId}
                  to={`/incidents/${incident.supportRequestId}`}
                  className="admin-table-row admin-incident-row"
                >
                  <div>
                    <strong>{incident.title || "Untitled incident"}</strong>
                    <span>{incident.ticketNumber}</span>
                  </div>
                  <span>{label(incident.severity)}</span>
                  <span>{label(incident.status)}</span>
                  <ArrowRight size={14} />
                </Link>
              ))
            ) : (
              <div className="admin-empty">No incidents match the search.</div>
            )}
          </div>
        </div>

        <div className="admin-panel admin-panel-wide">
          <div className="admin-panel-header admin-panel-header-with-tools">
            <div>
              <h2>Projects</h2>
              <p>All projects visible to the administrator</p>
            </div>

            <div className="admin-search">
              <Search size={13} />
              <input
                value={projectSearch}
                onChange={(event) => setProjectSearch(event.target.value)}
                placeholder="Search projects"
              />
            </div>
          </div>

          <div className="admin-project-table">
            <div className="admin-project-row admin-project-row-header">
              <span>Code</span>
              <span>Project</span>
              <span>Status</span>
              <span>Repository</span>
              <span />
            </div>

            {filteredProjects.length ? (
              filteredProjects.map((project) => (
                <div className="admin-project-row" key={project.projectId}>
                  <span className="admin-project-code">
                    {project.projectCode}
                  </span>
                  <div>
                    <strong>{project.projectName}</strong>
                    <span>{project.description || "No description"}</span>
                  </div>
                  <span className="admin-status">
                    {label(project.status)}
                  </span>
                  <span className="admin-project-repository">
                    {project.repositoryUrl || "—"}
                  </span>
                  <Link
                    to={`/projects/${project.projectId}`}
                    className="admin-project-open"
                  >
                    Open
                    <ArrowRight size={13} />
                  </Link>
                </div>
              ))
            ) : (
              <div className="admin-empty">No projects match the search.</div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

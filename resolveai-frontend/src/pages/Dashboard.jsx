import { useEffect, useState } from "react";

import {
  Activity,
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  FolderKanban,
  Plus,
  ShieldAlert,
} from "lucide-react";

import { Link } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { getEmployeeDashboard } from "../services/dashboardService";
import { getProjects } from "../services/projectService";

import "./Dashboard.css";

function formatDate(value) {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleDateString(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getIncidentProject(incident) {
  return (
    incident?.project?.projectName ||
    incident?.project?.name ||
    incident?.projectName ||
    "Project"
  );
}

function getIncidentProjectCode(incident) {
  return (
    incident?.project?.projectCode ||
    incident?.projectCode ||
    ""
  );
}

function getSeverityClass(severity) {
  return `incident-severity incident-severity-${String(
    severity || "medium"
  ).toLowerCase()}`;
}

function getStatusClass(status) {
  return `incident-status incident-status-${String(
    status || "open"
  ).toLowerCase()}`;
}

export default function Dashboard() {
  const { user } = useAuth();

  const [dashboard, setDashboard] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        const [dashboardData, projectData] =
          await Promise.all([
            getEmployeeDashboard(),
            getProjects(),
          ]);

        setDashboard(dashboardData);
        setProjects(projectData || []);
      } catch (err) {
        console.error(
          "Failed to load dashboard:",
          err
        );

        setError(
          err.response?.data?.message ||
            "Unable to load dashboard data."
        );
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const stats = [
    {
      label: "My Projects",
      value: dashboard?.myProjects ?? 0,
      icon: FolderKanban,
      type: "normal",
    },
    {
      label: "Open Incidents",
      value: dashboard?.openIncidents ?? 0,
      icon: Activity,
      type: "normal",
    },
    {
      label: "Critical Incidents",
      value: dashboard?.criticalIncidents ?? 0,
      icon: ShieldAlert,
      type: "critical",
    },
    {
      label: "Resolved Incidents",
      value: dashboard?.resolvedIncidents ?? 0,
      icon: CheckCircle2,
      type: "success",
    },
  ];

  const recentIncidents =
    dashboard?.recentReportedIncidents || [];

  const visibleProjects = projects.slice(0, 5);

  return (
    <div className="dashboard">

      <section className="dashboard-header">

        <div>
          <p className="dashboard-eyebrow">
            Developer workspace
          </p>

          <h1>
            Welcome back,
            <span>
              {" "}
              {user?.username || "User"}
            </span>
          </h1>

          <p className="dashboard-description">
            Monitor projects, investigate incidents,
            and get AI-assisted technical support.
          </p>
        </div>

        <Link
          to="/support/new"
          className="dashboard-primary-action"
        >
          <Plus size={15} />
          Create support request
        </Link>

      </section>

      {error && (
        <div className="dashboard-error">
          <AlertCircle size={17} />
          <span>{error}</span>
        </div>
      )}

      <section className="stats-grid">

        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              className="stat-card"
              key={stat.label}
            >

              <div className="stat-card-top">

                <span className="stat-label">
                  {stat.label}
                </span>

                <div
                  className={`stat-icon stat-icon-${stat.type}`}
                >
                  <Icon size={17} />
                </div>

              </div>

              <strong
                className={`stat-value ${
                  loading
                    ? "stat-value-loading"
                    : ""
                }`}
              >
                {loading
                  ? "—"
                  : stat.value}
              </strong>

            </div>
          );
        })}

      </section>

      <section className="dashboard-grid">

        {/* RECENT INCIDENTS */}

        <div className="dashboard-panel">

          <div className="panel-header">

            <div>
              <h2>
                Recent incidents
              </h2>

              <p>
                Your latest reported incidents
              </p>
            </div>

            <div className="dashboard-panel-actions">
              <Link
                to="/support"
                className="panel-action"
              >
                View all
              </Link>

              <Link
                to="/support/new"
                className="panel-action"
              >
                Create request
              </Link>
            </div>

          </div>

          {loading ? (
            <div className="dashboard-list-state">
              <div className="dashboard-small-spinner" />
              <span>
                Loading incidents...
              </span>
            </div>
          ) : recentIncidents.length === 0 ? (
            <div className="empty-state">

              <div className="empty-state-icon">
                <AlertCircle size={20} />
              </div>

              <h3>
                No incidents yet
              </h3>

              <p>
                Incidents reported for your
                projects will appear here.
              </p>

            </div>
          ) : (
            <div className="incident-list">

              {recentIncidents.map(
                (incident) => (
                  <Link
                    to={`/incidents/${incident.supportRequestId}`}
                    className="incident-row"
                    key={
                      incident.supportRequestId ||
                      incident.ticketNumber
                    }
                  >

                    <div className="incident-row-main">

                      <div className="incident-row-title">
                        {incident.title ||
                          "Untitled incident"}
                      </div>

                      <div className="incident-row-meta">

                        <span>
                          {incident.ticketNumber ||
                            "No ticket number"}
                        </span>

                        <span>
                          {getIncidentProjectCode(
                            incident
                          )}

                          {getIncidentProjectCode(
                            incident
                          )
                            ? " — "
                            : ""}

                          {getIncidentProject(
                            incident
                          )}
                        </span>

                        <span>
                          {formatDate(
                            incident.createdAt
                          )}
                        </span>

                      </div>

                    </div>

                    <div className="incident-row-right">

                      <span
                        className={getSeverityClass(
                          incident.severity
                        )}
                      >
                        {incident.severity ||
                          "MEDIUM"}
                      </span>

                      <span
                        className={getStatusClass(
                          incident.status
                        )}
                      >
                        {incident.status ||
                          "OPEN"}
                      </span>

                    </div>

                  </Link>
                )
              )}

            </div>
          )}

        </div>


        {/* PROJECTS */}

        <div className="dashboard-panel">

          <div className="panel-header">

            <div>
              <h2>
                Projects
              </h2>

              <p>
                Your projects
              </p>
            </div>

            <Link
              to="/projects"
              className="panel-action"
            >
              View all
            </Link>

          </div>

          {loading ? (
            <div className="dashboard-list-state">
              <div className="dashboard-small-spinner" />
              <span>
                Loading projects...
              </span>
            </div>
          ) : visibleProjects.length === 0 ? (
            <div className="empty-state">

              <div className="empty-state-icon">
                <FolderKanban size={20} />
              </div>

              <h3>
                No projects yet
              </h3>

              <p>
                Create or join a project to start
                managing incidents and support.
              </p>

              <Link
                to="/projects"
                className="empty-state-link"
              >
                Open projects
                <ArrowRight size={14} />
              </Link>

            </div>
          ) : (
            <div className="dashboard-project-list">

              {visibleProjects.map(
                (project) => (
                  <Link
                    key={project.projectId}
                    to={`/projects/${project.projectId}`}
                    className="dashboard-project-row"
                  >

                    <div className="dashboard-project-icon">
                      <FolderKanban size={16} />
                    </div>

                    <div className="dashboard-project-info">

                      <strong>
                        {project.projectName}
                      </strong>

                      <span>
                        {project.projectCode}
                      </span>

                    </div>

                    <span
                      className={`dashboard-project-status status-${String(
                        project.status
                      ).toLowerCase()}`}
                    >
                      {project.status}
                    </span>

                    <ArrowRight size={14} />

                  </Link>
                )
              )}

            </div>
          )}

        </div>

      </section>

    </div>
  );
}
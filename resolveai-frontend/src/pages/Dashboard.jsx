import { useEffect, useState } from "react";

import {
  Activity,
  AlertCircle,
  CheckCircle2,
  FolderKanban,
  ShieldAlert,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import { getEmployeeDashboard } from "../services/dashboardService";

import "./Dashboard.css";

function getDashboardValue(data, keys) {
  for (const key of keys) {
    if (
      data &&
      data[key] !== undefined &&
      data[key] !== null
    ) {
      return data[key];
    }
  }

  return 0;
}

export default function Dashboard() {
  const { user } = useAuth();

  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        const data =
          await getEmployeeDashboard();

        setDashboard(data);
      } catch (err) {
        console.error(
          "Failed to load employee dashboard:",
          err
        );

        setError(
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
      label: "Active Projects",
      value: getDashboardValue(
        dashboard,
        [
          "activeProjects",
          "totalActiveProjects",
          "projectCount",
        ]
      ),
      icon: FolderKanban,
      type: "normal",
    },
    {
      label: "Open Incidents",
      value: getDashboardValue(
        dashboard,
        [
          "openIncidents",
          "totalOpenIncidents",
          "assignedOpenIncidents",
        ]
      ),
      icon: Activity,
      type: "normal",
    },
    {
      label: "Critical Incidents",
      value: getDashboardValue(
        dashboard,
        [
          "criticalIncidents",
          "totalCriticalIncidents",
          "assignedCriticalIncidents",
        ]
      ),
      icon: ShieldAlert,
      type: "critical",
    },
    {
      label: "Resolved Incidents",
      value: getDashboardValue(
        dashboard,
        [
          "resolvedIncidents",
          "totalResolvedIncidents",
          "assignedResolvedIncidents",
        ]
      ),
      icon: CheckCircle2,
      type: "success",
    },
  ];

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
                {loading ? "—" : stat.value}
              </strong>

            </div>
          );
        })}

      </section>

      <section className="dashboard-grid">

        <div className="dashboard-panel">

          <div className="panel-header">

            <div>
              <h2>Recent incidents</h2>

              <p>
                Your latest incident activity
              </p>
            </div>

            <button className="panel-action">
              View all
            </button>

          </div>

          <div className="empty-state">

            <div className="empty-state-icon">
              <AlertCircle size={20} />
            </div>

            <h3>No incidents yet</h3>

            <p>
              Incidents created for your projects
              will appear here.
            </p>

          </div>

        </div>

        <div className="dashboard-panel">

          <div className="panel-header">

            <div>
              <h2>Projects</h2>

              <p>
                Your active projects
              </p>
            </div>

            <button className="panel-action">
              View all
            </button>

          </div>

          <div className="empty-state">

            <div className="empty-state-icon">
              <FolderKanban size={20} />
            </div>

            <h3>
              {loading
                ? "Loading projects"
                : "No projects yet"}
            </h3>

            <p>
              Create or join a project to
              start managing incidents.
            </p>

          </div>

        </div>

      </section>

    </div>
  );
}
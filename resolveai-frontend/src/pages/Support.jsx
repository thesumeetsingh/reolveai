import { useEffect, useMemo, useState } from "react";

import {
  AlertCircle,
  ArrowRight,
  ClipboardList,
  FileWarning,
  Filter,
  Plus,
  RefreshCw,
  Search,
  X,
} from "lucide-react";

import { Link } from "react-router-dom";

import { getMySupportRequests } from "../services/supportService";

import "./Support.css";

function formatDateTime(value) {
  if (!value) {
    return "—";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleString(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function label(value) {
  return String(value || "—")
    .replaceAll("_", " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function sortByActivity(items) {
  return [...items].sort((a, b) => {
    const aDate = new Date(a.updatedAt || a.createdAt || 0).getTime();
    const bDate = new Date(b.updatedAt || b.createdAt || 0).getTime();
    return bDate - aDate;
  });
}

export default function Support() {
  const [requests, setRequests] = useState([]);
  const [activeTab, setActiveTab] = useState("requests");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [severityFilter, setSeverityFilter] = useState("ALL");
  const [sortOrder, setSortOrder] = useState("NEWEST");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const loadRequests = async (showRefreshState = false) => {
    try {
      if (showRefreshState) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const data = await getMySupportRequests();
      setRequests(sortByActivity(Array.isArray(data) ? data : []));
    } catch (err) {
      console.error("Failed to load support requests:", err);
      setError(
        err.response?.data?.message ||
          "Unable to load your support requests."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    let cancelled = false;

    const loadInitialRequests = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getMySupportRequests();

        if (!cancelled) {
          setRequests(sortByActivity(Array.isArray(data) ? data : []));
        }
      } catch (err) {
        if (!cancelled) {
          console.error("Failed to load support requests:", err);
          setError(
            err.response?.data?.message ||
              "Unable to load your support requests."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadInitialRequests();

    return () => {
      cancelled = true;
    };
  }, []);

  const incidents = useMemo(
    () => requests.filter((request) => request.supportRequestId),
    [requests]
  );

  const visibleRows = useMemo(() => {
    const source = activeTab === "requests" ? requests : incidents;
    const query = searchTerm.trim().toLowerCase();

    const filtered = source.filter((request) => {
      const matchesSearch = !query || [
        request.ticketNumber,
        request.title,
        request.projectName,
        request.projectCode,
        request.incidentType,
      ].some((value) =>
        String(value || "").toLowerCase().includes(query)
      );

      const matchesStatus =
        statusFilter === "ALL" || request.status === statusFilter;

      const matchesSeverity =
        severityFilter === "ALL" || request.severity === severityFilter;

      return matchesSearch && matchesStatus && matchesSeverity;
    });

    return [...filtered].sort((a, b) => {
      const aDate = new Date(a.updatedAt || a.createdAt || 0).getTime();
      const bDate = new Date(b.updatedAt || b.createdAt || 0).getTime();
      return sortOrder === "OLDEST" ? aDate - bDate : bDate - aDate;
    });
  }, [
    activeTab,
    incidents,
    requests,
    searchTerm,
    severityFilter,
    sortOrder,
    statusFilter,
  ]);

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("ALL");
    setSeverityFilter("ALL");
    setSortOrder("NEWEST");
  };

  const filtersActive =
    searchTerm.trim() ||
    statusFilter !== "ALL" ||
    severityFilter !== "ALL" ||
    sortOrder !== "NEWEST";

  return (
    <div className="support-page">
      <section className="support-header support-list-header">
        <div>
          <p className="support-eyebrow">Incident management</p>
          <h1>Support requests</h1>
          <p>
            Track your submitted support requests and open their incidents.
          </p>
        </div>

        <div className="support-header-actions">
          <button
            type="button"
            className="support-refresh-button"
            onClick={() => loadRequests(true)}
            disabled={loading || refreshing}
            title="Refresh"
          >
            <RefreshCw
              size={14}
              className={refreshing ? "support-refresh-spin" : ""}
            />
            Refresh
          </button>

          <Link to="/support/new" className="support-create-button">
            <Plus size={15} />
            Create support request
          </Link>
        </div>
      </section>

      {error && (
        <div className="support-alert support-alert-error">
          <AlertCircle size={17} />
          <span>{error}</span>
        </div>
      )}

      <section className="support-list-panel">
        <div className="support-tabs">
          <button
            type="button"
            className={`support-tab ${
              activeTab === "requests" ? "active" : ""
            }`}
            onClick={() => setActiveTab("requests")}
          >
            <ClipboardList size={15} />
            Support Requests
            <span>{requests.length}</span>
          </button>

          <button
            type="button"
            className={`support-tab support-tab-incidents ${
              activeTab === "incidents" ? "active" : ""
            }`}
            onClick={() => setActiveTab("incidents")}
          >
            <FileWarning size={15} />
            Incidents
            <span>{incidents.length}</span>
          </button>
        </div>

        <div className="support-list-heading">
          <div>
            <h2>
              {activeTab === "requests"
                ? "Your support requests"
                : "Your incidents"}
            </h2>
            <p>
              Search, filter and sort your records.
            </p>
          </div>

          <span className="support-result-count">
            {visibleRows.length} {visibleRows.length === 1 ? "record" : "records"}
          </span>
        </div>

        <div className="support-filters">
          <div className="support-search-box">
            <Search size={14} />
            <input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search ticket, title, project..."
              aria-label="Search support requests"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                aria-label="Clear search"
              >
                <X size={13} />
              </button>
            )}
          </div>

          <label className="support-filter-field">
            <span>Status</span>
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
            >
              <option value="ALL">All</option>
              <option value="OPEN">Open</option>
              <option value="TRIAGED">Triaged</option>
              <option value="IN_PROGRESS">In progress</option>
              <option value="WAITING_FOR_INFORMATION">Waiting</option>
              <option value="RESOLVED">Resolved</option>
              <option value="CLOSED">Closed</option>
              <option value="REOPENED">Reopened</option>
            </select>
          </label>

          <label className="support-filter-field">
            <span>Severity</span>
            <select
              value={severityFilter}
              onChange={(event) => setSeverityFilter(event.target.value)}
            >
              <option value="ALL">All</option>
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="CRITICAL">Critical</option>
            </select>
          </label>

          <label className="support-filter-field">
            <span>Sort</span>
            <select
              value={sortOrder}
              onChange={(event) => setSortOrder(event.target.value)}
            >
              <option value="NEWEST">Newest activity</option>
              <option value="OLDEST">Oldest activity</option>
            </select>
          </label>

          {filtersActive && (
            <button
              type="button"
              className="support-clear-filters"
              onClick={clearFilters}
            >
              <Filter size={13} />
              Clear
            </button>
          )}
        </div>

        {loading ? (
          <div className="support-table-state">
            <span className="support-button-spinner support-dark-spinner" />
            Loading support requests...
          </div>
        ) : visibleRows.length === 0 ? (
          <div className="support-table-state support-empty-state">
            <div className="support-empty-icon">
              <ClipboardList size={20} />
            </div>
            <h3>
              {filtersActive
                ? "No matching records"
                : activeTab === "requests"
                  ? "No support requests yet"
                  : "No incidents yet"}
            </h3>
            <p>
              {filtersActive
                ? "Try changing your search or filters."
                : "Create a support request for one of your projects to start an incident investigation."}
            </p>
            {filtersActive ? (
              <button
                type="button"
                className="support-empty-action"
                onClick={clearFilters}
              >
                <X size={14} />
                Clear filters
              </button>
            ) : (
              <Link to="/support/new" className="support-empty-action">
                <Plus size={14} />
                Create support request
              </Link>
            )}
          </div>
        ) : (
          <div className="support-table-wrapper">
            <table className="support-table">
              <thead>
                <tr>
                  <th>Ticket</th>
                  <th>{activeTab === "requests" ? "Request" : "Incident"}</th>
                  <th>Project</th>
                  <th>Severity</th>
                  <th>Status</th>
                  <th>Last activity</th>
                  <th />
                </tr>
              </thead>

              <tbody>
                {visibleRows.map((request) => (
                  <tr key={request.supportRequestId}>
                    <td>
                      <span className="support-ticket">
                        {request.ticketNumber || "—"}
                      </span>
                    </td>

                    <td>
                      <div className="support-request-cell">
                        <strong>{request.title || "Untitled request"}</strong>
                        <span>{label(request.incidentType)}</span>
                      </div>
                    </td>

                    <td>
                      <div className="support-project-cell">
                        <strong>{request.projectName || "—"}</strong>
                        <span>{request.projectCode || ""}</span>
                      </div>
                    </td>

                    <td>
                      <span
                        className={`support-severity support-severity-${String(
                          request.severity || "medium"
                        ).toLowerCase()}`}
                      >
                        {label(request.severity)}
                      </span>
                    </td>

                    <td>
                      <span
                        className={`support-status support-status-${String(
                          request.status || "open"
                        ).toLowerCase()}`}
                      >
                        {label(request.status)}
                      </span>
                    </td>

                    <td>
                      <span className="support-date">
                        {formatDateTime(request.updatedAt || request.createdAt)}
                      </span>
                    </td>

                    <td className="support-action-cell">
                      <Link
                        to={`/incidents/${request.supportRequestId}`}
                        className="support-incident-button"
                      >
                        Open incident
                        <ArrowRight size={13} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

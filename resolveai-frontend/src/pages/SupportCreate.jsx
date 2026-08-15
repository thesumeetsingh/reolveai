import { useEffect, useState } from "react";

import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Send,
} from "lucide-react";

import { Link, useNavigate } from "react-router-dom";

import { createSupportRequest } from "../services/supportService";
import { getProjects, getProjectServices } from "../services/projectService";

import "./SupportCreate.css";

const INCIDENT_TYPES = [
  "BUG",
  "PRODUCTION_INCIDENT",
  "PERFORMANCE",
  "DEPLOYMENT_FAILURE",
  "SECURITY",
  "DATABASE",
  "NETWORK",
  "CONFIGURATION",
  "OTHER",
];

const SEVERITIES = ["LOW", "MEDIUM", "HIGH", "CRITICAL"];

const ENVIRONMENTS = [
  "PRODUCTION",
  "STAGING",
  "DEVELOPMENT",
  "TEST",
];

const initialForm = {
  projectId: "",
  title: "",
  description: "",
  incidentType: "BUG",
  severity: "MEDIUM",
  environment: "",
  affectedService: "",
  affectedVersion: "",
  errorCode: "",
  expectedBehavior: "",
  actualBehavior: "",
};

function label(value) {
  return String(value || "")
    .replaceAll("_", " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

export default function SupportCreate() {
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [services, setServices] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [loadingServices, setLoadingServices] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const loadProjects = async () => {
      try {
        setLoadingProjects(true);
        setError("");

        const data = await getProjects();

        if (cancelled) {
          return;
        }

        const availableProjects = Array.isArray(data) ? data : [];
        setProjects(availableProjects);

        if (availableProjects.length > 0) {
          const firstProjectId = String(availableProjects[0].projectId);
          setForm((current) => ({
            ...current,
            projectId: firstProjectId,
          }));
        }
      } catch (err) {
        if (!cancelled) {
          console.error("Failed to load projects:", err);
          setError(
            err.response?.data?.message ||
              "Unable to load your projects."
          );
        }
      } finally {
        if (!cancelled) {
          setLoadingProjects(false);
        }
      }
    };

    loadProjects();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    const loadServices = async () => {
      if (!form.projectId) {
        setServices([]);
        return;
      }

      try {
        setLoadingServices(true);
        const data = await getProjectServices(form.projectId);

        if (!cancelled) {
          setServices(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        if (!cancelled) {
          console.error("Failed to load project services:", err);
          setServices([]);
          setError(
            err.response?.data?.message ||
              "Unable to load services for this project."
          );
        }
      } finally {
        if (!cancelled) {
          setLoadingServices(false);
        }
      }
    };

    loadServices();

    return () => {
      cancelled = true;
    };
  }, [form.projectId]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
      ...(name === "projectId" ? { affectedService: "" } : {}),
    }));

    setError("");
    setSuccess(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.projectId) {
      setError("Please select a project.");
      return;
    }

    if (!form.title.trim()) {
      setError("Please enter an incident title.");
      return;
    }

    if (!form.description.trim()) {
      setError("Please describe the incident.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");
      setSuccess(null);

      const response = await createSupportRequest({
        ...form,
        projectId: Number(form.projectId),
        title: form.title.trim(),
        description: form.description.trim(),
        affectedService: form.affectedService || null,
        affectedVersion: form.affectedVersion.trim() || null,
        errorCode: form.errorCode.trim() || null,
        expectedBehavior: form.expectedBehavior.trim() || null,
        actualBehavior: form.actualBehavior.trim() || null,
      });

      setSuccess(response);
      setForm((current) => ({
        ...initialForm,
        projectId: current.projectId,
      }));
    } catch (err) {
      console.error("Failed to create support request:", err);
      setError(
        err.response?.data?.message ||
          "Unable to create support request."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="support-create-page">
      <Link to="/support" className="support-create-back">
        <ArrowLeft size={15} />
        Back to support requests
      </Link>

      <section className="support-create-header">
        <div>
          <p className="support-create-eyebrow">Incident management</p>
          <h1>Create support request</h1>
          <p>
            Report an incident or technical issue for one of your projects.
          </p>
        </div>
      </section>

      {error && (
        <div className="support-create-alert support-create-alert-error">
          <AlertCircle size={17} />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="support-create-alert support-create-alert-success">
          <CheckCircle2 size={17} />
          <div>
            <strong>Support request created</strong>
            <span>
              Ticket {success.ticketNumber} has been created successfully.
            </span>
            {success.supportRequestId && (
              <button
                type="button"
                className="support-create-open-button"
                onClick={() =>
                  navigate(`/incidents/${success.supportRequestId}`)
                }
              >
                Open incident
              </button>
            )}
          </div>
        </div>
      )}

      <form className="support-create-form" onSubmit={handleSubmit}>
        <section className="support-create-panel">
          <div className="support-create-panel-header">
            <div>
              <h2>Incident information</h2>
              <p>Basic information about the issue.</p>
            </div>
          </div>

          <div className="support-create-grid">
            <div className="support-create-field">
              <label htmlFor="projectId">Project</label>
              <select
                id="projectId"
                name="projectId"
                value={form.projectId}
                onChange={handleChange}
                disabled={loadingProjects || submitting}
                required
              >
                <option value="">
                  {loadingProjects ? "Loading projects..." : "Select project"}
                </option>
                {projects.map((project) => (
                  <option key={project.projectId} value={project.projectId}>
                    {project.projectCode} — {project.projectName}
                  </option>
                ))}
              </select>
            </div>

            <div className="support-create-field">
              <label htmlFor="title">Title</label>
              <input
                id="title"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Briefly describe the issue"
                maxLength={250}
                disabled={submitting}
                required
              />
            </div>

            <div className="support-create-field">
              <label htmlFor="incidentType">Incident type</label>
              <select
                id="incidentType"
                name="incidentType"
                value={form.incidentType}
                onChange={handleChange}
                disabled={submitting}
                required
              >
                {INCIDENT_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {label(type)}
                  </option>
                ))}
              </select>
            </div>

            <div className="support-create-field">
              <label htmlFor="severity">Severity</label>
              <select
                id="severity"
                name="severity"
                value={form.severity}
                onChange={handleChange}
                disabled={submitting}
                required
              >
                {SEVERITIES.map((severity) => (
                  <option key={severity} value={severity}>
                    {label(severity)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="support-create-field support-create-field-full">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Describe what happened and when it started."
              maxLength={5000}
              rows={5}
              disabled={submitting}
              required
            />
            <span className="support-create-counter">
              {form.description.length}/5000
            </span>
          </div>
        </section>

        <section className="support-create-panel">
          <div className="support-create-panel-header">
            <div>
              <h2>Technical details</h2>
              <p>Information that can help investigate the incident.</p>
            </div>
          </div>

          <div className="support-create-grid">
            <div className="support-create-field">
              <label htmlFor="environment">Environment</label>
              <select
                id="environment"
                name="environment"
                value={form.environment}
                onChange={handleChange}
                disabled={submitting}
              >
                <option value="">Select environment</option>
                {ENVIRONMENTS.map((environment) => (
                  <option key={environment} value={environment}>
                    {label(environment)}
                  </option>
                ))}
              </select>
            </div>

            <div className="support-create-field">
              <label htmlFor="affectedService">Affected service</label>
              <select
                id="affectedService"
                name="affectedService"
                value={form.affectedService}
                onChange={handleChange}
                disabled={submitting || loadingServices || !form.projectId}
              >
                <option value="">
                  {!form.projectId
                    ? "Select a project first"
                    : loadingServices
                      ? "Loading services..."
                      : services.length === 0
                        ? "No services configured"
                        : "Select affected service"}
                </option>
                {services.map((service) => (
                  <option key={service.serviceId} value={service.serviceName}>
                    {service.serviceName}
                  </option>
                ))}
              </select>
            </div>

            <div className="support-create-field">
              <label htmlFor="affectedVersion">Affected version</label>
              <input
                id="affectedVersion"
                name="affectedVersion"
                value={form.affectedVersion}
                onChange={handleChange}
                placeholder="e.g. v2.4.1"
                maxLength={100}
                disabled={submitting}
              />
            </div>

            <div className="support-create-field">
              <label htmlFor="errorCode">Error code</label>
              <input
                id="errorCode"
                name="errorCode"
                value={form.errorCode}
                onChange={handleChange}
                placeholder="e.g. HTTP-500"
                maxLength={1000}
                disabled={submitting}
              />
            </div>
          </div>
        </section>

        <section className="support-create-panel">
          <div className="support-create-panel-header">
            <div>
              <h2>Expected vs actual behavior</h2>
              <p>Describe what should have happened and what actually happened.</p>
            </div>
          </div>

          <div className="support-create-grid">
            <div className="support-create-field">
              <label htmlFor="expectedBehavior">Expected behavior</label>
              <textarea
                id="expectedBehavior"
                name="expectedBehavior"
                value={form.expectedBehavior}
                onChange={handleChange}
                placeholder="What should have happened?"
                maxLength={5000}
                rows={5}
                disabled={submitting}
              />
            </div>

            <div className="support-create-field">
              <label htmlFor="actualBehavior">Actual behavior</label>
              <textarea
                id="actualBehavior"
                name="actualBehavior"
                value={form.actualBehavior}
                onChange={handleChange}
                placeholder="What actually happened?"
                maxLength={5000}
                rows={5}
                disabled={submitting}
              />
            </div>
          </div>
        </section>

        <div className="support-create-submit-row">
          <button
            type="submit"
            className="support-create-submit-button"
            disabled={
              submitting || loadingProjects || projects.length === 0
            }
          >
            {submitting ? (
              <>
                <span className="support-create-spinner" />
                Creating...
              </>
            ) : (
              <>
                <Send size={15} />
                Create support request
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

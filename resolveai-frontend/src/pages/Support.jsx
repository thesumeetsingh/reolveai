import { useEffect, useState } from "react";

import {
  AlertCircle,
  CheckCircle2,
  Send,
} from "lucide-react";

import {
  createSupportRequest,
} from "../services/supportService";

import {
  getProjects,
} from "../services/projectService";

import "./Support.css";

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

const SEVERITIES = [
  "LOW",
  "MEDIUM",
  "HIGH",
  "CRITICAL",
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

export default function Support() {
  const [projects, setProjects] = useState([]);

  const [form, setForm] =
    useState(initialForm);

  const [loadingProjects, setLoadingProjects] =
    useState(true);

  const [submitting, setSubmitting] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState(null);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const data = await getProjects();

        setProjects(data);

        if (data.length > 0) {
          setForm((current) => ({
            ...current,
            projectId: String(
              data[0].projectId
            ),
          }));
        }
      } catch (err) {
        console.error(
          "Failed to load projects:",
          err
        );

        setError(
          "Unable to load your projects."
        );
      } finally {
        setLoadingProjects(false);
      }
    };

    loadProjects();
  }, []);

  const handleChange = (event) => {
    const {
      name,
      value,
    } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));

    setError("");
    setSuccess(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.projectId) {
      setError(
        "Please select a project."
      );

      return;
    }

    try {
      setSubmitting(true);
      setError("");
      setSuccess(null);

      const requestData = {
        ...form,
        projectId: Number(
          form.projectId
        ),
      };

      const response =
        await createSupportRequest(
          requestData
        );

      setSuccess(response);

      setForm({
        ...initialForm,
        projectId: form.projectId,
      });
    } catch (err) {
      console.error(
        "Failed to create support request:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Unable to create support request."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="support-page">

      <section className="support-header">

        <div>
          <p className="support-eyebrow">
            Incident management
          </p>

          <h1>
            Create support request
          </h1>

          <p>
            Report an incident or technical issue
            for one of your projects.
          </p>
        </div>

      </section>

      {error && (
        <div className="support-alert support-alert-error">
          <AlertCircle size={17} />

          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="support-alert support-alert-success">

          <CheckCircle2 size={17} />

          <div>
            <strong>
              Support request created
            </strong>

            <span>
              Ticket{" "}
              {success.ticketNumber}
              {" "}has been created successfully.
            </span>
          </div>

        </div>
      )}

      <form
        className="support-form"
        onSubmit={handleSubmit}
      >

        <section className="support-panel">

          <div className="support-panel-header">
            <div>
              <h2>Incident information</h2>

              <p>
                Basic information about the issue.
              </p>
            </div>
          </div>

          <div className="support-form-grid">

            <div className="support-field">

              <label htmlFor="projectId">
                Project
              </label>

              <select
                id="projectId"
                name="projectId"
                value={form.projectId}
                onChange={handleChange}
                disabled={
                  loadingProjects ||
                  submitting
                }
                required
              >
                <option value="">
                  {loadingProjects
                    ? "Loading projects..."
                    : "Select project"}
                </option>

                {projects.map((project) => (
                  <option
                    key={project.projectId}
                    value={project.projectId}
                  >
                    {project.projectCode} —{" "}
                    {project.projectName}
                  </option>
                ))}
              </select>

            </div>

            <div className="support-field">

              <label htmlFor="title">
                Title
              </label>

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

            <div className="support-field">

              <label htmlFor="incidentType">
                Incident type
              </label>

              <select
                id="incidentType"
                name="incidentType"
                value={form.incidentType}
                onChange={handleChange}
                disabled={submitting}
                required
              >
                {INCIDENT_TYPES.map(
                  (type) => (
                    <option
                      key={type}
                      value={type}
                    >
                      {type.replaceAll(
                        "_",
                        " "
                      )}
                    </option>
                  )
                )}
              </select>

            </div>

            <div className="support-field">

              <label htmlFor="severity">
                Severity
              </label>

              <select
                id="severity"
                name="severity"
                value={form.severity}
                onChange={handleChange}
                disabled={submitting}
                required
              >
                {SEVERITIES.map(
                  (severity) => (
                    <option
                      key={severity}
                      value={severity}
                    >
                      {severity}
                    </option>
                  )
                )}
              </select>

            </div>

          </div>

          <div className="support-field support-field-full">

            <label htmlFor="description">
              Description
            </label>

            <textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Describe what happened and when it started."
              maxLength={5000}
              rows={5}
              disabled={submitting}
            />

          </div>

        </section>

        <section className="support-panel">

          <div className="support-panel-header">
            <div>
              <h2>
                Technical details
              </h2>

              <p>
                Add information that can help
                investigate the incident.
              </p>
            </div>
          </div>

          <div className="support-form-grid">

            <div className="support-field">

              <label htmlFor="environment">
                Environment
              </label>

              <input
                id="environment"
                name="environment"
                value={form.environment}
                onChange={handleChange}
                placeholder="Production / Staging"
                maxLength={100}
                disabled={submitting}
              />

            </div>

            <div className="support-field">

              <label htmlFor="affectedService">
                Affected service
              </label>

              <input
                id="affectedService"
                name="affectedService"
                value={form.affectedService}
                onChange={handleChange}
                placeholder="e.g. authentication-service"
                maxLength={100}
                disabled={submitting}
              />

            </div>

            <div className="support-field">

              <label htmlFor="affectedVersion">
                Affected version
              </label>

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

            <div className="support-field">

              <label htmlFor="errorCode">
                Error code
              </label>

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

        <section className="support-panel">

          <div className="support-panel-header">
            <div>
              <h2>
                Expected vs actual behavior
              </h2>

              <p>
                Describe what should have happened
                and what actually happened.
              </p>
            </div>
          </div>

          <div className="support-form-grid">

            <div className="support-field">

              <label htmlFor="expectedBehavior">
                Expected behavior
              </label>

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

            <div className="support-field">

              <label htmlFor="actualBehavior">
                Actual behavior
              </label>

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

        <div className="support-submit-row">

          <button
            type="submit"
            className="support-submit-button"
            disabled={
              submitting ||
              loadingProjects ||
              projects.length === 0
            }
          >
            {submitting ? (
              <>
                <span className="support-button-spinner" />
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
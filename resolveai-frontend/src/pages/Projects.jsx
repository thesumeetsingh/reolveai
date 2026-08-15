import { useEffect, useState } from "react";

import {
  ArrowRight,
  FolderKanban,
  Plus,
  RefreshCw,
  X,
} from "lucide-react";

import { Link } from "react-router-dom";

import {
  createProject,
  getProjects,
} from "../services/projectService";

import "./Projects.css";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [formError, setFormError] = useState("");

  const [form, setForm] = useState({
    projectCode: "",
    projectName: "",
    description: "",
    repositoryUrl: "",
  });

  const loadProjects = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getProjects();

      setProjects(data);
    } catch (err) {
      console.error(
        "Failed to load projects:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Unable to load projects."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleCreateProject = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);
      setFormError("");

      const createdProject =
        await createProject(form);

      setProjects((current) => [
        ...current,
        {
          projectId:
            createdProject.projectId,
          projectCode:
            createdProject.projectCode,
          projectName:
            createdProject.projectName,
          status:
            createdProject.status,
        },
      ]);

      setForm({
        projectCode: "",
        projectName: "",
        description: "",
        repositoryUrl: "",
      });

      setCreating(false);
    } catch (err) {
      console.error(
        "Failed to create project:",
        err
      );

      setFormError(
        err.response?.data?.message ||
          "Unable to create project."
      );
    } finally {
      setSaving(false);
    }
  };

  const closeModal = () => {
    if (saving) {
      return;
    }

    setCreating(false);
    setFormError("");

    setForm({
      projectCode: "",
      projectName: "",
      description: "",
      repositoryUrl: "",
    });
  };

  return (
    <div className="projects-page">

      <section className="projects-header">

        <div>
          <p className="projects-eyebrow">
            Workspace
          </p>

          <h1>Projects</h1>

          <p className="projects-description">
            Manage your projects and their
            incident activity.
          </p>
        </div>

        <button
          className="create-project-button"
          onClick={() => setCreating(true)}
        >
          <Plus size={17} />
          New project
        </button>

      </section>

      {error && (
        <div className="projects-error">
          <span>{error}</span>

          <button
            onClick={loadProjects}
            title="Retry"
          >
            <RefreshCw size={15} />
          </button>
        </div>
      )}

      <section className="projects-content">

        {loading ? (
          <div className="projects-loading">

            <div className="loading-spinner" />

            <span>
              Loading projects...
            </span>

          </div>
        ) : projects.length === 0 ? (
          <div className="projects-empty">

            <div className="projects-empty-icon">
              <FolderKanban size={22} />
            </div>

            <h2>No projects yet</h2>

            <p>
              Create your first project to start
              managing incidents and support
              requests.
            </p>

            <button
              className="create-project-button"
              onClick={() => setCreating(true)}
            >
              <Plus size={17} />
              Create project
            </button>

          </div>
        ) : (
          <div className="projects-grid">

            {projects.map((project) => (
              <Link
                key={project.projectId}
                to={`/projects/${project.projectId}`}
                className="project-card"
              >

                <div className="project-card-top">

                  <div className="project-icon">
                    <FolderKanban size={19} />
                  </div>

                  <span
                    className={`project-status status-${String(
                      project.status
                    ).toLowerCase()}`}
                  >
                    {project.status}
                  </span>

                </div>

                <div className="project-card-body">

                  <span className="project-code">
                    {project.projectCode}
                  </span>

                  <h2>
                    {project.projectName}
                  </h2>

                </div>

                <div className="project-card-footer">

                  <span>
                    Open project
                  </span>

                  <ArrowRight size={15} />

                </div>

              </Link>
            ))}

          </div>
        )}

      </section>

      {creating && (
        <div
          className="modal-overlay"
          onMouseDown={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              closeModal();
            }
          }}
        >

          <div className="project-modal">

            <div className="modal-header">

              <div>
                <h2>Create project</h2>

                <p>
                  Add a new project to your workspace.
                </p>
              </div>

              <button
                className="modal-close"
                onClick={closeModal}
                disabled={saving}
              >
                <X size={18} />
              </button>

            </div>

            <form
              className="project-form"
              onSubmit={handleCreateProject}
            >

              <div className="form-field">
                <label htmlFor="projectCode">
                  Project code
                </label>

                <input
                  id="projectCode"
                  name="projectCode"
                  value={form.projectCode}
                  onChange={handleChange}
                  placeholder="e.g. RESOLVE"
                  maxLength={30}
                  required
                />
              </div>

              <div className="form-field">
                <label htmlFor="projectName">
                  Project name
                </label>

                <input
                  id="projectName"
                  name="projectName"
                  value={form.projectName}
                  onChange={handleChange}
                  placeholder="e.g. ResolveAI Platform"
                  maxLength={150}
                  required
                />
              </div>

              <div className="form-field">
                <label htmlFor="description">
                  Description
                </label>

                <textarea
                  id="description"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Briefly describe the project"
                  maxLength={1000}
                  rows={4}
                />
              </div>

              <div className="form-field">
                <label htmlFor="repositoryUrl">
                  Repository URL
                </label>

                <input
                  id="repositoryUrl"
                  name="repositoryUrl"
                  type="url"
                  value={form.repositoryUrl}
                  onChange={handleChange}
                  placeholder="https://github.com/..."
                  maxLength={500}
                />
              </div>

              {formError && (
                <div className="project-form-error">
                  {formError}
                </div>
              )}

              <div className="modal-actions">

                <button
                  type="button"
                  className="cancel-button"
                  onClick={closeModal}
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="create-project-button"
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <span className="button-spinner" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Plus size={16} />
                      Create project
                    </>
                  )}
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

    </div>
  );
}
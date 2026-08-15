import { useEffect, useState } from "react";

import {
  ArrowLeft,
  ExternalLink,
  FolderKanban,
  GitBranch,
  Server,
  Users,
  Wrench,
} from "lucide-react";

import { Link, useParams } from "react-router-dom";

import {
  getProject,
  getProjectServices,
  getProjectTechnologies,
} from "../services/projectService";

import "./ProjectDetails.css";

export default function ProjectDetails() {
  const { projectId } = useParams();

  const [project, setProject] = useState(null);
  const [technologies, setTechnologies] = useState([]);
  const [services, setServices] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProject = async () => {
      try {
        setLoading(true);
        setError("");

        const [
          projectData,
          technologyData,
          serviceData,
        ] = await Promise.all([
          getProject(projectId),
          getProjectTechnologies(projectId),
          getProjectServices(projectId),
        ]);

        setProject(projectData);
        setTechnologies(technologyData);
        setServices(serviceData);
      } catch (err) {
        console.error(
          "Failed to load project:",
          err
        );

        setError(
          err.response?.data?.message ||
            "Unable to load project."
        );
      } finally {
        setLoading(false);
      }
    };

    loadProject();
  }, [projectId]);

  if (loading) {
    return (
      <div className="project-details-loading">
        <div className="project-details-spinner" />

        <span>
          Loading project...
        </span>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="project-details-error">

        <FolderKanban size={22} />

        <h2>
          Unable to load project
        </h2>

        <p>
          {error ||
            "The requested project could not be found."}
        </p>

        <Link
          to="/projects"
          className="back-project-button"
        >
          <ArrowLeft size={15} />
          Back to projects
        </Link>

      </div>
    );
  }

  return (
    <div className="project-details-page">

      <Link
        to="/projects"
        className="project-back-link"
      >
        <ArrowLeft size={15} />
        Projects
      </Link>

      <section className="project-details-header">

        <div className="project-title-section">

          <div className="project-details-icon">
            <FolderKanban size={22} />
          </div>

          <div>

            <div className="project-title-meta">

              <span>
                {project.projectCode}
              </span>

              <span
                className={`project-detail-status status-${String(
                  project.status
                ).toLowerCase()}`}
              >
                {project.status}
              </span>

            </div>

            <h1>
              {project.projectName}
            </h1>

            <p>
              {project.description ||
                "No project description provided."}
            </p>

          </div>

        </div>

        {project.repositoryUrl && (
          <a
            href={project.repositoryUrl}
            target="_blank"
            rel="noreferrer"
            className="repository-button"
          >
            <GitBranch size={15} />
            Repository
            <ExternalLink size={13} />
          </a>
        )}

      </section>

      <section className="project-info-grid">

        <div className="project-info-card">

          <span className="project-info-label">
            Owner
          </span>

          <strong>
            {project.ownerUsername}
          </strong>

        </div>

        <div className="project-info-card">

          <span className="project-info-label">
            Members
          </span>

          <strong>
            {project.members?.length || 0}
          </strong>

        </div>

        <div className="project-info-card">

          <span className="project-info-label">
            Technologies
          </span>

          <strong>
            {technologies.length}
          </strong>

        </div>

        <div className="project-info-card">

          <span className="project-info-label">
            Services
          </span>

          <strong>
            {services.length}
          </strong>

        </div>

      </section>

      <section className="project-details-grid">

        <div className="project-panel">

          <div className="project-panel-header">

            <div>
              <h2>
                Team members
              </h2>

              <p>
                People working on this project
              </p>
            </div>

            <Users size={17} />

          </div>

          {project.members?.length ? (
            <div className="member-list">

              {project.members.map((member) => (
                <div
                  className="member-row"
                  key={member.userId}
                >

                  <div className="member-avatar">
                    {(
                      member.firstName?.[0] ||
                      member.username?.[0] ||
                      "U"
                    ).toUpperCase()}
                  </div>

                  <div className="member-info">

                    <strong>
                      {member.firstName ||
                        member.username}{" "}
                      {member.lastName || ""}
                    </strong>

                    <span>
                      @{member.username}
                    </span>

                  </div>

                  <div className="member-meta">

                    <span className="member-role">
                      {member.projectRole}
                    </span>

                    <span
                      className={`member-status member-status-${String(
                        member.status
                      ).toLowerCase()}`}
                    >
                      {member.status}
                    </span>

                  </div>

                </div>
              ))}

            </div>
          ) : (
            <div className="project-empty">
              No project members found.
            </div>
          )}

        </div>

        <div className="project-panel">

          <div className="project-panel-header">

            <div>
              <h2>
                Technologies
              </h2>

              <p>
                Technology stack used by the project
              </p>
            </div>

            <Wrench size={17} />

          </div>

          {technologies.length ? (
            <div className="technology-list">

              {technologies.map((technology) => (
                <div
                  className="technology-row"
                  key={technology.technologyId}
                >

                  <div>

                    <strong>
                      {technology.technologyName}
                    </strong>

                    <span>
                      {technology.category ||
                        "Technology"}
                    </span>

                  </div>

                  {technology.version && (
                    <span className="technology-version">
                      {technology.version}
                    </span>
                  )}

                </div>
              ))}

            </div>
          ) : (
            <div className="project-empty">
              No technologies added yet.
            </div>
          )}

        </div>

      </section>

      <section className="project-panel services-panel">

        <div className="project-panel-header">

          <div>
            <h2>
              Services
            </h2>

            <p>
              Services configured for this project
            </p>
          </div>

          <Server size={17} />

        </div>

        {services.length ? (
          <div className="services-grid">

            {services.map((service) => (
              <div
                className="service-card"
                key={service.serviceId}
              >

                <div className="service-card-header">

                  <div>
                    <h3>
                      {service.serviceName}
                    </h3>

                    <span>
                      {service.environment ||
                        "Environment not specified"}
                    </span>
                  </div>

                  <span
                    className={`service-status service-status-${String(
                      service.status
                    ).toLowerCase()}`}
                  >
                    {service.status}
                  </span>

                </div>

                <p>
                  {service.description ||
                    "No description provided."}
                </p>

                <div className="service-card-footer">

                  {service.version && (
                    <span>
                      v{service.version}
                    </span>
                  )}

                  {service.repositoryUrl && (
                    <a
                      href={service.repositoryUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Repository
                      <ExternalLink size={12} />
                    </a>
                  )}

                </div>

              </div>
            ))}

          </div>
        ) : (
          <div className="project-empty">
            No services added yet.
          </div>
        )}

      </section>

    </div>
  );
}
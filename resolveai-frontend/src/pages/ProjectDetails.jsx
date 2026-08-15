import { useEffect, useMemo, useState } from "react";

import {
  ArrowLeft,
  CheckCircle2,
  ExternalLink,
  FolderKanban,
  GitBranch,
  Plus,
  Search,
  Server,
  Trash2,
  Users,
  Wrench,
  X,
} from "lucide-react";

import { Link, useParams } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

import {
  addProjectMember,
  addProjectService,
  addProjectTechnology,
  getProject,
  getProjectServices,
  getProjectTechnologies,
  removeProjectMember,
  searchEmployees,
  updateProjectMemberRole,
} from "../services/projectService";

import "./ProjectDetails.css";

const MEMBER_ROLES = [
  "PROJECT_MANAGER",
  "DEVELOPER",
  "TESTER",
  "SUPPORT_AGENT",
];

const emptyTechnology = {
  technologyName: "",
  category: "",
  version: "",
};

const emptyService = {
  serviceName: "",
  description: "",
  repositoryUrl: "",
  environment: "",
  version: "",
};

export default function ProjectDetails() {
  const { projectId } = useParams();
  const { user } = useAuth();

  const [project, setProject] = useState(null);
  const [technologies, setTechnologies] = useState([]);
  const [services, setServices] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showMemberForm, setShowMemberForm] =
    useState(false);

  const [showTechnologyForm, setShowTechnologyForm] =
    useState(false);

  const [showServiceForm, setShowServiceForm] =
    useState(false);

  const [memberSearch, setMemberSearch] =
    useState("");

  const [employeeResults, setEmployeeResults] =
    useState([]);

  const [selectedEmployee, setSelectedEmployee] =
    useState(null);

  const [memberRole, setMemberRole] =
    useState("DEVELOPER");

  const [technologyForm, setTechnologyForm] =
    useState(emptyTechnology);

  const [serviceForm, setServiceForm] =
    useState(emptyService);

  const [saving, setSaving] = useState(false);
  const [actionError, setActionError] =
    useState("");

  const [actionSuccess, setActionSuccess] =
    useState("");

  const isAdmin =
    user?.authorities?.some(
      (authority) =>
        authority.authority === "ROLE_ADMIN"
    ) ?? false;

  const currentMember = useMemo(() => {
    return project?.members?.find(
      (member) =>
        member.username === user?.username
    );
  }, [project, user]);

  const canManage =
    isAdmin ||
    currentMember?.projectRole === "OWNER" ||
    currentMember?.projectRole === "PROJECT_MANAGER";

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

  useEffect(() => {
    loadProject();
  }, [projectId]);

  const handleSearchEmployees = async () => {
    const search = memberSearch.trim();

    if (!search) {
      setActionError("Enter a name, username or email to search.");
      setEmployeeResults([]);
      return;
    }

    try {
      setActionError("");
      setActionSuccess("");

      const results =
        await searchEmployees(search);

      const existingIds = new Set(
        (project?.members || []).map(
          (member) => member.userId
        )
      );

      setEmployeeResults(
        results.filter(
          (employee) =>
            !existingIds.has(employee.userId)
        )
      );
    } catch (err) {
      setActionError(
        err.response?.data?.message ||
          "Unable to search employees."
      );
    }
  };

  const handleAddMember = async () => {
    if (!selectedEmployee) {
      setActionError(
        "Please select an employee."
      );

      return;
    }

    try {
      setSaving(true);
      setActionError("");

      await addProjectMember(
        projectId,
        {
          userId: selectedEmployee.userId,
          projectRole: memberRole,
        }
      );

      setSelectedEmployee(null);
      setMemberSearch("");
      setEmployeeResults([]);
      setMemberRole("DEVELOPER");
      setShowMemberForm(false);
      setActionSuccess(
        `${selectedEmployee.firstName || selectedEmployee.username} was added to the project.`
      );

      await loadProject();
    } catch (err) {
      setActionError(
        err.response?.data?.message ||
          "Unable to add project member."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleRoleChange = async (
    member,
    role
  ) => {
    try {
      setSaving(true);
      setActionError("");

      await updateProjectMemberRole(
        projectId,
        member.userId,
        {
          projectRole: role,
        }
      );

      setActionSuccess(
        `${member.username} is now ${role.replaceAll("_", " ")}.`
      );

      await loadProject();
    } catch (err) {
      setActionError(
        err.response?.data?.message ||
          "Unable to update member role."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveMember = async (
    member
  ) => {
    if (
      !window.confirm(
        `Remove ${member.username} from this project?`
      )
    ) {
      return;
    }

    try {
      setSaving(true);
      setActionError("");

      await removeProjectMember(
        projectId,
        member.userId
      );

      setActionSuccess(
        `${member.username} was removed from the project.`
      );

      await loadProject();
    } catch (err) {
      setActionError(
        err.response?.data?.message ||
          "Unable to remove project member."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleTechnologySubmit = async (
    event
  ) => {
    event.preventDefault();

    try {
      setSaving(true);
      setActionError("");

      await addProjectTechnology(
        projectId,
        technologyForm
      );

      const addedTechnology = technologyForm.technologyName.trim();

      setTechnologyForm(emptyTechnology);
      setShowTechnologyForm(false);
      setActionSuccess(`${addedTechnology} was added to the technology stack.`);

      setTechnologies(
        await getProjectTechnologies(projectId)
      );
    } catch (err) {
      setActionError(
        err.response?.data?.message ||
          "Unable to add technology."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleServiceSubmit = async (
    event
  ) => {
    event.preventDefault();

    try {
      setSaving(true);
      setActionError("");

      await addProjectService(
        projectId,
        serviceForm
      );

      const addedService = serviceForm.serviceName.trim();

      setServiceForm(emptyService);
      setShowServiceForm(false);
      setActionSuccess(`${addedService} was added to the project services.`);

      setServices(
        await getProjectServices(projectId)
      );
    } catch (err) {
      setActionError(
        err.response?.data?.message ||
          "Unable to add service."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="project-details-loading">
        <div className="project-details-spinner" />
        <span>Loading project...</span>
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

      {actionError && (
        <div className="project-action-error" role="alert">
          {actionError}
        </div>
      )}

      {actionSuccess && (
        <div className="project-action-success" role="status">
          <CheckCircle2 size={15} />
          <span>{actionSuccess}</span>
          <button
            type="button"
            className="project-feedback-dismiss"
            onClick={() => setActionSuccess("")}
            aria-label="Dismiss success message"
          >
            <X size={13} />
          </button>
        </div>
      )}

      <section className="project-details-grid">

        <div className="project-panel">

          <div className="project-panel-header">

            <div>
              <h2>Team members</h2>

              <p>
                People working on this project
              </p>
            </div>

            <div className="project-panel-header-actions">

              <Users size={17} />

              {canManage && (
                <button
                  className="panel-small-button"
                  onClick={() =>
                    setShowMemberForm(
                      (current) => !current
                    )
                  }
                >
                  <Plus size={14} />
                  Add member
                </button>
              )}

            </div>

          </div>

          {showMemberForm && (
            <div className="project-management-box">

              <div className="project-management-title">
                Add project member
              </div>

              <div className="management-search-row">

                <input
                  value={memberSearch}
                  onChange={(event) => {
                    setMemberSearch(event.target.value);
                    if (actionError) setActionError("");
                  }}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      handleSearchEmployees();
                    }
                  }}
                  placeholder="Search by name, username or email"
                />

                <button
                  type="button"
                  className="panel-small-button"
                  onClick={
                    handleSearchEmployees
                  }
                  disabled={saving}
                >
                  <Search size={14} />
                  Search
                </button>

              </div>

              {employeeResults.length > 0 && (
                <div className="employee-results">

                  {employeeResults.map(
                    (employee) => (
                      <button
                        type="button"
                        key={employee.userId}
                        className={`employee-result ${
                          selectedEmployee?.userId ===
                          employee.userId
                            ? "employee-result-selected"
                            : ""
                        }`}
                        onClick={() =>
                          setSelectedEmployee(
                            employee
                          )
                        }
                      >
                        <strong>
                          {employee.firstName}{" "}
                          {employee.lastName}
                        </strong>

                        <span>
                          @{employee.username} ·{" "}
                          {employee.email}
                        </span>
                      </button>
                    )
                  )}

                </div>
              )}

              {selectedEmployee && (
                <div className="selected-employee">

                  <span>
                    Selected:
                  </span>

                  <strong>
                    {selectedEmployee.firstName}{" "}
                    {selectedEmployee.lastName}
                  </strong>

                  <select
                    value={memberRole}
                    onChange={(event) =>
                      setMemberRole(
                        event.target.value
                      )
                    }
                  >
                    {MEMBER_ROLES.map(
                      (role) => (
                        <option
                          key={role}
                          value={role}
                        >
                          {role.replaceAll(
                            "_",
                            " "
                          )}
                        </option>
                      )
                    )}
                  </select>

                  <button
                    type="button"
                    className="panel-small-button panel-primary-button"
                    onClick={handleAddMember}
                    disabled={saving}
                  >
                    {saving ? "Adding..." : "Add member"}
                  </button>

                  <button
                    type="button"
                    className="panel-small-button"
                    onClick={() => {
                      setSelectedEmployee(null);
                      setMemberSearch("");
                      setEmployeeResults([]);
                      setShowMemberForm(false);
                    }}
                    disabled={saving}
                  >
                    Cancel
                  </button>

                </div>
              )}

            </div>
          )}

          {project.members?.length ? (
            <div className="member-list">

              {project.members.map(
                (member) => (
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

                      {canManage &&
                      member.projectRole !==
                        "OWNER" ? (
                        <select
                          className="member-role-select"
                          value={
                            member.projectRole
                          }
                          onChange={(event) =>
                            handleRoleChange(
                              member,
                              event.target.value
                            )
                          }
                          disabled={saving}
                        >
                          {MEMBER_ROLES.map(
                            (role) => (
                              <option
                                key={role}
                                value={role}
                              >
                                {role.replaceAll(
                                  "_",
                                  " "
                                )}
                              </option>
                            )
                          )}
                        </select>
                      ) : (
                        <span className="member-role">
                          {member.projectRole}
                        </span>
                      )}

                      <span
                        className={`member-status member-status-${String(
                          member.status
                        ).toLowerCase()}`}
                      >
                        {member.status}
                      </span>

                      {canManage &&
                        member.projectRole !==
                          "OWNER" && (
                          <button
                            className="member-remove-button"
                            onClick={() =>
                              handleRemoveMember(
                                member
                              )
                            }
                            title="Remove member"
                            disabled={saving}
                          >
                            <Trash2 size={13} />
                          </button>
                        )}

                    </div>

                  </div>
                )
              )}

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
              <h2>Technologies</h2>

              <p>
                Technology stack used by the project
              </p>
            </div>

            <div className="project-panel-header-actions">

              <Wrench size={17} />

              {canManage && (
                <button
                  className="panel-small-button"
                  onClick={() =>
                    setShowTechnologyForm(
                      (current) => !current
                    )
                  }
                >
                  <Plus size={14} />
                  Add
                </button>
              )}

            </div>

          </div>

          {showTechnologyForm && (
            <form
              className="project-management-box"
              onSubmit={
                handleTechnologySubmit
              }
            >

              <input
                placeholder="Technology name *"
                value={
                  technologyForm.technologyName
                }
                onChange={(event) =>
                  setTechnologyForm(
                    (current) => ({
                      ...current,
                      technologyName:
                        event.target.value,
                    })
                  )
                }
                required
              />

              <div className="management-two-column">

                <input
                  placeholder="Category"
                  value={
                    technologyForm.category
                  }
                  onChange={(event) =>
                    setTechnologyForm(
                      (current) => ({
                        ...current,
                        category:
                          event.target.value,
                      })
                    )
                  }
                />

                <input
                  placeholder="Version"
                  value={
                    technologyForm.version
                  }
                  onChange={(event) =>
                    setTechnologyForm(
                      (current) => ({
                        ...current,
                        version:
                          event.target.value,
                      })
                    )
                  }
                />

              </div>

              <div className="management-form-actions">
                <button
                  className="panel-small-button panel-primary-button"
                  type="submit"
                  disabled={saving}
                >
                  <Plus size={14} />
                  {saving ? "Adding..." : "Add technology"}
                </button>

                <button
                  className="panel-small-button"
                  type="button"
                  onClick={() => {
                    setTechnologyForm(emptyTechnology);
                    setShowTechnologyForm(false);
                  }}
                  disabled={saving}
                >
                  Cancel
                </button>
              </div>

            </form>
          )}

          {technologies.length ? (
            <div className="technology-list">

              {technologies.map(
                (technology) => (
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
                )
              )}

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
            <h2>Services</h2>

            <p>
              Services configured for this project
            </p>
          </div>

          <div className="project-panel-header-actions">

            <Server size={17} />

            {canManage && (
              <button
                className="panel-small-button"
                onClick={() =>
                  setShowServiceForm(
                    (current) => !current
                  )
                }
              >
                <Plus size={14} />
                Add service
              </button>
            )}

          </div>

        </div>

        {showServiceForm && (
          <form
            className="project-management-box"
            onSubmit={handleServiceSubmit}
          >

            <input
              placeholder="Service name *"
              value={serviceForm.serviceName}
              onChange={(event) =>
                setServiceForm(
                  (current) => ({
                    ...current,
                    serviceName:
                      event.target.value,
                  })
                )
              }
              required
            />

            <textarea
              placeholder="Service description"
              value={serviceForm.description}
              onChange={(event) =>
                setServiceForm(
                  (current) => ({
                    ...current,
                    description:
                      event.target.value,
                  })
                )
              }
              rows={3}
            />

            <input
              type="url"
              placeholder="Repository URL"
              value={serviceForm.repositoryUrl}
              onChange={(event) =>
                setServiceForm(
                  (current) => ({
                    ...current,
                    repositoryUrl:
                      event.target.value,
                  })
                )
              }
            />

            <div className="management-two-column">

              <input
                placeholder="Environment"
                value={serviceForm.environment}
                onChange={(event) =>
                  setServiceForm(
                    (current) => ({
                      ...current,
                      environment:
                        event.target.value,
                    })
                  )
                }
              />

              <input
                placeholder="Version"
                value={serviceForm.version}
                onChange={(event) =>
                  setServiceForm(
                    (current) => ({
                      ...current,
                      version:
                        event.target.value,
                    })
                  )
                }
              />

            </div>

            <div className="management-form-actions">
              <button
                className="panel-small-button panel-primary-button"
                type="submit"
                disabled={saving}
              >
                <Plus size={14} />
                {saving ? "Adding..." : "Add service"}
              </button>

              <button
                className="panel-small-button"
                type="button"
                onClick={() => {
                  setServiceForm(emptyService);
                  setShowServiceForm(false);
                }}
                disabled={saving}
              >
                Cancel
              </button>
            </div>

          </form>
        )}

        {services.length ? (
          <div className="services-grid">

            {services.map(
              (service) => (
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
              )
            )}

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
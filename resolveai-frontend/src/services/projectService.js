import api from "./api";

export const getProjects = async () => {
  const response = await api.get("/projects");

  return response.data;
};

export const createProject = async (projectData) => {
  const response = await api.post(
    "/projects",
    projectData
  );

  return response.data;
};

export const getProject = async (projectId) => {
  const response = await api.get(
    `/projects/${projectId}`
  );

  return response.data;
};

export const getProjectTechnologies = async (
  projectId
) => {
  const response = await api.get(
    `/projects/${projectId}/technologies`
  );

  return response.data;
};

export const getProjectServices = async (
  projectId
) => {
  const response = await api.get(
    `/projects/${projectId}/services`
  );

  return response.data;
};

export const searchEmployees = async (search = "") => {
  const response = await api.get(
    "/users/employees",
    {
      params: {
        search,
      },
    }
  );

  return response.data;
};

export const addProjectMember = async (
  projectId,
  requestData
) => {
  const response = await api.post(
    `/projects/${projectId}/members`,
    requestData
  );

  return response.data;
};

export const updateProjectMemberRole = async (
  projectId,
  userId,
  requestData
) => {
  const response = await api.put(
    `/projects/${projectId}/members/${userId}`,
    requestData
  );

  return response.data;
};

export const removeProjectMember = async (
  projectId,
  userId
) => {
  await api.delete(
    `/projects/${projectId}/members/${userId}`
  );
};

export const addProjectTechnology = async (
  projectId,
  requestData
) => {
  const response = await api.post(
    `/projects/${projectId}/technologies`,
    requestData
  );

  return response.data;
};

export const addProjectService = async (
  projectId,
  requestData
) => {
  const response = await api.post(
    `/projects/${projectId}/services`,
    requestData
  );

  return response.data;
};
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
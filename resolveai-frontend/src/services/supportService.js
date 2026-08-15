import api from "./api";

export const createSupportRequest = async (requestData) => {
  const response = await api.post(
    "/support",
    requestData
  );

  return response.data;
};

export const updateIncidentStatus = async (
  supportRequestId,
  requestData
) => {
  const response = await api.put(
    `/support/${supportRequestId}/status`,
    requestData
  );

  return response.data;
};

export const assignIncident = async (
  supportRequestId,
  requestData
) => {
  const response = await api.put(
    `/support/${supportRequestId}/assign`,
    requestData
  );

  return response.data;
};

export const addIncidentComment = async (
  supportRequestId,
  requestData
) => {
  const response = await api.post(
    `/support/${supportRequestId}/comments`,
    requestData
  );

  return response.data;
};

export const getIncidentActivities = async (
  supportRequestId
) => {
  const response = await api.get(
    `/support/${supportRequestId}/activities`
  );

  return response.data;
};
import api from "./api";

export const createSupportRequest = async (requestData) => {
  const response = await api.post("/support", requestData);
  return response.data;
};

export const getMySupportRequests = async () => {
  const response = await api.get("/support/my");
  return response.data;
};

export const updateIncidentStatus = async (
  supportRequestId,
  requestData,
  isAdmin = false
) => {
  const endpoint = isAdmin
    ? `/admin/incidents/${supportRequestId}/status`
    : `/support/${supportRequestId}/status`;

  const response = await api.put(endpoint, requestData);
  return response.data;
};

export const assignIncident = async (
  supportRequestId,
  requestData,
  isAdmin = false
) => {
  const endpoint = isAdmin
    ? `/admin/incidents/${supportRequestId}/assign`
    : `/support/${supportRequestId}/assign`;

  const response = await api.put(endpoint, requestData);
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
  supportRequestId,
  isAdmin = false
) => {
  const endpoint = isAdmin
    ? `/admin/incidents/${supportRequestId}/activities`
    : `/support/${supportRequestId}/activities`;

  const response = await api.get(endpoint);
  return response.data;
};

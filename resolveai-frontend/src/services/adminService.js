import api from "./api";

export const getAdminDashboard = async () => {
  const response = await api.get(
    "/admin/dashboard"
  );

  return response.data;
};

export const getAdminUsers = async () => {
  const response = await api.get(
    "/admin/users"
  );

  return response.data;
};

export const getAdminSupportRequests =
  async () => {
    const response = await api.get(
      "/admin/support-requests"
    );

    return response.data;
  };

export const getAdminIncidentLogs = async (
  supportRequestId
) => {
  const response = await api.get(
    `/admin/incidents/${supportRequestId}/logs`
  );

  return response.data;
};

export const getAdminIncidentActivities =
  async (supportRequestId) => {
    const response = await api.get(
      `/admin/incidents/${supportRequestId}/activities`
    );

    return response.data;
  };

export const getAdminIncidentAttachments =
  async (supportRequestId) => {
    const response = await api.get(
      `/admin/incidents/${supportRequestId}/attachments`
    );

    return response.data;
  };

export const adminAssignIncident = async (
  supportRequestId,
  userId
) => {
  const response = await api.put(
    `/admin/incidents/${supportRequestId}/assign`,
    {
      userId,
    }
  );

  return response.data;
};

export const adminUpdateIncidentStatus =
  async (
    supportRequestId,
    status,
    message = "",
    resolutionSummary = ""
  ) => {
    const response = await api.put(
      `/admin/incidents/${supportRequestId}/status`,
      {
        status,
        message,
        resolutionSummary,
      }
    );

    return response.data;
  };
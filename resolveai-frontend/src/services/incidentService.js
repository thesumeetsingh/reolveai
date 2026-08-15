import api from "./api";

function getMimeType(file) {
  if (file?.type && file.type !== "application/octet-stream") {
    return file.type;
  }

  const extension = file?.name?.split(".").pop()?.toLowerCase();

  const types = {
    txt: "text/plain",
    log: "text/plain",
    json: "application/json",
    csv: "text/csv",
    xml: "application/xml",
    html: "text/html",
    htm: "text/html",
    md: "text/markdown",
  };

  return types[extension] || file?.type || "application/octet-stream";
}

export const getIncidentLogs = async (supportRequestId) => {
  const response = await api.get(`/incidents/support/${supportRequestId}`);
  return response.data;
};

export const createIncidentLog = async (requestData) => {
  const response = await api.post(
    "/incidents/logs",
    requestData,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

export const getIncidentAttachments = async (
  supportRequestId,
  isAdmin = false
) => {
  const endpoint = isAdmin
    ? `/admin/incidents/${supportRequestId}/attachments`
    : `/incidents/${supportRequestId}/attachments`;

  const response = await api.get(endpoint);
  return response.data;
};

export const uploadIncidentAttachment = async (
  supportRequestId,
  file
) => {
  const formData = new FormData();
  const mimeType = getMimeType(file);

  const uploadFile =
    mimeType !== file.type
      ? new File([file], file.name, { type: mimeType })
      : file;

  formData.append("file", uploadFile);

  const response = await api.post(
    `/incidents/${supportRequestId}/attachments`,
    formData
  );

  return response.data;
};

export const getIncidentContext = async (supportRequestId) => {
  const response = await api.get(`/ai/context/${supportRequestId}`);
  return response.data;
};

export const createAIConversation = async (
  supportRequestId,
  title
) => {
  const response = await api.post("/ai/conversations", {
    supportRequestId,
    title,
  });

  return response.data;
};

export const getAIConversationMessages = async (conversationId) => {
  const response = await api.get(
    `/ai/conversations/${conversationId}/messages`
  );

  return response.data;
};

export const askAI = async (conversationId, question) => {
  const response = await api.post(
    `/ai/conversations/${conversationId}/ask`,
    { question }
  );

  return response.data;
};

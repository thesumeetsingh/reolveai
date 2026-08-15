import api from "./api";

export const getEmployeeDashboard = async () => {
  const response = await api.get("/employee/dashboard");

  return response.data;
};
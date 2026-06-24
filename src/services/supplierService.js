import api from "./api";

export const getSuppliers = async (activeOnly = false) => {
  const response = await api.get(`/suppliers${activeOnly ? "?activeOnly=true" : ""}`);
  return response.data;
};

export const createSupplier = async (data) => {
  const response = await api.post("/suppliers", data);
  return response.data;
};

export const updateSupplier = async (id, data) => {
  const response = await api.put(`/suppliers/${id}`, data);
  return response.data;
};

export const setSupplierActive = async (id, active) => {
  const response = await api.patch(`/suppliers/${id}/status?active=${active}`);
  return response.data;
};

export const deleteSupplier = async (id) => api.delete(`/suppliers/${id}`);

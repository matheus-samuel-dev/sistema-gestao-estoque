import api from "./api";

export const getProducts = async () => {
    const response = await api.get("/products");

    return response.data.content;
};

export const createProduct = async (data) => {
    const response = await api.post("/products", data);
    return response.data;
};

export const updateProduct = async (id, data) => {
    const response = await api.put(
        `/products/${id}`,
        data
    );

    return response.data;
};

export const deleteProduct = async (id) => {
    await api.delete(`/products/${id}`);
};

export const searchProducts = async (name) => {
    const response = await api.get(
        `/products/search?name=${name}`
    );

    return response.data;
};

export const getLatestProducts = async () => {
    const response =
        await api.get("/products/latest");

    return response.data;
};

export const importProducts = async (items) => {
    const response = await api.post("/products/import", items);
    return response.data;
};

export const uploadProductAttachment = async (productId, file) => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await api.post(`/attachments/products/${productId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
};

export const getProductAttachments = async (productId) => {
    const response = await api.get(`/attachments/products/${productId}`);
    return response.data;
};

export const downloadAttachment = async (id, fileName) => {
    const response = await api.get(`/attachments/${id}/download`, { responseType: "blob" });
    const url = URL.createObjectURL(response.data);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
};

export const deleteAttachment = async (id) => api.delete(`/attachments/${id}`);

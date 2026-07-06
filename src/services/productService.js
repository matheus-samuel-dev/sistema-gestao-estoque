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
    const response = await api.post(`/products/${productId}/attachments`, formData);
    return response.data;
};

export const getProductAttachments = async (productId) => {
    const response = await api.get(`/products/${productId}/attachments`);
    return response.data;
};

export const downloadAttachment = async (id, fileName) => {
    let response;
    try {
        response = await api.get(`/attachments/${id}/download`, { responseType: "blob" });
    } catch (error) {
        const data = error.response?.data;
        if (data instanceof Blob && data.type?.includes("application/json")) {
            const text = await data.text();
            try {
                error.message = JSON.parse(text).message || error.message;
            } catch {
                error.message = text || error.message;
            }
        }
        throw error;
    }
    const url = URL.createObjectURL(response.data);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
};

export const viewAttachment = async (id) => {
    let response;
    const previewWindow = window.open("about:blank", "_blank");
    if (previewWindow) previewWindow.opener = null;
    try {
        response = await api.get(`/attachments/${id}/view`, { responseType: "blob" });
    } catch (error) {
        previewWindow?.close();
        const data = error.response?.data;
        if (data instanceof Blob && data.type?.includes("application/json")) {
            const text = await data.text();
            try {
                error.message = JSON.parse(text).message || error.message;
            } catch {
                error.message = text || error.message;
            }
        }
        throw error;
    }
    const url = URL.createObjectURL(response.data);
    if (previewWindow) {
        previewWindow.location.href = url;
    } else {
        window.open(url, "_blank", "noopener,noreferrer");
    }
    setTimeout(() => URL.revokeObjectURL(url), 60000);
};

export const deleteAttachment = async (id) => api.delete(`/attachments/${id}`);

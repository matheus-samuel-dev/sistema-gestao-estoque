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
// src/services/stockMovementService.js

import api from "./api";

export const getMovements = async () => {
    const response = await api.get("/stock-movements");
    return response.data.content;
};

export const createMovement = async (data) => {
    const response = await api.post("/stock-movements", data);
    return response.data;
};

export const deleteMovement = async (id) => {
    return await api.delete(
        `/stock-movements/${id}`
    );
};
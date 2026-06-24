import api from "./api";

export const getDashboardData = async () => {
  const response = await api.get("/dashboard");
  return {
    products: response.data.totalProducts,
    categories: response.data.totalCategories,
    lowStock: response.data.lowStockProducts,
    outOfStock: response.data.outOfStockProducts,
    movements: response.data.totalMovements,
    stockValue: response.data.totalStockValue,
    entriesThisMonth: response.data.entriesThisMonth,
    exitsThisMonth: response.data.exitsThisMonth,
  };
};

export const getProductsByCategory = async () => {
    const response = await api.get("/dashboard/categories");
    return response.data;
};

export const getMovements = async () => {
    const response =
        await api.get("/dashboard/movements");

    return response.data;
};

import api from "./api";
import { getCategories } from "./categoryService";

export const getDashboardData = async () => {
  const [
    productsResponse,
    lowStockResponse,
    outOfStockResponse,
    categories,
  ] = await Promise.all([
    api.get("/products?page=0&size=1"),
    api.get("/products/low-stock"),
    api.get("/products/out-of-stock"),
    getCategories(),
  ]);

  return {
    products: productsResponse.data.totalElements,
    categories: categories.length,
    lowStock: lowStockResponse.data.length,
    outOfStock: outOfStockResponse.data.length,
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
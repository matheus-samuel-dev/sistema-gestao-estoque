import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import Dashboard from "../pages/Dashboard/Dashboard";
import Products from "../pages/Products/Products";
import Categories from "../pages/Categories/Categories";
import Movements from "../pages/Movements/Movements";

vi.mock("recharts", () => {
  const Component = ({ children }) => <div>{children}</div>;
  return {
    ResponsiveContainer: Component,
    BarChart: Component,
    Bar: Component,
    XAxis: Component,
    YAxis: Component,
    CartesianGrid: Component,
    Tooltip: Component,
    Legend: Component,
    PieChart: Component,
    Pie: Component,
    Cell: Component,
    LineChart: Component,
    Line: Component,
  };
});

vi.mock("../services/dashboardService", () => ({
  getDashboardData: vi.fn().mockResolvedValue({
    products: 0,
    categories: 0,
    lowStock: 0,
    outOfStock: 0,
    movements: 0,
    stockValue: 0,
    entriesThisMonth: 0,
    exitsThisMonth: 0,
  }),
  getProductsByCategory: vi.fn().mockResolvedValue([]),
}));

vi.mock("../services/productService", () => ({
  getProducts: vi.fn().mockResolvedValue([]),
  getLatestProducts: vi.fn().mockResolvedValue([]),
  createProduct: vi.fn(),
  updateProduct: vi.fn(),
  deleteProduct: vi.fn(),
  importProducts: vi.fn(),
}));

vi.mock("../services/categoryService", () => ({
  getCategories: vi.fn().mockResolvedValue([]),
  createCategory: vi.fn(),
  updateCategory: vi.fn(),
  deleteCategory: vi.fn(),
  setCategoryActive: vi.fn(),
}));

vi.mock("../services/supplierService", () => ({
  getSuppliers: vi.fn().mockResolvedValue([]),
}));

vi.mock("../services/stockMovementService", () => ({
  getMovements: vi.fn().mockResolvedValue([]),
  createMovement: vi.fn(),
  deleteMovement: vi.fn(),
}));

const renderPage = (ui) => render(<MemoryRouter>{ui}</MemoryRouter>);

describe("Main page rendering", () => {
  beforeEach(() => {
    localStorage.setItem("token", "test-token");
  });

  it("renders dashboard page", async () => {
    renderPage(<Dashboard />);
    expect(await screen.findByText("Dashboard")).toBeInTheDocument();
  });

  it("renders products page", async () => {
    renderPage(<Products />);
    expect(await screen.findByText("Produtos")).toBeInTheDocument();
  });

  it("renders categories page", async () => {
    renderPage(<Categories />);
    expect(await screen.findByText("Categorias")).toBeInTheDocument();
  });

  it("renders movements page", async () => {
    renderPage(<Movements />);
    expect(await screen.findByText("Movimentações")).toBeInTheDocument();
  });
});

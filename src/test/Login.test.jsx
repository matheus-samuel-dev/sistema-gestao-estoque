import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import Login from "../pages/Login/Login";
import { login } from "../services/authService";

const navigate = vi.fn();

vi.mock("../services/authService", () => ({
  login: vi.fn(),
}));

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => navigate,
  };
});

describe("Login", () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    navigate.mockClear();
    login.mockReset();
  });

  it("keeps submit disabled while email or password are invalid", async () => {
    render(<Login />, { wrapper: MemoryRouter });

    expect(screen.getByRole("button", { name: /Entrar no Sistema/i })).toBeDisabled();

    await userEvent.type(screen.getByPlaceholderText("seu@email.com"), "usuario");
    await userEvent.tab();

    expect(screen.getByText(/Informe um e-mail/i)).toBeInTheDocument();
    expect(login).not.toHaveBeenCalled();
  });

  it("stores persistent token and redirects after successful login", async () => {
    login.mockResolvedValue({ token: "jwt-token" });
    render(<Login />, { wrapper: MemoryRouter });

    await userEvent.type(screen.getByPlaceholderText("seu@email.com"), "user@email.com");
    await userEvent.type(document.querySelector("input[type='password']"), "Strong@123");
    await userEvent.click(screen.getByRole("button", { name: /Entrar no Sistema/i }));

    await waitFor(() => expect(login).toHaveBeenCalledWith("user@email.com", "Strong@123"));
    expect(localStorage.getItem("token")).toBe("jwt-token");
    expect(sessionStorage.getItem("token")).toBeNull();
    expect(navigate).toHaveBeenCalledWith("/dashboard");
  });

  it("stores temporary token when remember access is unchecked", async () => {
    login.mockResolvedValue({ token: "session-token" });
    render(<Login />, { wrapper: MemoryRouter });

    await userEvent.click(screen.getByLabelText(/Lembrar meu acesso/i));
    await userEvent.type(screen.getByPlaceholderText("seu@email.com"), "user@email.com");
    await userEvent.type(document.querySelector("input[type='password']"), "Strong@123");
    await userEvent.click(screen.getByRole("button", { name: /Entrar no Sistema/i }));

    await waitFor(() => expect(sessionStorage.getItem("token")).toBe("session-token"));
    expect(localStorage.getItem("token")).toBeNull();
  });
});

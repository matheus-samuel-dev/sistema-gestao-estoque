import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import api, { clearAuthAndRedirectToLogin } from "../services/api";

describe("api service", () => {
  const originalAdapter = api.defaults.adapter;

  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  afterEach(() => {
    api.defaults.adapter = originalAdapter;
  });

  it("sends Authorization Bearer token from persistent storage", async () => {
    localStorage.setItem("token", "jwt-token");
    api.defaults.adapter = vi.fn((config) => Promise.resolve({
      data: {},
      status: 200,
      statusText: "OK",
      headers: {},
      config,
    }));

    await api.get("/products");

    expect(api.defaults.adapter).toHaveBeenCalled();
    expect(api.defaults.adapter.mock.calls[0][0].headers.Authorization).toBe("Bearer jwt-token");
  });

  it("clears tokens and redirects to login after unauthorized response", () => {
    localStorage.setItem("token", "jwt-token");
    sessionStorage.setItem("token", "session-token");
    const redirect = vi.fn();

    clearAuthAndRedirectToLogin(redirect);

    expect(localStorage.getItem("token")).toBeNull();
    expect(sessionStorage.getItem("token")).toBeNull();
    expect(redirect).toHaveBeenCalledWith("/login");
  });
});

import api from "./api";

export const login = async (email, password) => {

    const response = await api.post(
        "/auth/login",
        {
            email,
            password
        }
    );

    return response.data;
};

export const register = async (data) => {
  const response = await api.post(
    "/auth/register",
    {
      name: data.name,
      email: data.email,
      password: data.password,
      role: "USER"
    }
  );

  return response.data;
};

export const requestPasswordReset = async (email) => {
  const response = await api.post(
    "/auth/forgot-password",
    { email },
    { timeout: 3000 }
  );

  return response.data;
};

export const resetPassword = async (
  token,
  newPassword
) => {
  const response = await api.post(
    "/auth/reset-password",
    {
      token,
      newPassword
    }
  );

  return response.data;
};

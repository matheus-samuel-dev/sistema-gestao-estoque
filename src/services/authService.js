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

export const googleLogin = async (
  googleToken
) => {

  const response =
    await api.post(
      "/auth/google",
      {
        token: googleToken
      }
    );

  return response.data;
};

export const requestPasswordReset = async (email) => {
  const response = await api.post(
    "/auth/forgot-password",
    { email }
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

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
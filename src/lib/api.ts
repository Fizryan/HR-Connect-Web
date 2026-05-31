import axios, { type AxiosInstance } from "axios";

export const apiClient: AxiosInstance = axios.create({
  baseURL: "/backend-api",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

export const getAuthHeaders = (token?: string) => {
  return token ? { Authorization: `Bearer ${token}` } : {};
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (typeof window !== "undefined") {
        try {
          const { getSession, signOut } = await import("next-auth/react");
          const session = await getSession();

          if (session?.accessToken) {
            originalRequest.headers.Authorization = `Bearer ${session.accessToken}`;
            return apiClient(originalRequest);
          } else {
            signOut({ callbackUrl: "/login" });
          }
        } catch (err) {
          import("next-auth/react").then(({ signOut }) => {
            signOut({ callbackUrl: "/login" });
          });
        }
      }
    }
    return Promise.reject(error);
  },
);

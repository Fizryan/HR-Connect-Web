import axios, { AxiosInstance } from "axios";

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
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        import("next-auth/react").then(({ signOut }) => {
          signOut({ callbackUrl: "/login" });
        });
      }
    }
    return Promise.reject(error);
  }
);

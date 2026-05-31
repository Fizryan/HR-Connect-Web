import { apiClient, getAuthHeaders } from "@/lib/api";
import type { CreateUserFormValues, User, UserFormValues } from "../types";

export const UserApi = {
  getUsers: async (token: string): Promise<User[]> => {
    const response = await apiClient.get<{ user: User[] }>("/users", {
      headers: getAuthHeaders(token),
    });
    return response.data.user || [];
  },

  getUser: async (id: string, token: string): Promise<User> => {
    const response = await apiClient.get<{ user: User }>(`/users/${id}`, {
      headers: getAuthHeaders(token),
    });
    return response.data.user;
  },

  createUser: async (
    data: CreateUserFormValues,
    token: string,
  ): Promise<unknown> => {
    const payload = {
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        role: data.role,
        avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(data.firstName)}+${encodeURIComponent(data.lastName)}&background=random`,
      },
      password: data.password,
    };
    const response = await apiClient.post<unknown>("/users/register", payload, {
      headers: getAuthHeaders(token),
    });
    return response.data;
  },

  updateUser: async (
    id: string,
    data: UserFormValues,
    token: string,
  ): Promise<void> => {
    const payload = {
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        role: data.role,
        avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(data.firstName)}+${encodeURIComponent(data.lastName)}&background=random`,
      },
    };
    await apiClient.put(`/users/${id}`, payload, {
      headers: getAuthHeaders(token),
    });
  },

  deleteUser: async (id: string, token: string): Promise<void> => {
    await apiClient.delete(`/users/${id}`, { headers: getAuthHeaders(token) });
  },

  activateUser: async (id: string, token: string): Promise<void> => {
    await apiClient.post(
      `/users/${id}/activate`,
      {},
      { headers: getAuthHeaders(token) },
    );
  },

  deactivateUser: async (id: string, token: string): Promise<void> => {
    await apiClient.post(
      `/users/${id}/deactivate`,
      {},
      { headers: getAuthHeaders(token) },
    );
  },

  changePassword: async (
    data: { oldPassword: string; newPassword: string },
    token: string,
  ): Promise<void> => {
    await apiClient.post("/auth/change", data, {
      headers: getAuthHeaders(token),
    });
  },
};

import { apiClient, getAuthHeaders } from "@/lib/api";
import type { TripRequest } from "../types";

export const TripApi = {
  getMyTrips: async (token: string): Promise<TripRequest[]> => {
    const response = await apiClient.get("/me/trip", {
      headers: getAuthHeaders(token),
    });
    return response.data.requests || [];
  },

  createTrip: async (
    data: {
      description: string;
      startDate: string;
      endDate: string;
      type: string;
    },
    token: string,
  ): Promise<void> => {
    await apiClient.post(
      "/trip/new",
      { request: data },
      { headers: getAuthHeaders(token) },
    );
  },

  getAllTrips: async (
    token: string,
    status?: string,
  ): Promise<TripRequest[]> => {
    const params = status ? { status } : {};
    const response = await apiClient.get("/trip", {
      headers: getAuthHeaders(token),
      params,
    });
    return response.data.requests || [];
  },

  getPendingTrips: async (token: string): Promise<TripRequest[]> => {
    const response = await apiClient.get("/trip", {
      headers: getAuthHeaders(token),
    });
    const requests = response.data.requests || [];
    return requests.filter((r: any) => r.status.toLowerCase() === "pending");
  },

  approveTrip: async (id: string, token: string): Promise<void> => {
    await apiClient.post(
      `/trip/${id}/approve`,
      {},
      { headers: getAuthHeaders(token) },
    );
  },

  rejectTrip: async (
    id: string,
    reason: string,
    token: string,
  ): Promise<void> => {
    await apiClient.post(
      `/trip/${id}/reject`,
      { reason },
      { headers: getAuthHeaders(token) },
    );
  },
};

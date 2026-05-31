import { apiClient, getAuthHeaders } from "@/lib/api";
import { LeaveRequest } from "../types";

export const LeaveApi = {
  getMyLeaves: async (token: string): Promise<LeaveRequest[]> => {
    const response = await apiClient.get('/me/leave', { headers: getAuthHeaders(token) });
    return response.data.requests || [];
  },

  createLeave: async (
    data: { description: string; startDate: string; endDate: string; type: string },
    token: string
  ): Promise<void> => {
    await apiClient.post('/leave/new', { request: data }, { headers: getAuthHeaders(token) });
  },

  getAllLeaves: async (token: string, status?: string): Promise<LeaveRequest[]> => {
    const params = status ? { status } : {};
    const response = await apiClient.get('/leave', { headers: getAuthHeaders(token), params });
    return response.data.requests || [];
  },

  getPendingLeaves: async (token: string): Promise<LeaveRequest[]> => {
    const response = await apiClient.get('/pending/leave', { headers: getAuthHeaders(token) });
    return response.data.requests || [];
  },

  approveLeave: async (id: string, token: string): Promise<void> => {
    await apiClient.post(`/leave/${id}/approve`, {}, { headers: getAuthHeaders(token) });
  },

  rejectLeave: async (id: string, reason: string, token: string): Promise<void> => {
    await apiClient.post(`/leave/${id}/reject`, { reason }, { headers: getAuthHeaders(token) });
  },
};

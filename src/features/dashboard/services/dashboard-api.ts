import { apiClient, getAuthHeaders } from "@/lib/api";

export interface DashboardMetrics {
  attendanceRate: number;
  pendingLeave: number;
  pendingTrip: number;
  totalUser: number;
}

export const DashboardApi = {
  getMetrics: async (token: string): Promise<DashboardMetrics> => {
    const response = await apiClient.get('/dashboard', { headers: getAuthHeaders(token) });
    return response.data;
  },
};

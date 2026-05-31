import { apiClient, getAuthHeaders } from "@/lib/api";
import { UserAttendance, AttendanceRecord } from "../types";

export const AttendanceApi = {
  getAllAttendance: async (token: string): Promise<UserAttendance[]> => {
    const response = await apiClient.get('/attendance', { headers: getAuthHeaders(token) });
    return response.data.userAttendance || [];
  },

  getMyAttendance: async (token: string): Promise<AttendanceRecord[]> => {
    const response = await apiClient.get('/attendance/me', { headers: getAuthHeaders(token) });
    return response.data.attendance || [];
  },

  checkIn: async (payload: string, token: string): Promise<void> => {
    await apiClient.post('/attendance/checkin', { payload }, { headers: getAuthHeaders(token) });
  },

  checkOut: async (payload: string, token: string): Promise<void> => {
    await apiClient.post('/attendance/checkout', { payload }, { headers: getAuthHeaders(token) });
  },

  generateTodayQR: async (token: string): Promise<{ png: string; url: string }> => {
    const response = await apiClient.post('/attendance/today', {}, { headers: getAuthHeaders(token) });
    return response.data;
  },

  generateQR: async (token: string): Promise<{ png: string; url: string }> => {
    const response = await apiClient.post('/attendance/generate', {}, { headers: getAuthHeaders(token) });
    return response.data;
  },
};

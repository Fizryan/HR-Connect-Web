import { api } from '@/lib/api-client';
import { LoginFormValues, AuthResponse } from '../types';

export const AuthApi = {
    login: async (payload: LoginFormValues): Promise<AuthResponse> => {
        const response = await api.post<AuthResponse>('/auth/login', payload);

        if (typeof window !== 'undefined') {
            localStorage.setItem('access_token', response.accessToken);
            localStorage.setItem('refresh_token', response.refreshToken);
        }

        return response;
    },

    logout: () => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            window.location.href = '/login';
        }
    }
};
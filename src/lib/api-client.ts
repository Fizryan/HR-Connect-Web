import axios, { AxiosInstance, AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';

interface FailedRequest {
    resolve: (token: string) => void;
    reject: (error: any) => void;
}

class ApiClient {
    private instance: AxiosInstance;
    private isRefreshing = false;
    private failedQueue: FailedRequest[] = [];

    constructor() {
        this.instance = axios.create({
            baseURL: process.env.NEXT_PUBLIC_API_URL || 'http//localhost:9001/api/v1',
            timeout: 15000,
            headers: {
                'Content-Type': 'application/json',
            },
        });
        this.setupInterceptors();
    }

    private setupInterceptors() {
        this.instance.interceptors.request.use(
            (config: InternalAxiosRequestConfig) => {
                const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
                if (token && config.headers) {
                    config.headers.Authorization = `Bearer ${token}`;
                }

                const method = config.method?.toUpperCase();
                if (method && ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
                    if (!config.headers['X-Idempotency-Key']) {
                        config.headers['X-Idempotency-Key'] = crypto.randomUUID();
                    }
                }
                return config;
            },
            (error) => Promise.reject(error)
        );

        this.instance.interceptors.response.use(
            (response) => response.data,
            async (error) => {
                const originalRequest = error.config;
                if (error.response?.status !== 401 || originalRequest._retry) {
                    return Promise.reject(this.handleError(error));
                }

                if (originalRequest.url?.includes('/auth/refresh')) {
                    this.purgeSession();
                    return Promise.reject(this.handleError(error));
                }
                if (this.isRefreshing) {
                    return new Promise((resolve, reject) => {
                        this.failedQueue.push({
                            resolve: (token: string) => {
                                if (originalRequest.headers) {
                                    originalRequest.headers.Authorization = `Bearer ${token}`;
                                }
                                resolve(this.instance(originalRequest));
                            },
                            reject: (err: any) => reject(err),
                        });
                    });
                }

                originalRequest._retry = true;
                this.isRefreshing = true;

                return new Promise((resolve, reject) => {
                    this.executeTokenRefresh().then(
                        (newToken) => {
                            if (originalRequest.headers) {
                                originalRequest.headers.Authorization = `Bearer ${newToken}`;
                            }
                            this.processQueue(null, newToken);
                            resolve(this.instance(originalRequest));
                        }
                    ).catch(
                        (err) => {
                            this.processQueue(err, null);
                            this.purgeSession();
                            reject(this.handleError(err));
                        }
                    ).finally(
                        () => {
                            this.isRefreshing = false;
                        }
                    )
                })
            }
        );
    }

    private async executeTokenRefresh(): Promise<string> {
        const refreshToken = typeof window !== 'undefined' ? localStorage.getItem('refresh_token') : null;
        if (!refreshToken) throw new Error('Refresh token not found');

        const response = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
            { refresh_token: refreshToken },
        );

        const { access_token, refresh_token: newRefreshToken } = response.data.data;

        if (typeof window !== 'undefined') {
            localStorage.setItem('access_token', access_token);
            localStorage.setItem('refresh_token', newRefreshToken);
        }
        return access_token;
    }

    private processQueue(error: any, token: string | null = null) {
        this.failedQueue.forEach((prom) => {
            if (error) {
                prom.reject(error);
            } else if (token) {
                prom.resolve(token);
            }
        });
        this.failedQueue = [];
    }

    private purgeSession() {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            window.location.href = '/login';
        }
    }

    private handleError(error: any) {
        return {
            message: error.response?.data?.message || 'Something went wrong',
            status: error.response?.status || 500,
            data: error.response?.data?.errors || null,
        };
    }

    public get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
        return this.instance.get(url, config);
    }

    public post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
        return this.instance.post(url, data, config);
    }

    public put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
        return this.instance.put(url, data, config);
    }

    public patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
        return this.instance.patch(url, data, config);
    }

    public delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
        return this.instance.delete(url, config);
    }
}

export const api = new ApiClient();
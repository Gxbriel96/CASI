import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from "axios"

const API_BASE_URL = "http://localhost:3000/api"

class ApiClient {
  private client: AxiosInstance

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
      },
    })

    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem("token")
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      (error) => Promise.reject(error)
    )

    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        if (error.response?.status === 401) {
          const refreshToken = localStorage.getItem("refreshToken")
          if (refreshToken) {
            try {
              const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
                refreshToken,
              })
              const newToken = response.data.data.token
              localStorage.setItem("token", newToken)
              
              if (error.config && error.config.headers) {
                error.config.headers.Authorization = `Bearer ${newToken}`
                return this.client(error.config)
              }
            } catch {
              localStorage.removeItem("token")
              localStorage.removeItem("refreshToken")
              window.location.href = "/login"
            }
          }
        }
        return Promise.reject(error)
      }
    )
  }

  async get<T>(url: string, params?: Record<string, unknown>): Promise<T> {
    const response = await this.client.get<T>(url, { params })
    return response.data
  }

  async post<T>(url: string, data?: unknown): Promise<T> {
    const response = await this.client.post<T>(url, data)
    return response.data
  }

  async put<T>(url: string, data?: unknown): Promise<T> {
    const response = await this.client.put<T>(url, data)
    return response.data
  }

  async delete<T>(url: string): Promise<T> {
    const response = await this.client.delete<T>(url)
    return response.data
  }
}

export const apiClient = new ApiClient()

export interface ApiError {
  message: string
  statusCode?: number
}

export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || error.message || "Error de conexión"
  }
  if (error instanceof Error) {
    return error.message
  }
  return "Error desconocido"
}

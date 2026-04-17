const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api"

class ApiClient {
  private token: string | null = null

  setToken(token: string | null) {
    this.token = token
    if (token) {
      localStorage.setItem("token", token)
    } else {
      localStorage.removeItem("token")
    }
  }

  getToken(): string | null {
    if (!this.token) {
      this.token = localStorage.getItem("token")
    }
    return this.token
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = this.getToken()
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: "Error" }))
      throw new Error(error.message || `HTTP ${response.status}`)
    }

    return response.json()
  }

  get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "GET" })
  }

  post<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  put<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "DELETE" })
  }
}

export const apiClient = new ApiClient()

export const authService = {
  login: (email: string, password: string) =>
    apiClient.post<{ data: { token: string; refreshToken: string; user: unknown } }>(
      "/auth/login",
      { email, password }
    ),
  logout: () => {
    apiClient.setToken(null)
  },
  me: () => apiClient.get<{ data: unknown }>("/auth/me"),
  refresh: (refreshToken: string) =>
    apiClient.post<{ data: { token: string } }>("/auth/refresh", {
      refreshToken,
    }),
}

export const dashboardService = {
  getMetrics: () =>
    apiClient.get<{ data: import("@/types").DashboardMetrics }>("/dashboard/metricas"),
  getSiloStats: () =>
    apiClient.get<{ data: import("@/types").SiloStats }>("/dashboard/silos"),
  getEntradasPorCultivo: () =>
    apiClient.get<{ data: Array<{ cultivo: string; cantidad: number; peso: number }> }>(
      "/dashboard/entradas-cultivo"
    ),
  getTopSocios: (limit = 10) =>
    apiClient.get<{ data: Array<{ socio: import("@/types").Socio; totalKilos: number; importeTotal: number }> }>(
      `/dashboard/top-socios?limit=${limit}`
    ),
}

export const socioService = {
  getAll: (params?: { page?: number; limit?: number; search?: string }) => {
    const searchParams = new URLSearchParams()
    if (params?.page) searchParams.set("page", String(params.page))
    if (params?.limit) searchParams.set("limit", String(params.limit))
    if (params?.search) searchParams.set("search", params.search)
    return apiClient.get<{ data: unknown[]; pagination: unknown }>(`/socios?${searchParams}`)
  },
  getById: (id: string) => apiClient.get<{ data: import("@/types").Socio }>(`/socios/${id}`),
  create: (data: Partial<import("@/types").Socio>) =>
    apiClient.post<{ data: import("@/types").Socio }>("/socios", data),
  update: (id: string, data: Partial<import("@/types").Socio>) =>
    apiClient.put<{ data: import("@/types").Socio }>(`/socios/${id}`, data),
  delete: (id: string) => apiClient.delete<{ data: null }>(`/socios/${id}`),
}

export const parcelaService = {
  getAll: (params?: { socioId?: string }) => {
    const searchParams = new URLSearchParams()
    if (params?.socioId) searchParams.set("socioId", params.socioId)
    return apiClient.get<{ data: import("@/types").Parcela[] }>(`/parcelas?${searchParams}`)
  },
  getById: (id: string) => apiClient.get<{ data: import("@/types").Parcela }>(`/parcelas/${id}`),
  create: (data: { socioId: string; nombre: string; hectareas: number; ubicacion?: string; coordenadas?: string }) =>
    apiClient.post<{ data: import("@/types").Parcela }>("/parcelas", data),
  update: (id: string, data: Partial<import("@/types").Parcela>) =>
    apiClient.put<{ data: import("@/types").Parcela }>(`/parcelas/${id}`, data),
  delete: (id: string) => apiClient.delete<{ data: null }>(`/parcelas/${id}`),
}

export const cosechaService = {
  getAll: (params?: { page?: number; limit?: number; parcelaId?: string }) => {
    const searchParams = new URLSearchParams()
    if (params?.page) searchParams.set("page", String(params.page))
    if (params?.limit) searchParams.set("limit", String(params.limit))
    if (params?.parcelaId) searchParams.set("parcelaId", params.parcelaId)
    return apiClient.get<{ data: import("@/types").Cosecha[]; pagination: { total: number; pages: number } }>(`/cosechas?${searchParams}`)
  },
  getById: (id: string) => apiClient.get<{ data: import("@/types").Cosecha }>(`/cosechas/${id}`),
  create: (data: { parcelaId: string; cultivo: "MAIZ" | "TRIGO" | "CEBADA"; rendimiento?: number; fechaSiembra?: string; fechaCosecha?: string }) =>
    apiClient.post<{ data: import("@/types").Cosecha }>("/cosechas", data),
  update: (id: string, data: Partial<import("@/types").Cosecha>) =>
    apiClient.put<{ data: import("@/types").Cosecha }>(`/cosechas/${id}`, data),
  delete: (id: string) => apiClient.delete<{ data: null }>(`/cosechas/${id}`),
}

export const entradaService = {
  getAll: (params?: { page?: number; limit?: number; socioId?: string; siloId?: string }) => {
    const searchParams = new URLSearchParams()
    if (params?.page) searchParams.set("page", String(params.page))
    if (params?.limit) searchParams.set("limit", String(params.limit))
    if (params?.socioId) searchParams.set("socioId", params.socioId)
    if (params?.siloId) searchParams.set("siloId", params.siloId)
    return apiClient.get<{ data: import("@/types").EntradaAlmacen[]; pagination: { total: number; pages: number } }>(`/entradas?${searchParams}`)
  },
  getById: (id: string) => apiClient.get<{ data: import("@/types").EntradaAlmacen }>(`/entradas/${id}`),
  create: (data: { socioId: string; siloId?: string; peso: number; humedad: number; pesoEspecifico: number; temperatura: number; impurezas: number }) =>
    apiClient.post<{ data: import("@/types").EntradaAlmacen }>("/entradas", data),
  update: (id: string, data: Partial<import("@/types").EntradaAlmacen>) =>
    apiClient.put<{ data: import("@/types").EntradaAlmacen }>(`/entradas/${id}`, data),
  delete: (id: string) => apiClient.delete<{ data: null }>(`/entradas/${id}`),
}

export const liquidacionService = {
  getAll: (params?: { page?: number; limit?: number; socioId?: string }) => {
    const searchParams = new URLSearchParams()
    if (params?.page) searchParams.set("page", String(params.page))
    if (params?.limit) searchParams.set("limit", String(params.limit))
    if (params?.socioId) searchParams.set("socioId", params.socioId)
    return apiClient.get<{ data: import("@/types").Liquidacion[]; pagination: { total: number; pages: number } }>(`/liquidaciones?${searchParams}`)
  },
  getById: (id: string) => apiClient.get<{ data: import("@/types").Liquidacion }>(`/liquidaciones/${id}`),
  calcular: (socioId: string, cosechaId?: string) =>
    apiClient.post<{ data: import("@/types").Liquidacion }>("/liquidaciones/calcular", {
      socioId,
      cosechaId,
    }),
  create: (data: Partial<import("@/types").Liquidacion>) =>
    apiClient.post<{ data: import("@/types").Liquidacion }>("/liquidaciones", data),
  delete: (id: string) => apiClient.delete<{ data: null }>(`/liquidaciones/${id}`),
}

export const siloService = {
  getAll: () => apiClient.get<{ data: import("@/types").Silo[] }>("/silos"),
  getById: (id: string) => apiClient.get<{ data: import("@/types").Silo }>(`/silos/${id}`),
  create: (data: { nombre: string; capacidad: number; cultivo?: "MAIZ" | "TRIGO" | "CEBADA" }) =>
    apiClient.post<{ data: import("@/types").Silo }>("/silos", data),
  update: (id: string, data: Partial<import("@/types").Silo>) =>
    apiClient.put<{ data: import("@/types").Silo }>(`/silos/${id}`, data),
  delete: (id: string) => apiClient.delete<{ data: null }>(`/silos/${id}`),
}

export const frutaService = {
  getAll: (params?: { page?: number; limit?: number; search?: string; especie?: string }) => {
    const searchParams = new URLSearchParams()
    if (params?.page) searchParams.set("page", String(params.page))
    if (params?.limit) searchParams.set("limit", String(params.limit))
    if (params?.search) searchParams.set("search", params.search)
    if (params?.especie) searchParams.set("especie", params.especie)
    return apiClient.get<{ data: import("@/types").FrutaControl[]; pagination: { total: number; pages: number } }>(`/frutas?${searchParams}`)
  },
  create: (data: { socioId: string; especie: "MELOCOTON" | "NECTARINA" | "ALBARICOQUE" | "CIRUELA"; variedad?: string; calibre: "AA" | "A" | "B" | "C"; azucar: number; dureza: number; defectos: number; observaciones?: string }) =>
    apiClient.post<{ data: import("@/types").FrutaControl }>("/frutas", data),
  delete: (id: string) => apiClient.delete<{ data: null }>(`/frutas/${id}`),
}

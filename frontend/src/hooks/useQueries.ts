import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { apiClient, getErrorMessage } from "@/lib/api-client"
import type { 
  Socio, Parcela, Cosecha, EntradaAlmacen, 
  Liquidacion, Silo, FrutaControl, DashboardMetrics, SiloStats 
} from "@/types"

export const queryKeys = {
  dashboard: ["dashboard"] as const,
  dashboardMetrics: ["dashboard", "metrics"] as const,
  siloStats: ["dashboard", "silos"] as const,
  socios: (params?: { page?: number; limit?: number; search?: string }) => 
    ["socios", params] as const,
  socio: (id: string) => ["socios", id] as const,
  parcelas: (socioId: string) => ["parcelas", socioId] as const,
  cosechas: (params?: { page?: number; limit?: number; parcelaId?: string }) => 
    ["cosechas", params] as const,
  entradas: (params?: { page?: number; limit?: number; socioId?: string; siloId?: string }) => 
    ["entradas", params] as const,
  liquidaciones: (params?: { page?: number; limit?: number; socioId?: string }) => 
    ["liquidaciones", params] as const,
  silos: ["silos"] as const,
  frutas: (params?: { page?: number; limit?: number; especie?: string }) => 
    ["frutas", params] as const,
}

// Dashboard Hooks
export function useDashboardMetrics() {
  return useQuery({
    queryKey: queryKeys.dashboardMetrics,
    queryFn: () => apiClient.get<{ data: DashboardMetrics }>("/dashboard/metricas"),
    staleTime: 5 * 60 * 1000,
  })
}

export function useSiloStats() {
  return useQuery({
    queryKey: queryKeys.siloStats,
    queryFn: () => apiClient.get<{ data: SiloStats }>("/dashboard/silos"),
    staleTime: 5 * 60 * 1000,
  })
}

// Socios Hooks
export function useSocios(params?: { page?: number; limit?: number; search?: string }) {
  return useQuery({
    queryKey: queryKeys.socios(params),
    queryFn: () => {
      const searchParams = new URLSearchParams()
      if (params?.page) searchParams.set("page", String(params.page))
      if (params?.limit) searchParams.set("limit", String(params.limit))
      if (params?.search) searchParams.set("search", params.search)
      return apiClient.get<{ data: Socio[]; pagination: { total: number; pages: number } }>(`/socios?${searchParams}`)
    },
  })
}

export function useSocio(id: string) {
  return useQuery({
    queryKey: queryKeys.socio(id),
    queryFn: () => apiClient.get<{ data: Socio }>(`/socios/${id}`),
    enabled: !!id,
  })
}

export function useCreateSocio() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: Partial<Socio>) => 
      apiClient.post<{ data: Socio }>("/socios", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["socios"] })
    },
  })
}

export function useUpdateSocio() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Socio> }) =>
      apiClient.put<{ data: Socio }>(`/socios/${id}`, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["socios"] })
      queryClient.invalidateQueries({ queryKey: queryKeys.socio(id) })
    },
  })
}

export function useDeleteSocio() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => apiClient.delete<{ data: null }>(`/socios/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["socios"] })
    },
  })
}

// Parcelas Hooks
export function useParcelas(socioId: string) {
  return useQuery({
    queryKey: queryKeys.parcelas(socioId),
    queryFn: () => apiClient.get<{ data: Parcela[] }>(`/socios/${socioId}/parcelas`),
    enabled: !!socioId,
  })
}

export function useCreateParcela() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ socioId, data }: { socioId: string; data: Partial<Parcela> }) =>
      apiClient.post<{ data: Parcela }>(`/socios/${socioId}/parcelas`, data),
    onSuccess: (_, { socioId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.parcelas(socioId) })
      queryClient.invalidateQueries({ queryKey: queryKeys.socios() })
    },
  })
}

// Cosechas Hooks
export function useCosechas(params?: { page?: number; limit?: number; parcelaId?: string }) {
  return useQuery({
    queryKey: queryKeys.cosechas(params),
    queryFn: () => {
      const searchParams = new URLSearchParams()
      if (params?.page) searchParams.set("page", String(params.page))
      if (params?.limit) searchParams.set("limit", String(params.limit))
      if (params?.parcelaId) searchParams.set("parcelaId", params.parcelaId)
      return apiClient.get<{ data: Cosecha[]; pagination: { total: number; pages: number } }>(`/cosechas?${searchParams}`)
    },
  })
}

export function useCreateCosecha() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: Partial<Cosecha>) =>
      apiClient.post<{ data: Cosecha }>("/cosechas", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cosechas"] })
    },
  })
}

// Entradas Hooks
export function useEntradas(params?: { page?: number; limit?: number; socioId?: string; siloId?: string }) {
  return useQuery({
    queryKey: queryKeys.entradas(params),
    queryFn: () => {
      const searchParams = new URLSearchParams()
      if (params?.page) searchParams.set("page", String(params.page))
      if (params?.limit) searchParams.set("limit", String(params.limit))
      if (params?.socioId) searchParams.set("socioId", params.socioId)
      if (params?.siloId) searchParams.set("siloId", params.siloId)
      return apiClient.get<{ data: EntradaAlmacen[]; pagination: { total: number; pages: number } }>(`/entradas?${searchParams}`)
    },
  })
}

export function useCreateEntrada() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: Partial<EntradaAlmacen>) =>
      apiClient.post<{ data: EntradaAlmacen }>("/entradas", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["entradas"] })
      queryClient.invalidateQueries({ queryKey: queryKeys.siloStats })
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboardMetrics })
    },
  })
}

// Liquidaciones Hooks
export function useLiquidaciones(params?: { page?: number; limit?: number; socioId?: string }) {
  return useQuery({
    queryKey: queryKeys.liquidaciones(params),
    queryFn: () => {
      const searchParams = new URLSearchParams()
      if (params?.page) searchParams.set("page", String(params.page))
      if (params?.limit) searchParams.set("limit", String(params.limit))
      if (params?.socioId) searchParams.set("socioId", params.socioId)
      return apiClient.get<{ data: Liquidacion[]; pagination: { total: number; pages: number } }>(`/liquidaciones?${searchParams}`)
    },
  })
}

export function useCalcularLiquidacion() {
  return useMutation({
    mutationFn: ({ socioId, cosechaId }: { socioId: string; cosechaId?: string }) =>
      apiClient.post<{ data: Liquidacion }>("/liquidaciones/calcular", { socioId, cosechaId }),
  })
}

export function useCreateLiquidacion() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: Partial<Liquidacion>) =>
      apiClient.post<{ data: Liquidacion }>("/liquidaciones", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["liquidaciones"] })
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboardMetrics })
    },
  })
}

// Silos Hooks
export function useSilos() {
  return useQuery({
    queryKey: queryKeys.silos,
    queryFn: () => apiClient.get<{ data: Silo[] }>("/silos"),
    staleTime: 5 * 60 * 1000,
  })
}

export function useCreateSilo() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: Partial<Silo>) =>
      apiClient.post<{ data: Silo }>("/silos", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.silos })
    },
  })
}

// Frutas Hooks
export function useFrutas(params?: { page?: number; limit?: number; especie?: string }) {
  return useQuery({
    queryKey: queryKeys.frutas(params),
    queryFn: () => {
      const searchParams = new URLSearchParams()
      if (params?.page) searchParams.set("page", String(params.page))
      if (params?.limit) searchParams.set("limit", String(params.limit))
      if (params?.especie) searchParams.set("especie", params.especie)
      return apiClient.get<{ data: FrutaControl[]; pagination: { total: number; pages: number } }>(`/frutas?${searchParams}`)
    },
  })
}

export function useCreateFruta() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: Partial<FrutaControl>) =>
      apiClient.post<{ data: FrutaControl }>("/frutas", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["frutas"] })
    },
  })
}

export { getErrorMessage }

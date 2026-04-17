export type Rol = "ADMIN" | "EMPLEADO" | "SOCIO"
export type TipoCultivo = "MAIZ" | "TRIGO" | "CEBADA"
export type ResultadoCalidad = "APROBADO" | "RECHAZADO"
export type EspecieFruta = "MELOCOTON" | "NECTARINA" | "ALBARICOQUE" | "CIRUELA"
export type Calibre = "AA" | "A" | "B" | "C"

export interface Usuario {
  id: string
  email: string
  nombre: string
  rol: Rol
  socioId?: string
  socio?: Socio | null
}

export interface Socio {
  id: string
  numeroSocio: string
  nombre: string
  telefono?: string
  email?: string
  direccion?: string
  parcelas?: Parcela[]
  createdAt: string
  updatedAt: string
}

export interface Parcela {
  id: string
  socioId: string
  nombre: string
  hectareas: number
  ubicacion?: string
  coordenadas?: string
  cosechas?: Cosecha[]
  createdAt: string
  updatedAt: string
}

export interface Cosecha {
  id: string
  parcelaId: string
  parcela?: Parcela
  cultivo: TipoCultivo
  rendimiento?: number
  fechaSiembra?: string
  fechaCosecha?: string
  createdAt: string
  updatedAt: string
}

export interface Silo {
  id: string
  nombre: string
  capacidad: number
  stockActual: number
  cultivo?: TipoCultivo
  createdAt: string
  updatedAt: string
}

export interface EntradaAlmacen {
  id: string
  socioId: string
  socio?: Socio
  cosechaId?: string
  cosecha?: Cosecha
  siloId?: string
  silo?: Silo
  peso: number
  humedad: number
  pesoEspecifico: number
  temperatura: number
  impurezas: number
  controlCalidad?: ControlCalidad
  createdAt: string
  updatedAt: string
}

export interface ControlCalidad {
  id: string
  entradaAlmacenId: string
  entrada?: EntradaAlmacen
  humedad: number
  pesoEspecifico: number
  temperatura: number
  impurezas: number
  resultado: ResultadoCalidad
  observaciones?: string
  createdAt: string
  updatedAt: string
}

export interface FrutaControl {
  id: string
  socioId: string
  socio?: Socio
  especie: EspecieFruta
  variedad?: string
  calibre: Calibre
  azucar: number
  dureza: number
  defectos: number
  observaciones?: string
  createdAt: string
  updatedAt: string
}

export interface Liquidacion {
  id: string
  socioId: string
  socio?: Socio
  cosechaId?: string
  cosecha?: Cosecha
  totalKilos: number
  precioBase: number
  importeBruto: number
  apoyoGobierno: number
  importeTotal: number
  fechaLiquidacion: string
  createdAt: string
  updatedAt: string
}

export interface Campana {
  id: string
  nombre: string
  precioBaseMaiz: number
  precioBaseTrigo: number
  porcentajeApoyo: number
  fechaInicio: string
  fechaFin: string
  activa: boolean
  createdAt: string
  updatedAt: string
}

export interface DashboardMetrics {
  totalSocios: number
  totalParcelas: number
  hoyEntradas: number
  totalEntradasMes: number
  totalLiquidaciones: number
  importeTotalLiquidado: number
  rendimientoPromedioHectarea: number
  campanaActiva: Campana | null
}

export interface SiloStats {
  totalSilos: number
  totalCapacidad: number
  totalStock: number
  porcentajeOcupacion: number
  silos: Array<{
    id: string
    nombre: string
    capacidad: number
    stock: number
    cultivo?: TipoCultivo
    ocupacion: number
  }>
}

export interface PaginationParams {
  page?: number
  limit?: number
  search?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

export interface ApiResponse<T> {
  status: "success" | "error"
  message?: string
  data: T
}

export interface AuthResponse {
  token: string
  refreshToken: string
  user: Usuario
}

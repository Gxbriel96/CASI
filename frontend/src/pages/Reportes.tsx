import { useEffect, useState } from "react"
import { Header } from "@/components/layout/Header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { dashboardService, cosechaService } from "@/services/api"
import { formatCurrency, formatNumber } from "@/lib/utils"
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import type { DashboardMetrics, Cosecha } from "@/types"

const COLORS = ["#166534", "#22c55e", "#86efac", "#4ade80", "#bbf7d0"]

export default function ReportesPage() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null)
  const [cosechas, setCosechas] = useState<Cosecha[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedYear, setSelectedYear] = useState("2024")

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [metricsRes, cosechasRes] = await Promise.all([
        dashboardService.getMetrics(),
        cosechaService.getAll({ limit: 100 }),
      ])
      setMetrics(metricsRes.data)
      setCosechas(cosechasRes.data)
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const rendimientoData = [
    { mes: "Ene", real: 4200, objetivo: 4000 },
    { mes: "Feb", real: 3800, objetivo: 4000 },
    { mes: "Mar", real: 5100, objetivo: 4500 },
    { mes: "Abr", real: 4600, objetivo: 4500 },
    { mes: "May", real: 5800, objetivo: 5000 },
    { mes: "Jun", real: 6200, objetivo: 5500 },
    { mes: "Jul", real: 5900, objetivo: 5500 },
    { mes: "Ago", real: 5400, objetivo: 5000 },
    { mes: "Sep", real: 6100, objetivo: 5500 },
    { mes: "Oct", real: 6800, objetivo: 6000 },
    { mes: "Nov", real: 6500, objetivo: 6000 },
    { mes: "Dic", real: 6200, objetivo: 5500 },
  ]

  const rendimientoPorCultivo = [
    { cultivo: "Maíz", rendimiento: 8500, area: 120 },
    { cultivo: "Trigo", rendimiento: 4200, area: 85 },
    { cultivo: "Cebada", rendimiento: 3800, area: 65 },
  ]

  const topSociosData = [
    { nombre: "Juan García", kilos: 45000, importe: 12500 },
    { nombre: "María López", kilos: 38000, importe: 10500 },
    { nombre: "Pedro Sánchez", kilos: 32000, importe: 8900 },
    { nombre: "Ana Martínez", kilos: 28000, importe: 7800 },
    { nombre: "Luis Rodríguez", kilos: 24000, importe: 6700 },
  ]

  const distribucionData = [
    { name: "Parcelas", value: metrics?.totalParcelas || 0 },
    { name: "Socios Activos", value: metrics?.totalSocios || 0 },
    { name: "Cosechas", value: cosechas.length },
    { name: "Liquidaciones", value: metrics?.totalLiquidaciones || 0 },
  ]

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Header title="Reportes" description="Análisis de rendimiento agrícola" />
        <div className="p-6">
          <div className="grid gap-6 md:grid-cols-2">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-[400px]" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Header title="Reportes" description="Análisis de rendimiento por hectárea" />

      <div className="p-6 space-y-6">
        <div className="flex justify-end">
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Seleccionar año" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2024">2024</SelectItem>
              <SelectItem value="2023">2023</SelectItem>
              <SelectItem value="2022">2022</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="animate-fade-in opacity-0" style={{ animationDelay: "100ms", animationFillMode: "forwards" }}>
            <CardHeader>
              <CardTitle>Rendimiento por Hectárea (kg/ha)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={rendimientoData}>
                    <defs>
                      <linearGradient id="colorReal" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#166534" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#166534" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="mes" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="real"
                      stroke="#166534"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorReal)"
                      name="Rendimiento Real"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="animate-fade-in opacity-0" style={{ animationDelay: "200ms", animationFillMode: "forwards" }}>
            <CardHeader>
              <CardTitle>Rendimiento por Cultivo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={rendimientoPorCultivo} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis type="number" className="text-xs" />
                    <YAxis dataKey="cultivo" type="category" className="text-xs" width={60} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                      formatter={(value: number) => [`${formatNumber(value)} kg/ha`, "Rendimiento"]}
                    />
                    <Legend />
                    <Bar dataKey="rendimiento" fill="#166534" name="kg/ha" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="animate-fade-in opacity-0" style={{ animationDelay: "300ms", animationFillMode: "forwards" }}>
            <CardHeader>
              <CardTitle>Top 5 Socios por Kilos Entregados</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topSociosData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="nombre" className="text-xs" tick={{ fontSize: 12 }} />
                    <YAxis className="text-xs" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                      formatter={(value: number, name: string) => [
                        name === "kilos" ? `${formatNumber(value)} kg` : formatCurrency(value),
                        name === "kilos" ? "Kilos" : "Importe",
                      ]}
                    />
                    <Bar dataKey="kilos" fill="#166534" name="Kilos" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="animate-fade-in opacity-0" style={{ animationDelay: "400ms", animationFillMode: "forwards" }}>
            <CardHeader>
              <CardTitle>Resumen de la Cooperativa</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={distribucionData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {distribucionData.map((_entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="animate-fade-in opacity-0" style={{ animationDelay: "500ms", animationFillMode: "forwards" }}>
          <CardHeader>
            <CardTitle>Resumen Ejecutivo {selectedYear}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-4">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Rendimiento Promedio</p>
                <p className="text-3xl font-bold text-primary">
                  {formatNumber(metrics?.rendimientoPromedioHectarea || 0)} kg/ha
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Total Socios</p>
                <p className="text-3xl font-bold">{metrics?.totalSocios || 0}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Total Parcelas</p>
                <p className="text-3xl font-bold">{metrics?.totalParcelas || 0}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Importe Total Liquidado</p>
                <p className="text-3xl font-bold text-green-600">
                  {formatCurrency(metrics?.importeTotalLiquidado || 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

import { useEffect, useState } from "react"
import { Header } from "@/components/layout/Header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { dashboardService } from "@/services/api"
import { formatCurrency } from "@/lib/utils"
import {
  Users,
  Wheat,
  TrendingUp,
  Warehouse,
  DollarSign,
  Calendar,
} from "lucide-react"
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"
import type { DashboardMetrics, SiloStats } from "@/types"

const COLORS = ["#166534", "#22c55e", "#86efac", "#dcfce7"]

export default function DashboardPage() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null)
  const [siloStats, setSiloStats] = useState<SiloStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [metricsRes, silosRes] = await Promise.all([
          dashboardService.getMetrics(),
          dashboardService.getSiloStats(),
        ])
        setMetrics(metricsRes.data)
        setSiloStats(silosRes.data)
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  const metricCards = [
    {
      title: "Total Socios",
      value: metrics?.totalSocios ?? 0,
      icon: Users,
      change: "+12%",
      changeType: "positive" as const,
    },
    {
      title: "Parcelas Registradas",
      value: metrics?.totalParcelas ?? 0,
      icon: Wheat,
      change: "+8%",
      changeType: "positive" as const,
    },
    {
      title: "Entradas Hoy",
      value: metrics?.hoyEntradas ?? 0,
      icon: TrendingUp,
      change: "+5%",
      changeType: "positive" as const,
    },
    {
      title: "Liquidado Total",
      value: formatCurrency(metrics?.importeTotalLiquidado ?? 0),
      icon: DollarSign,
      change: "+18%",
      changeType: "positive" as const,
    },
  ]

  const mockRendimientoData = [
    { mes: "Ene", rendimiento: 4200 },
    { mes: "Feb", rendimiento: 3800 },
    { mes: "Mar", rendimiento: 5100 },
    { mes: "Abr", rendimiento: 4600 },
    { mes: "May", rendimiento: 5800 },
    { mes: "Jun", rendimiento: 6200 },
  ]

  const mockCultivoData = [
    { name: "Maíz", value: 45 },
    { name: "Trigo", value: 30 },
    { name: "Cebada", value: 25 },
  ]

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Header title="Dashboard" description="Resumen de la cooperativa" />
        <div className="p-6 space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <Card key={i}>
                <CardHeader className="pb-2">
                  <Skeleton className="h-4 w-24" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-16 mb-2" />
                  <Skeleton className="h-4 w-20" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Header title="Dashboard" description="Resumen de la cooperativa" />

      <div className="p-6 space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {metricCards.map((card, index) => (
            <Card
              key={card.title}
              className="animate-fade-in opacity-0"
              style={{ animationDelay: `${(index + 1) * 100}ms`, animationFillMode: "forwards" }}
            >
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {card.title}
                </CardTitle>
                <card.icon className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{card.value}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  <span className={card.changeType === "positive" ? "text-green-600" : "text-red-600"}>
                    {card.change}
                  </span>{" "}
                  vs mes anterior
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="animate-fade-in opacity-0" style={{ animationDelay: "500ms", animationFillMode: "forwards" }}>
            <CardHeader>
              <CardTitle>Rendimiento por Mes (kg/ha)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={mockRendimientoData}>
                    <defs>
                      <linearGradient id="colorRendimiento" x1="0" y1="0" x2="0" y2="1">
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
                    <Area
                      type="monotone"
                      dataKey="rendimiento"
                      stroke="#166534"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorRendimiento)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="animate-fade-in opacity-0" style={{ animationDelay: "600ms", animationFillMode: "forwards" }}>
            <CardHeader>
              <CardTitle>Distribución por Cultivo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={mockCultivoData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {mockCultivoData.map((_entry, index) => (
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

        <Card className="animate-fade-in opacity-0" style={{ animationDelay: "700ms", animationFillMode: "forwards" }}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Warehouse className="h-5 w-5" />
                Ocupación de Silos
              </CardTitle>
              {siloStats && (
                <span className="text-sm text-muted-foreground">
                  {siloStats.porcentajeOcupacion.toFixed(1)}% ocupación total
                </span>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={siloStats?.silos || []} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis type="number" className="text-xs" />
                  <YAxis dataKey="nombre" type="category" className="text-xs" width={80} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                    formatter={(value: number) => [`${value.toFixed(2)} kg`, "Stock"]}
                  />
                  <Legend />
                  <Bar dataKey="stock" fill="#166534" name="Stock Actual" />
                  <Bar dataKey="capacidad" fill="#dcfce7" name="Capacidad" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {metrics?.campanaActiva && (
          <Card className="border-primary/50 bg-primary/5 animate-fade-in opacity-0" style={{ animationDelay: "800ms", animationFillMode: "forwards" }}>
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">{metrics.campanaActiva.nombre}</h3>
                <p className="text-sm text-muted-foreground">
                  Maíz: {formatCurrency(metrics.campanaActiva.precioBaseMaiz)}/kg ·{" "}
                  Trigo: {formatCurrency(metrics.campanaActiva.precioBaseTrigo)}/kg ·{" "}
                  Apoyo: {metrics.campanaActiva.porcentajeApoyo}%
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

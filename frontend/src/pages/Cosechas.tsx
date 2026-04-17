import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Header } from "@/components/layout/Header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { cosechaService, parcelaService, socioService } from "@/services/api"
import { useToast } from "@/hooks/useToast"
import { createCosechaSchema, type CreateCosechaFormData } from "@/schemas"
import { formatDate, formatNumber } from "@/lib/utils"
import { Plus, Search, TrendingUp } from "lucide-react"
import type { Cosecha, Parcela, Socio } from "@/types"

export default function CosechasPage() {
  const { toast } = useToast()
  const [cosechas, setCosechas] = useState<Cosecha[]>([])
  const [parcelas, setParcelas] = useState<Parcela[]>([])
  const [socios, setSocios] = useState<Socio[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedSocioId, setSelectedSocioId] = useState<string>("")

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CreateCosechaFormData>({
    resolver: zodResolver(createCosechaSchema),
  })

  const parcelaId = watch("parcelaId")

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    if (parcelas.length > 0) {
      setValue("parcelaId", parcelas[0].id)
    }
  }, [parcelas, setValue])

  const fetchData = async () => {
    try {
      const [cosechasRes, sociosRes] = await Promise.all([
        cosechaService.getAll(),
        socioService.getAll(),
      ])
      setCosechas(cosechasRes.data as unknown as Cosecha[])
      setSocios(sociosRes.data as unknown as Socio[])
      
      if (sociosRes.data && (sociosRes.data as unknown as Socio[]).length > 0) {
        const firstSocio = (sociosRes.data as unknown as Socio[])[0]
        setSelectedSocioId(firstSocio.id)
        const parcelasRes = await parcelaService.getBySocio(firstSocio.id)
        setParcelas(parcelasRes.data)
      }
    } catch (error) {
      toast({ title: "Error al cargar datos", type: "error" })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSocioChange = async (socioId: string) => {
    setSelectedSocioId(socioId)
    try {
      const parcelasRes = await parcelaService.getBySocio(socioId)
      setParcelas(parcelasRes.data)
    } catch {
      setParcelas([])
    }
  }

  const onSubmit = async (data: CreateCosechaFormData) => {
    try {
      await cosechaService.create(data)
      toast({ title: "Cosecha registrada", type: "success" })
      setIsDialogOpen(false)
      reset()
      fetchData()
    } catch {
      toast({ title: "Error al guardar", type: "error" })
    }
  }

  const filteredCosechas = cosechas.filter((cosecha) =>
    cosecha.parcela?.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cosecha.cultivo.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const cultivoColors: Record<string, string> = {
    MAIZ: "bg-yellow-100 text-yellow-800",
    TRIGO: "bg-amber-100 text-amber-800",
    CEBADA: "bg-orange-100 text-orange-800",
  }

  return (
    <div className="min-h-screen">
      <Header title="Registro de Cosechas" description="Control de cultivos y rendimientos" />

      <div className="p-6 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar por parcela o cultivo..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button onClick={() => { reset(); setIsDialogOpen(true) }}>
            <Plus className="h-4 w-4 mr-2" />
            Nueva Cosecha
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {["MAIZ", "TRIGO", "CEBADA"].map((cultivo) => {
            const count = cosechas.filter((c) => c.cultivo === cultivo).length
            return (
              <Card key={cultivo} className="border-l-4 border-l-primary">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{cultivo}</p>
                      <p className="text-2xl font-bold">{count}</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-muted-foreground/50" />
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <Card>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-6 space-y-4">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Parcela</TableHead>
                    <TableHead>Socio</TableHead>
                    <TableHead>Cultivo</TableHead>
                    <TableHead>Hectáreas</TableHead>
                    <TableHead>Rendimiento (kg/ha)</TableHead>
                    <TableHead>Fecha Siembra</TableHead>
                    <TableHead>Fecha Cosecha</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCosechas.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        No hay cosechas registradas
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredCosechas.map((cosecha) => (
                      <TableRow key={cosecha.id}>
                        <TableCell className="font-medium">
                          {cosecha.parcela?.nombre || "-"}
                        </TableCell>
                        <TableCell>{cosecha.parcela?.socioId || "-"}</TableCell>
                        <TableCell>
                          <Badge className={cultivoColors[cosecha.cultivo]}>
                            {cosecha.cultivo}
                          </Badge>
                        </TableCell>
                        <TableCell>{formatNumber(cosecha.parcela?.hectareas || 0)}</TableCell>
                        <TableCell>
                          {cosecha.rendimiento ? formatNumber(cosecha.rendimiento) : "-"}
                        </TableCell>
                        <TableCell>
                          {cosecha.fechaSiembra ? formatDate(cosecha.fechaSiembra) : "-"}
                        </TableCell>
                        <TableCell>
                          {cosecha.fechaCosecha ? formatDate(cosecha.fechaCosecha) : "-"}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nueva Cosecha</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label>Socio</Label>
              <Select value={selectedSocioId} onValueChange={handleSocioChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar socio" />
                </SelectTrigger>
                <SelectContent>
                  {socios.map((socio) => (
                    <SelectItem key={socio.id} value={socio.id}>
                      {socio.numeroSocio} - {socio.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Parcela *</Label>
              <Select value={parcelaId} onValueChange={(v) => setValue("parcelaId", v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar parcela" />
                </SelectTrigger>
                <SelectContent>
                  {parcelas.map((parcela) => (
                    <SelectItem key={parcela.id} value={parcela.id}>
                      {parcela.nombre} ({parcela.hectareas} ha)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.parcelaId && (
                <p className="text-sm text-destructive">{errors.parcelaId.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Tipo de Cultivo *</Label>
              <Select onValueChange={(v) => setValue("cultivo", v as "MAIZ" | "TRIGO" | "CEBADA")}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar cultivo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MAIZ">Maíz</SelectItem>
                  <SelectItem value="TRIGO">Trigo</SelectItem>
                  <SelectItem value="CEBADA">Cebada</SelectItem>
                </SelectContent>
              </Select>
              {errors.cultivo && (
                <p className="text-sm text-destructive">{errors.cultivo.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fechaSiembra">Fecha Siembra</Label>
                <Input id="fechaSiembra" type="date" {...register("fechaSiembra")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fechaCosecha">Fecha Cosecha</Label>
                <Input id="fechaCosecha" type="date" {...register("fechaCosecha")} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="rendimiento">Rendimiento (kg/ha)</Label>
              <Input id="rendimiento" type="number" step="0.01" {...register("rendimiento", { valueAsNumber: true })} />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Guardando..." : "Guardar"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

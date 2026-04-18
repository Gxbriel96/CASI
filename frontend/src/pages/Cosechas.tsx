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
import { Plus, Search, TrendingUp, Edit, Trash2 } from "lucide-react"
import type { Cosecha, Parcela, Socio } from "@/types"

export default function CosechasPage() {
  const { toast } = useToast()
  const [cosechas, setCosechas] = useState<Cosecha[]>([])
  const [parcelas, setParcelas] = useState<Parcela[]>([])
  const [socios, setSocios] = useState<Socio[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCosecha, setEditingCosecha] = useState<Cosecha | null>(null)
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

  const fetchData = async () => {
    try {
      const [cosechasRes, parcelasRes, sociosRes] = await Promise.all([
        cosechaService.getAll(),
        parcelaService.getAll(),
        socioService.getAll(),
      ])
      setCosechas(cosechasRes.data as Cosecha[])
      setParcelas(parcelasRes.data as Parcela[])
      setSocios(sociosRes.data as Socio[])
      
      const parcelasData = parcelasRes.data as Parcela[]
      if (parcelasData.length > 0) {
        setSelectedSocioId(parcelasData[0].socioId)
      }
    } catch (error) {
      console.error("Error fetching data:", error)
      toast({ title: "Error al cargar datos", type: "error" })
    } finally {
      setIsLoading(false)
    }
  }

  const onSubmit = async (data: CreateCosechaFormData) => {
    console.log("onSubmit called with:", data, "parcelaId:", parcelaId)
    try {
      if (!parcelaId) {
        toast({ title: "Seleccione una parcela", type: "warning" })
        return
      }
      
      const cultivoValue = data.cultivo as "MAIZ" | "TRIGO" | "CEBADA"
      
      const payload = {
        parcelaId: parcelaId,
        cultivo: cultivoValue,
        rendimiento: data.rendimiento ? Number(data.rendimiento) : undefined,
        fechaSiembra: data.fechaSiembra || undefined,
        fechaCosecha: data.fechaCosecha || undefined,
      }
      
      console.log("Payload to send:", payload)

      if (editingCosecha) {
        await cosechaService.update(editingCosecha.id, payload)
        toast({ title: "Cosecha actualizada", type: "success" })
      } else {
        await cosechaService.create(payload)
        toast({ title: "Cosecha registrada", type: "success" })
      }
      setIsDialogOpen(false)
      reset()
      setEditingCosecha(null)
      fetchData()
    } catch (error) {
      console.error("Error saving cosecha:", error)
      toast({ title: "Error al guardar", type: "error" })
    }
  }

  const handleEdit = (cosecha: Cosecha) => {
    setEditingCosecha(cosecha)
    setValue("parcelaId", cosecha.parcelaId)
    setValue("cultivo", cosecha.cultivo)
    setValue("rendimiento", cosecha.rendimiento)
    if (cosecha.fechaSiembra) setValue("fechaSiembra", cosecha.fechaSiembra.split('T')[0])
    if (cosecha.fechaCosecha) setValue("fechaCosecha", cosecha.fechaCosecha.split('T')[0])
    setIsDialogOpen(true)
  }

  const handleDelete = async (cosecha: Cosecha) => {
    if (!confirm(`¿Eliminar la cosecha de ${cosecha.parcela?.nombre}?`)) return
    try {
      await cosechaService.delete(cosecha.id)
      toast({ title: "Cosecha eliminada", type: "success" })
      fetchData()
    } catch (error) {
      console.error("Error deleting cosecha:", error)
      toast({ title: "No se puede eliminar", type: "error" })
    }
  }

  const getSocioNombre = (socioId: string) => {
    const socio = socios.find(s => s.id === socioId)
    return socio ? `${socio.numeroSocio} - ${socio.nombre}` : socioId.slice(0, 8)
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
          <Button onClick={() => { reset(); setEditingCosecha(null); setIsDialogOpen(true) }}>
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
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCosechas.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                        No hay cosechas registradas
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredCosechas.map((cosecha) => (
                      <TableRow key={cosecha.id}>
                        <TableCell className="font-medium">
                          {cosecha.parcela?.nombre || "-"}
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">
                            {cosecha.parcela?.socioId ? getSocioNombre(cosecha.parcela.socioId) : "-"}
                          </Badge>
                        </TableCell>
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
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon" onClick={() => handleEdit(cosecha)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive hover:text-destructive"
                              onClick={() => handleDelete(cosecha)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
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
            <DialogTitle>
              {editingCosecha ? "Editar Cosecha" : "Nueva Cosecha"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit((data) => {
              console.log("Cosechas - Form submitted:", data)
              onSubmit(data)
            })} className="space-y-4">
            <div className="space-y-2">
              <Label>Parcela *</Label>
              <Select 
                value={parcelaId || ""} 
                onValueChange={(v) => setValue("parcelaId", v, { shouldValidate: true })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar parcela" />
                </SelectTrigger>
                <SelectContent>
                  {parcelas.map((parcela) => (
                    <SelectItem key={parcela.id} value={parcela.id}>
                      {parcela.nombre} ({parcela.hectareas} ha) - {getSocioNombre(parcela.socioId)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {parcelaId ? null : (
                <p className="text-sm text-destructive">Seleccione una parcela</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Tipo de Cultivo *</Label>
              <Select 
                onValueChange={(v) => setValue("cultivo", v as "MAIZ" | "TRIGO" | "CEBADA")}
                defaultValue={editingCosecha?.cultivo}
              >
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
              <Input 
                id="rendimiento" 
                type="number" 
                step="0.01" 
                {...register("rendimiento", { valueAsNumber: true })} 
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting || !parcelaId}>
                {isSubmitting ? "Guardando..." : "Guardar"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
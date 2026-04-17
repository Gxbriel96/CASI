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
import { parcelaService, socioService } from "@/services/api"
import { useToast } from "@/hooks/useToast"
import { createParcelaSchema, type CreateParcelaFormData } from "@/schemas"
import { formatNumber } from "@/lib/utils"
import { Plus, Search, MapPin, Edit, Trash2 } from "lucide-react"
import type { Parcela, Socio } from "@/types"

export default function ParcelasPage() {
  const { toast } = useToast()
  const [parcelas, setParcelas] = useState<Parcela[]>([])
  const [socios, setSocios] = useState<Socio[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingParcela, setEditingParcela] = useState<Parcela | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedSocioId, setSelectedSocioId] = useState<string>("")

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CreateParcelaFormData>({
    resolver: zodResolver(createParcelaSchema),
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [parcelasRes, sociosRes] = await Promise.all([
        parcelaService.getAll(),
        socioService.getAll(),
      ])
      setParcelas(parcelasRes.data)
      setSocios(sociosRes.data as unknown as Socio[])
    } catch (error) {
      console.error("Error fetching data:", error)
      toast({ title: "Error al cargar datos", type: "error" })
    } finally {
      setIsLoading(false)
    }
  }

  const onSubmit = async (data: CreateParcelaFormData) => {
    console.log("Form data:", data)
    console.log("Selected socio:", selectedSocioId)
    try {
      if (editingParcela) {
        await parcelaService.update(editingParcela.id, {
          nombre: data.nombre,
          hectareas: data.hectareas,
          ubicacion: data.ubicacion,
          coordenadas: data.coordenadas,
        })
        toast({ title: "Parcela actualizada", type: "success" })
      } else {
        if (!selectedSocioId) {
          toast({ title: "Seleccione un socio", type: "warning" })
          return
        }
        const payload = {
          socioId: selectedSocioId,
          nombre: data.nombre,
          hectareas: Number(data.hectareas),
          ubicacion: data.ubicacion || undefined,
          coordenadas: data.coordenadas || undefined,
        }
        console.log("Creating parcela with payload:", payload)
        await parcelaService.create(payload)
        toast({ title: "Parcela creada", type: "success" })
      }
      setIsDialogOpen(false)
      reset()
      setSelectedSocioId("")
      setEditingParcela(null)
      fetchData()
    } catch (error) {
      console.error("Error saving parcela:", error)
      toast({ title: "Error al guardar", type: "error" })
    }
  }

  const handleEdit = (parcela: Parcela) => {
    setEditingParcela(parcela)
    setSelectedSocioId(parcela.socioId)
    setValue("socioId", parcela.socioId)
    setValue("nombre", parcela.nombre)
    setValue("hectareas", parcela.hectareas)
    setValue("ubicacion", parcela.ubicacion || "")
    setValue("coordenadas", parcela.coordenadas || "")
    setIsDialogOpen(true)
  }

  const handleDelete = async (parcela: Parcela) => {
    if (!confirm(`¿Eliminar la parcela "${parcela.nombre}"?`)) return
    try {
      await parcelaService.delete(parcela.id)
      toast({ title: "Parcela eliminada", type: "success" })
      fetchData()
    } catch (error) {
      console.error("Error deleting parcela:", error)
      toast({ title: "No se puede eliminar", type: "error" })
    }
  }

  const getSocioNombre = (socioId: string) => {
    const socio = socios.find(s => s.id === socioId)
    return socio ? `${socio.numeroSocio} - ${socio.nombre}` : socioId.slice(0, 8)
  }

  const filteredParcelas = parcelas.filter(
    (parcela) =>
      parcela.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      parcela.ubicacion?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const totalHectareas = parcelas.reduce((acc, p) => acc + p.hectareas, 0)

  return (
    <div className="min-h-screen">
      <Header title="Parcelas" description="Gestión de parcelas agrícolas" />

      <div className="p-6 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar parcela..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button
            onClick={() => {
              setEditingParcela(null)
              setSelectedSocioId("")
              reset()
              setIsDialogOpen(true)
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            Nueva Parcela
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card className="border-l-4 border-l-primary">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Parcelas</p>
                  <p className="text-3xl font-bold">{parcelas.length}</p>
                </div>
                <MapPin className="h-10 w-10 text-muted-foreground/30" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Superficie Total</p>
                  <p className="text-3xl font-bold">{formatNumber(totalHectareas)} ha</p>
                </div>
                <MapPin className="h-10 w-10 text-green-500/30" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-amber-500">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Promedio por Parcela</p>
                  <p className="text-3xl font-bold">
                    {parcelas.length > 0 ? formatNumber(totalHectareas / parcelas.length) : 0} ha
                  </p>
                </div>
                <MapPin className="h-10 w-10 text-amber-500/30" />
              </div>
            </CardContent>
          </Card>
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
                    <TableHead>Nombre</TableHead>
                    <TableHead>Socio</TableHead>
                    <TableHead>Hectáreas</TableHead>
                    <TableHead>Ubicación</TableHead>
                    <TableHead>Coordenadas</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredParcelas.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        No hay parcelas registradas
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredParcelas.map((parcela) => (
                      <TableRow key={parcela.id}>
                        <TableCell className="font-medium">{parcela.nombre}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">{getSocioNombre(parcela.socioId)}</Badge>
                        </TableCell>
                        <TableCell className="font-mono">
                          {formatNumber(parcela.hectareas)} ha
                        </TableCell>
                        <TableCell>{parcela.ubicacion || "-"}</TableCell>
                        <TableCell className="text-sm text-muted-foreground font-mono">
                          {parcela.coordenadas || "-"}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEdit(parcela)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive hover:text-destructive"
                              onClick={() => handleDelete(parcela)}
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
              {editingParcela ? "Editar Parcela" : "Nueva Parcela"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit((data) => {
              console.log("Form submitted!", data, "socio:", selectedSocioId)
              onSubmit(data)
            })} className="space-y-4">
            {!editingParcela && (
              <div className="space-y-2">
                <Label>Socio Propietario *</Label>
                <Select 
                  value={selectedSocioId} 
                  onValueChange={(v) => setSelectedSocioId(v)}
                >
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
            )}

            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre de la Parcela *</Label>
              <Input id="nombre" {...register("nombre")} placeholder="Ej: Parcela Norte" />
              {errors.nombre && (
                <p className="text-sm text-destructive">{errors.nombre.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="hectareas">Superficie (hectáreas) *</Label>
              <Input
                id="hectareas"
                type="number"
                step="0.01"
                {...register("hectareas", { valueAsNumber: true })}
                placeholder="Ej: 10.5"
              />
              {errors.hectareas && (
                <p className="text-sm text-destructive">{errors.hectareas.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="ubicacion">Ubicación</Label>
              <Input id="ubicacion" {...register("ubicacion")} placeholder="Ej: Polígono 5, Parcela 12" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="coordenadas">Coordenadas GPS</Label>
              <Input id="coordenadas" {...register("coordenadas")} placeholder="Ej: 38.5, -1.2" />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting || (!editingParcela && !selectedSocioId)}>
                {isSubmitting ? "Guardando..." : "Guardar"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

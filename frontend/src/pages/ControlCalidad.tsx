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
import { frutaService, socioService } from "@/services/api"
import { useToast } from "@/hooks/useToast"
import { createFrutaSchema, type CreateFrutaFormData } from "@/schemas"
import { formatDate } from "@/lib/utils"
import { Plus, Search, Apple, CheckCircle, AlertTriangle } from "lucide-react"
import type { FrutaControl, Socio } from "@/types"

const calibreColors: Record<string, string> = {
  AA: "bg-purple-100 text-purple-800",
  A: "bg-blue-100 text-blue-800",
  B: "bg-green-100 text-green-800",
  C: "bg-yellow-100 text-yellow-800",
}

export default function ControlCalidadPage() {
  const { toast } = useToast()
  const [frutas, setFrutas] = useState<FrutaControl[]>([])
  const [socios, setSocios] = useState<Socio[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterEspecie, setFilterEspecie] = useState<string>("all")

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CreateFrutaFormData>({
    resolver: zodResolver(createFrutaSchema),
    defaultValues: {
      especie: "MELOCOTON",
      calibre: "A",
    },
  })

  const especie = watch("especie")

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [frutasRes, sociosRes] = await Promise.all([
        frutaService.getAll(),
        socioService.getAll(),
      ])
      setFrutas(frutasRes.data as unknown as FrutaControl[])
      setSocios(sociosRes.data as unknown as Socio[])
    } catch {
      toast({ title: "Error al cargar datos", type: "error" })
    } finally {
      setIsLoading(false)
    }
  }

  const onSubmit = async (data: CreateFrutaFormData) => {
    try {
      await frutaService.create(data)
      toast({ title: "Control de calidad registrado", type: "success" })
      setIsDialogOpen(false)
      reset()
      fetchData()
    } catch {
      toast({ title: "Error al guardar", type: "error" })
    }
  }

  const filteredFrutas = frutas.filter((fruta) => {
    const matchesSearch =
      fruta.socio?.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fruta.variedad?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesEspecie = filterEspecie === "all" || fruta.especie === filterEspecie
    return matchesSearch && matchesEspecie
  })

  const calidadBuena = frutas.filter((f) => f.defectos < 10 && f.azucar > 10).length
  const calidadMedia = frutas.filter((f) => f.defectos >= 10 && f.defectos < 20).length
  const calidadBaja = frutas.filter((f) => f.defectos >= 20).length

  return (
    <div className="min-h-screen">
      <Header
        title="Control de Calidad - Frutas"
        description="Registro APPCC de frutas (azúcar, dureza, defectos)"
      />

      <div className="p-6 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div className="flex flex-1 gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar por socio o variedad..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={filterEspecie} onValueChange={setFilterEspecie}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filtrar especie" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="MELOCOTON">Melocotón</SelectItem>
                <SelectItem value="NECTARINA">Nectarina</SelectItem>
                <SelectItem value="ALBARICOQUE">Albaricoque</SelectItem>
                <SelectItem value="CIRUELA">Ciruela</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={() => { reset(); setIsDialogOpen(true) }}>
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Control
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Card className="border-l-4 border-l-green-600">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Calidad Buena</p>
                  <p className="text-3xl font-bold text-green-600">{calidadBuena}</p>
                </div>
                <CheckCircle className="h-10 w-10 text-green-600/30" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-amber-500">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Calidad Media</p>
                  <p className="text-3xl font-bold text-amber-500">{calidadMedia}</p>
                </div>
                <AlertTriangle className="h-10 w-10 text-amber-500/30" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-red-500">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Calidad Baja</p>
                  <p className="text-3xl font-bold text-red-500">{calidadBaja}</p>
                </div>
                <AlertTriangle className="h-10 w-10 text-red-500/30" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Registros</p>
                  <p className="text-3xl font-bold">{frutas.length}</p>
                </div>
                <Apple className="h-10 w-10 text-purple-500/30" />
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
                    <TableHead>Fecha</TableHead>
                    <TableHead>Socio</TableHead>
                    <TableHead>Especie</TableHead>
                    <TableHead>Variedad</TableHead>
                    <TableHead>Calibre</TableHead>
                    <TableHead>Azúcar (°Brix)</TableHead>
                    <TableHead>Dureza (kg)</TableHead>
                    <TableHead>Defectos %</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredFrutas.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                        No hay registros de control de calidad
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredFrutas.map((fruta) => (
                      <TableRow key={fruta.id}>
                        <TableCell>{formatDate(fruta.createdAt)}</TableCell>
                        <TableCell className="font-medium">
                          {fruta.socio?.nombre || "-"}
                        </TableCell>
                        <TableCell>{fruta.especie}</TableCell>
                        <TableCell>{fruta.variedad || "-"}</TableCell>
                        <TableCell>
                          <Badge className={calibreColors[fruta.calibre]}>
                            {fruta.calibre}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className={fruta.azucar < 10 ? "text-red-500" : "text-green-600"}>
                            {fruta.azucar}°
                          </span>
                        </TableCell>
                        <TableCell>{fruta.dureza}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              fruta.defectos < 10
                                ? "success"
                                : fruta.defectos < 20
                                ? "warning"
                                : "destructive"
                            }
                          >
                            {fruta.defectos}%
                          </Badge>
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
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Registro de Control APPCC</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label>Socio *</Label>
              <Select onValueChange={(v) => reset({ socioId: v } as CreateFrutaFormData)}>
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

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Especie *</Label>
                <Select
                  value={especie}
                  onValueChange={(v) => setValue("especie", v as CreateFrutaFormData["especie"])}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MELOCOTON">Melocotón</SelectItem>
                    <SelectItem value="NECTARINA">Nectarina</SelectItem>
                    <SelectItem value="ALBARICOQUE">Albaricoque</SelectItem>
                    <SelectItem value="CIRUELA">Ciruela</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="variedad">Variedad</Label>
                <Input id="variedad" {...register("variedad")} placeholder="Ej: Calrico" />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Calibre *</Label>
              <Select onValueChange={(v) => setValue("calibre", v as CreateFrutaFormData["calibre"])}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="AA">AA (Extra Grande)</SelectItem>
                  <SelectItem value="A">A (Grande)</SelectItem>
                  <SelectItem value="B">B (Mediano)</SelectItem>
                  <SelectItem value="C">C (Pequeño)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="azucar">Azúcar (°Brix) *</Label>
                <Input
                  id="azucar"
                  type="number"
                  step="0.1"
                  placeholder="0-30"
                  {...register("azucar", { valueAsNumber: true })}
                />
                {errors.azucar && (
                  <p className="text-sm text-destructive">{errors.azucar.message}</p>
                )}
                <p className="text-xs text-muted-foreground">Mínimo recomendado: 10°</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dureza">Dureza (kg) *</Label>
                <Input
                  id="dureza"
                  type="number"
                  step="0.1"
                  placeholder="0-20"
                  {...register("dureza", { valueAsNumber: true })}
                />
                {errors.dureza && (
                  <p className="text-sm text-destructive">{errors.dureza.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="defectos">Defectos (%) *</Label>
                <Input
                  id="defectos"
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  placeholder="0-100"
                  {...register("defectos", { valueAsNumber: true })}
                />
                {errors.defectos && (
                  <p className="text-sm text-destructive">{errors.defectos.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="observaciones">Observaciones</Label>
              <Input
                id="observaciones"
                {...register("observaciones")}
                placeholder="Observaciones adicionales..."
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Guardando..." : "Registrar Control"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

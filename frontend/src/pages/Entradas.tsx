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
import { entradaService, socioService, siloService } from "@/services/api"
import { useToast } from "@/hooks/useToast"
import { createEntradaSchema, type CreateEntradaFormData } from "@/schemas"
import { formatDate, formatNumber } from "@/lib/utils"
import { Plus, Search, Scale, Thermometer, Droplets } from "lucide-react"
import type { EntradaAlmacen, Socio, Silo } from "@/types"

export default function EntradasPage() {
  const { toast } = useToast()
  const [entradas, setEntradas] = useState<EntradaAlmacen[]>([])
  const [socios, setSocios] = useState<Socio[]>([])
  const [silos, setSilos] = useState<Silo[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateEntradaFormData>({
    resolver: zodResolver(createEntradaSchema),
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [entradasRes, sociosRes, silosRes] = await Promise.all([
        entradaService.getAll(),
        socioService.getAll(),
        siloService.getAll(),
      ])
      setEntradas(entradasRes.data as unknown as EntradaAlmacen[])
      setSocios(sociosRes.data as unknown as Socio[])
      setSilos(silosRes.data)
    } catch {
      toast({ title: "Error al cargar datos", type: "error" })
    } finally {
      setIsLoading(false)
    }
  }

  const onSubmit = async (data: CreateEntradaFormData) => {
    try {
      await entradaService.create(data)
      toast({ title: "Entrada registrada correctamente", type: "success" })
      setIsDialogOpen(false)
      reset()
      fetchData()
    } catch {
      toast({ title: "Error al guardar", type: "error" })
    }
  }

  const filteredEntradas = entradas.filter(
    (entrada) =>
      entrada.socio?.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entrada.silo?.nombre.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const isHumedadAlta = (humedad: number) => humedad > 14
  const isTemperaturaAlta = (temp: number) => temp > 30
  const isImpurezasAltas = (imp: number) => imp > 2

  return (
    <div className="min-h-screen">
      <Header title="Almacén / Entradas" description="Registro de recepción en almacén de acopio" />

      <div className="p-6 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar por socio o silo..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button onClick={() => { reset(); setIsDialogOpen(true) }}>
            <Plus className="h-4 w-4 mr-2" />
            Nueva Entrada
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Card className="border-l-4 border-l-primary">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <Scale className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Entradas</p>
                  <p className="text-2xl font-bold">{entradas.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-yellow-500">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-500/10">
                  <Droplets className="h-5 w-5 text-yellow-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Humedad Promedio</p>
                  <p className="text-2xl font-bold">
                    {entradas.length > 0
                      ? formatNumber(entradas.reduce((acc, e) => acc + e.humedad, 0) / entradas.length)
                      : 0}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-orange-500">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-500/10">
                  <Thermometer className="h-5 w-5 text-orange-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Temp. Promedio</p>
                  <p className="text-2xl font-bold">
                    {entradas.length > 0
                      ? formatNumber(entradas.reduce((acc, e) => acc + e.temperatura, 0) / entradas.length, 1)
                      : 0}°C
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-amber-600">
            <CardContent className="pt-6">
              <div>
                <p className="text-sm text-muted-foreground">Peso Total</p>
                <p className="text-2xl font-bold">
                  {formatNumber(entradas.reduce((acc, e) => acc + e.peso, 0))} kg
                </p>
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
                    <TableHead>Peso (kg)</TableHead>
                    <TableHead>Humedad %</TableHead>
                    <TableHead>Temperatura</TableHead>
                    <TableHead>Impurezas %</TableHead>
                    <TableHead>Silo</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEntradas.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        No hay entradas registradas
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredEntradas.map((entrada) => (
                      <TableRow key={entrada.id}>
                        <TableCell>{formatDate(entrada.createdAt)}</TableCell>
                        <TableCell className="font-medium">
                          {entrada.socio?.nombre || "-"}
                        </TableCell>
                        <TableCell className="font-mono">
                          {formatNumber(entrada.peso)}
                        </TableCell>
                        <TableCell>
                          <Badge variant={isHumedadAlta(entrada.humedad) ? "destructive" : "secondary"}>
                            {entrada.humedad}%
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={isTemperaturaAlta(entrada.temperatura) ? "destructive" : "secondary"}>
                            {entrada.temperatura}°C
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={isImpurezasAltas(entrada.impurezas) ? "destructive" : "secondary"}>
                            {entrada.impurezas}%
                          </Badge>
                        </TableCell>
                        <TableCell>{entrada.silo?.nombre || "-"}</TableCell>
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
            <DialogTitle>Registro de Entrada en Almacén</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Socio *</Label>
                <Select onValueChange={(v) => reset({ ...reset, socioId: v })}>
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
                <Label htmlFor="peso">Peso (kg) *</Label>
                <Input
                  id="peso"
                  type="number"
                  step="0.01"
                  placeholder="Ej: 5000"
                  {...register("peso", { valueAsNumber: true })}
                />
                {errors.peso && (
                  <p className="text-sm text-destructive">{errors.peso.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="humedad">Humedad (%) *</Label>
                <Input
                  id="humedad"
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  placeholder="0-100"
                  {...register("humedad", { valueAsNumber: true })}
                />
                {errors.humedad && (
                  <p className="text-sm text-destructive">{errors.humedad.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="pesoEspecifico">Peso Específico *</Label>
                <Input
                  id="pesoEspecifico"
                  type="number"
                  step="0.001"
                  placeholder="Ej: 1.2"
                  {...register("pesoEspecifico", { valueAsNumber: true })}
                />
                {errors.pesoEspecifico && (
                  <p className="text-sm text-destructive">{errors.pesoEspecifico.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="temperatura">Temperatura (°C) *</Label>
                <Input
                  id="temperatura"
                  type="number"
                  step="0.1"
                  min="-20"
                  max="60"
                  placeholder="-20 a 60"
                  {...register("temperatura", { valueAsNumber: true })}
                />
                {errors.temperatura && (
                  <p className="text-sm text-destructive">{errors.temperatura.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="impurezas">Impurezas (%) *</Label>
                <Input
                  id="impurezas"
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  placeholder="0-100"
                  {...register("impurezas", { valueAsNumber: true })}
                />
                {errors.impurezas && (
                  <p className="text-sm text-destructive">{errors.impurezas.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Silo</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar silo (opcional)" />
                  </SelectTrigger>
                  <SelectContent>
                    {silos.map((silo) => (
                      <SelectItem key={silo.id} value={silo.id}>
                        {silo.nombre} ({silo.stockActual.toFixed(0)} / {silo.capacidad} kg)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Guardando..." : "Registrar Entrada"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

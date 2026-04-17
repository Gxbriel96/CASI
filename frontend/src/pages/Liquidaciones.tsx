import { useEffect, useState } from "react"
import { Header } from "@/components/layout/Header"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
import { liquidacionService, socioService } from "@/services/api"
import { useToast } from "@/hooks/useToast"
import { formatDate, formatCurrency, formatNumber } from "@/lib/utils"
import { Calculator, DollarSign, TrendingUp, Users } from "lucide-react"
import type { Liquidacion, Socio } from "@/types"

export default function LiquidacionesPage() {
  const { toast } = useToast()
  const [liquidaciones, setLiquidaciones] = useState<Liquidacion[]>([])
  const [socios, setSocios] = useState<Socio[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [calculating, setCalculating] = useState(false)
  const [selectedSocioId, setSelectedSocioId] = useState("")
  const [calculationResult, setCalculationResult] = useState<{
    totalKilos: number
    importeBruto: number
    apoyoGobierno: number
    importeTotal: number
    precioBase: number
  } | null>(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [liqRes, sociosRes] = await Promise.all([
        liquidacionService.getAll(),
        socioService.getAll(),
      ])
      setLiquidaciones(liqRes.data as unknown as Liquidacion[])
      setSocios(sociosRes.data as unknown as Socio[])
    } catch {
      toast({ title: "Error al cargar datos", type: "error" })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCalcular = async () => {
    if (!selectedSocioId) {
      toast({ title: "Seleccione un socio", type: "warning" })
      return
    }
    setCalculating(true)
    try {
      const result = await liquidacionService.calcular(selectedSocioId)
      setCalculationResult(result.data as unknown as typeof calculationResult)
    } catch {
      toast({ title: "No hay entradas para liquidar", type: "error" })
      setCalculationResult(null)
    } finally {
      setCalculating(false)
    }
  }

  const handleCrearLiquidacion = async () => {
    if (!calculationResult || !selectedSocioId) return
    try {
      await liquidacionService.create({
        socioId: selectedSocioId,
        totalKilos: calculationResult.totalKilos,
        precioBase: calculationResult.precioBase,
      })
      toast({ title: "Liquidación creada", type: "success" })
      setIsDialogOpen(false)
      setCalculationResult(null)
      fetchData()
    } catch {
      toast({ title: "Error al crear liquidación", type: "error" })
    }
  }

  const totalLiquidado = liquidaciones.reduce((acc, l) => acc + l.importeTotal, 0)
  const totalApoyo = liquidaciones.reduce((acc, l) => acc + l.apoyoGobierno, 0)

  return (
    <div className="min-h-screen">
      <Header title="Liquidaciones" description="Pagos y apoyos gubernamentales a productores" />

      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <Button onClick={() => setIsDialogOpen(true)}>
            <Calculator className="h-4 w-4 mr-2" />
            Nueva Liquidación
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Card className="border-l-4 border-l-green-600">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-600/10">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Liquidado</p>
                  <p className="text-2xl font-bold">{formatCurrency(totalLiquidado)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-amber-500">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-500/10">
                  <TrendingUp className="h-6 w-6 text-amber-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Apoyo Gobierno</p>
                  <p className="text-2xl font-bold">{formatCurrency(totalApoyo)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-primary">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <Calculator className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">N° Liquidaciones</p>
                  <p className="text-2xl font-bold">{liquidaciones.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/10">
                  <Users className="h-6 w-6 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Socios</p>
                  <p className="text-2xl font-bold">{socios.length}</p>
                </div>
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
                    <TableHead>Kilos</TableHead>
                    <TableHead>Precio Base</TableHead>
                    <TableHead>Importe Bruto</TableHead>
                    <TableHead>Apoyo</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {liquidaciones.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        No hay liquidaciones registradas
                      </TableCell>
                    </TableRow>
                  ) : (
                    liquidaciones.map((liq) => (
                      <TableRow key={liq.id}>
                        <TableCell>{formatDate(liq.fechaLiquidacion)}</TableCell>
                        <TableCell className="font-medium">
                          {liq.socio?.nombre || "-"}
                        </TableCell>
                        <TableCell className="font-mono">
                          {formatNumber(liq.totalKilos)}
                        </TableCell>
                        <TableCell>{formatCurrency(liq.precioBase)}/kg</TableCell>
                        <TableCell>{formatCurrency(liq.importeBruto)}</TableCell>
                        <TableCell>
                          <Badge variant="success" className="font-mono">
                            +{formatCurrency(liq.apoyoGobierno)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right font-bold">
                          {formatCurrency(liq.importeTotal)}
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
            <DialogTitle>Calcular Liquidación</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Socio</Label>
              <Select value={selectedSocioId} onValueChange={setSelectedSocioId}>
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

            <Button onClick={handleCalcular} disabled={calculating} className="w-full">
              {calculating ? "Calculando..." : "Calcular"}
            </Button>

            {calculationResult && (
              <Card className="border-primary/50 bg-primary/5">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Resultado del Cálculo</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Kilos:</span>
                    <span className="font-mono">{formatNumber(calculationResult.totalKilos)} kg</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Precio Base:</span>
                    <span className="font-mono">{formatCurrency(calculationResult.precioBase)}/kg</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Importe Bruto:</span>
                    <span className="font-mono">{formatCurrency(calculationResult.importeBruto)}</span>
                  </div>
                  <div className="flex justify-between text-green-600">
                    <span>Apoyo Gobierno:</span>
                    <span className="font-mono">+{formatCurrency(calculationResult.apoyoGobierno)}</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between font-bold text-lg">
                    <span>Importe Total:</span>
                    <span className="text-primary">{formatCurrency(calculationResult.importeTotal)}</span>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cerrar
            </Button>
            {calculationResult && (
              <Button onClick={handleCrearLiquidacion}>
                Crear Liquidación
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

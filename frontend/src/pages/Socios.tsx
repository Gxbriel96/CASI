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
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { socioService } from "@/services/api"
import { useToast } from "@/hooks/useToast"
import { createSocioSchema, type CreateSocioFormData } from "@/schemas"
import { formatDate } from "@/lib/utils"
import { Plus, Search, Edit, Trash2, Phone, Mail } from "lucide-react"
import type { Socio } from "@/types"

export default function SociosPage() {
  const { toast } = useToast()
  const [socios, setSocios] = useState<Socio[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingSocio, setEditingSocio] = useState<Socio | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateSocioFormData>({
    resolver: zodResolver(createSocioSchema),
  })

  useEffect(() => {
    fetchSocios()
  }, [])

  const fetchSocios = async () => {
    try {
      const response = await socioService.getAll()
      setSocios(response.data as unknown as Socio[])
    } catch {
      toast({ title: "Error al cargar socios", type: "error" })
    } finally {
      setIsLoading(false)
    }
  }

  const onSubmit = async (data: CreateSocioFormData) => {
    try {
      if (editingSocio) {
        await socioService.update(editingSocio.id, data)
        toast({ title: "Socio actualizado", type: "success" })
      } else {
        await socioService.create(data)
        toast({ title: "Socio creado", type: "success" })
      }
      setIsDialogOpen(false)
      reset()
      setEditingSocio(null)
      fetchSocios()
    } catch {
      toast({ title: "Error al guardar", type: "error" })
    }
  }

  const handleEdit = (socio: Socio) => {
    setEditingSocio(socio)
    reset({
      nombre: socio.nombre,
      telefono: socio.telefono || "",
      email: socio.email || "",
      direccion: socio.direccion || "",
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar este socio?")) return
    try {
      await socioService.delete(id)
      toast({ title: "Socio eliminado", type: "success" })
      fetchSocios()
    } catch {
      toast({ title: "No se puede eliminar", type: "error" })
    }
  }

  const filteredSocios = socios.filter(
    (socio) =>
      socio.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      socio.numeroSocio.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen">
      <Header title="Socios / Productores" description="Gestión de miembros de la cooperativa" />

      <div className="p-6 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar por nombre o número..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button
            onClick={() => {
              setEditingSocio(null)
              reset()
              setIsDialogOpen(true)
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Socio
          </Button>
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
                    <TableHead>Número</TableHead>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Contacto</TableHead>
                    <TableHead>Parcelas</TableHead>
                    <TableHead>Fecha Alta</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSocios.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        No hay socios registrados
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredSocios.map((socio) => (
                      <TableRow key={socio.id}>
                        <TableCell>
                          <Badge variant="secondary">{socio.numeroSocio}</Badge>
                        </TableCell>
                        <TableCell className="font-medium">{socio.nombre}</TableCell>
                        <TableCell>
                          <div className="space-y-1 text-sm">
                            {socio.telefono && (
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <Phone className="h-3 w-3" />
                                {socio.telefono}
                              </div>
                            )}
                            {socio.email && (
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <Mail className="h-3 w-3" />
                                {socio.email}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {socio.parcelas?.length || 0} parcelas
                          </Badge>
                        </TableCell>
                        <TableCell>{formatDate(socio.createdAt)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEdit(socio)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDelete(socio.id)}
                              className="text-destructive hover:text-destructive"
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
              {editingSocio ? "Editar Socio" : "Nuevo Socio"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre completo *</Label>
              <Input id="nombre" {...register("nombre")} />
              {errors.nombre && (
                <p className="text-sm text-destructive">{errors.nombre.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="telefono">Teléfono</Label>
                <Input id="telefono" {...register("telefono")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" {...register("email")} />
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="direccion">Dirección</Label>
              <Input id="direccion" {...register("direccion")} />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
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

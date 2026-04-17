import { Link, useLocation } from "react-router-dom"
import {
  LayoutDashboard,
  Users,
  Wheat,
  Warehouse,
  ClipboardCheck,
  FileText,
  BarChart3,
  LogOut,
  Menu,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/useAuth"
import { useState } from "react"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Socios", href: "/socios", icon: Users },
  { name: "Parcelas", href: "/parcelas", icon: Wheat },
  { name: "Cosechas", href: "/cosechas", icon: Wheat },
  { name: "Almacén", href: "/entradas", icon: Warehouse },
  { name: "Control Calidad", href: "/control-calidad", icon: ClipboardCheck },
  { name: "Liquidaciones", href: "/liquidaciones", icon: FileText },
  { name: "Reportes", href: "/reportes", icon: BarChart3 },
]

export function Sidebar() {
  const location = useLocation()
  const { logout, user } = useAuth()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 lg:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-card border-r transition-transform duration-300 lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-16 items-center justify-between px-6 border-b">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Wheat className="h-5 w-5" />
            </div>
            <div>
              <h1 className="font-semibold text-lg">CASI</h1>
              <p className="text-xs text-muted-foreground">Cooperativa Agrícola</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href
            return (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Link>
            )
          })}
        </nav>

        <div className="border-t p-4">
          <div className="mb-3 px-3">
            <p className="text-sm font-medium">{user?.nombre || "Usuario"}</p>
            <p className="text-xs text-muted-foreground">{user?.email}</p>
          </div>
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive"
            onClick={logout}
          >
            <LogOut className="h-5 w-5" />
            Cerrar sesión
          </Button>
        </div>
      </aside>

      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}

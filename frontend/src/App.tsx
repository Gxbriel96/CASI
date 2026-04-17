import { Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider, useAuth } from "@/hooks/useAuth"
import { QueryProvider } from "@/components/providers/QueryProvider"
import { MainLayout } from "@/components/layout/MainLayout"
import { Toaster } from "@/components/ui/toaster"
import LoginPage from "@/pages/Login"
import DashboardPage from "@/pages/Dashboard"
import SociosPage from "@/pages/Socios"
import ParcelasPage from "@/pages/Parcelas"
import CosechasPage from "@/pages/Cosechas"
import EntradasPage from "@/pages/Entradas"
import ControlCalidadPage from "@/pages/ControlCalidad"
import LiquidacionesPage from "@/pages/Liquidaciones"
import ReportesPage from "@/pages/Reportes"

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-primary/20" />
          <p className="text-muted-foreground">Cargando...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}

function AppRoutes() {
  const { isAuthenticated } = useAuth()

  return (
    <>
      <Toaster />
      <Routes>
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />}
        />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="socios" element={<SociosPage />} />
          <Route path="parcelas" element={<ParcelasPage />} />
          <Route path="cosechas" element={<CosechasPage />} />
          <Route path="entradas" element={<EntradasPage />} />
          <Route path="control-calidad" element={<ControlCalidadPage />} />
          <Route path="liquidaciones" element={<LiquidacionesPage />} />
          <Route path="reportes" element={<ReportesPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </>
  )
}

export default function App() {
  return (
    <QueryProvider>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </QueryProvider>
  )
}

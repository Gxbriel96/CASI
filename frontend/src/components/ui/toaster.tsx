import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from "lucide-react"
import { useToast } from "@/hooks/useToast"

const icons = {
  default: Info,
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
}

const styles = {
  default: "border-border bg-background text-foreground",
  success: "border-green-500/50 bg-green-50 text-green-900 dark:bg-green-950/50 dark:text-green-100",
  error: "border-red-500/50 bg-red-50 text-red-900 dark:bg-red-950/50 dark:text-red-100",
  warning: "border-amber-500/50 bg-amber-50 text-amber-900 dark:bg-amber-950/50 dark:text-amber-100",
}

const iconStyles = {
  default: "text-foreground",
  success: "text-green-600",
  error: "text-red-600",
  warning: "text-amber-600",
}

export function Toaster() {
  const { toasts, dismiss } = useToast()

  return (
    <div className="fixed bottom-0 right-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-4 sm:right-4 sm:top-auto sm:flex-col md:max-w-[420px]">
      {toasts.map((toast) => {
        const Icon = icons[toast.type]
        return (
          <div
            key={toast.id}
            className={`group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-lg border p-4 shadow-lg transition-all animate-slide-in-right ${styles[toast.type]}`}
          >
            <div className="flex items-start gap-3">
              <Icon className={`h-5 w-5 mt-0.5 ${iconStyles[toast.type]}`} />
              <div className="grid gap-1">
                <p className="text-sm font-semibold">{toast.title}</p>
                {toast.description && (
                  <p className="text-sm opacity-90">{toast.description}</p>
                )}
              </div>
            </div>
            <button
              onClick={() => dismiss(toast.id)}
              className="absolute right-2 top-2 rounded-md p-1 opacity-0 transition-opacity group-hover:opacity-100 focus:opacity-100"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )
      })}
    </div>
  )
}

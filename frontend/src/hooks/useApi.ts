import { useState, useCallback } from "react"

interface UseApiState<T> {
  data: T | null
  isLoading: boolean
  error: string | null
}

export function useApi<T>() {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    isLoading: false,
    error: null,
  })

  const execute = useCallback(async (fn: () => Promise<T>) => {
    setState({ data: null, isLoading: true, error: null })
    try {
      const result = await fn()
      setState({ data: result, isLoading: false, error: null })
      return result
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error desconocido"
      setState({ data: null, isLoading: false, error: message })
      throw err
    }
  }, [])

  const reset = useCallback(() => {
    setState({ data: null, isLoading: false, error: null })
  }, [])

  return { ...state, execute, reset }
}

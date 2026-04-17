export function calcularApoyoGobierno(importeBruto: number, porcentajeApoyo: number): number {
  return parseFloat((importeBruto * (porcentajeApoyo / 100)).toFixed(2))
}

export function calcularRendimientoPorHectarea(
  totalKilos: number,
  hectareas: number
): number {
  if (hectareas <= 0) return 0
  return parseFloat((totalKilos / hectareas).toFixed(2))
}

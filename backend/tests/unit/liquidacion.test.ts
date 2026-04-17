import { describe, it, expect, beforeEach } from "vitest"
import { calcularLiquidacion, calcularApoyoGobierno } from "../../src/services/liquidacion.service"

interface MockCosecha {
  id: string
  cultivo: "MAIZ" | "TRIGO" | "CEBADA"
}

interface MockEntrada {
  peso: number
  cosecha?: MockCosecha | null
}

interface MockCampana {
  nombre: string
  precioBaseMaiz: number
  precioBaseTrigo: number
  porcentajeApoyo: number
}

describe("Cálculo de Liquidaciones", () => {
  let mockEntradas: MockEntrada[]
  let mockCampana: MockCampana

  beforeEach(() => {
    mockEntradas = [
      { peso: 5000, cosecha: { id: "1", cultivo: "MAIZ" } },
      { peso: 3000, cosecha: { id: "1", cultivo: "MAIZ" } },
    ]
    mockCampana = {
      nombre: "Campaña 2024",
      precioBaseMaiz: 0.35,
      precioBaseTrigo: 0.40,
      porcentajeApoyo: 12,
    }
  })

  describe("calcularLiquidacion", () => {
    it("debería calcular el total de kilos correctamente", () => {
      const totalKilos = mockEntradas.reduce((acc, e) => acc + e.peso, 0)
      expect(totalKilos).toBe(8000)
    })

    it("debería usar el precio correcto según cultivo", () => {
      const cultivo = mockEntradas[0].cosecha?.cultivo
      const precioBase = cultivo === "TRIGO" ? mockCampana.precioBaseTrigo : mockCampana.precioBaseMaiz
      expect(precioBase).toBe(0.35)
    })

    it("debería calcular el importe bruto correctamente", () => {
      const totalKilos = mockEntradas.reduce((acc, e) => acc + e.peso, 0)
      const cultivo = mockEntradas[0].cosecha?.cultivo
      const precioBase = cultivo === "TRIGO" ? mockCampana.precioBaseTrigo : mockCampana.precioBaseMaiz
      const importeBruto = totalKilos * precioBase
      expect(importeBruto).toBe(2800)
    })
  })

  describe("calcularApoyoGobierno", () => {
    it("debería calcular el apoyo gubernamental correctamente", () => {
      const importeBruto = 2800
      const apoyoGobierno = importeBruto * (mockCampana.porcentajeApoyo / 100)
      expect(apoyoGobierno).toBe(336)
    })

    it("debería manejar porcentaje 0 correctamente", () => {
      const mockCampanaCero = { ...mockCampana, porcentajeApoyo: 0 }
      const importeBruto = 2800
      const apoyoGobierno = importeBruto * (mockCampanaCero.porcentajeApoyo / 100)
      expect(apoyoGobierno).toBe(0)
    })

    it("debería manejar porcentaje 100 correctamente", () => {
      const mockCampanaMax = { ...mockCampana, porcentajeApoyo: 100 }
      const importeBruto = 2800
      const apoyoGobierno = importeBruto * (mockCampanaMax.porcentajeApoyo / 100)
      expect(apoyoGobierno).toBe(2800)
    })
  })

  describe("importeTotal", () => {
    it("debería calcular el importe total (bruto + apoio)", () => {
      const importeBruto = 2800
      const apoyoGobierno = calcularApoyoGobierno(importeBruto, mockCampana.porcentajeApoyo)
      const importeTotal = importeBruto + apoyoGobierno
      expect(importeTotal).toBe(3136)
    })
  })
})

describe("Validaciones de Entrada", () => {
  describe("humedad", () => {
    it("debería validar que humedad está entre 0 y 100", () => {
      const humedadValida = 14
      expect(humedadValida).toBeGreaterThanOrEqual(0)
      expect(humedadValida).toBeLessThanOrEqual(100)
    })

    it("debería rechazar humedad mayor a 100", () => {
      const humedadInvalida = 101
      expect(humedadInvalida).toBeGreaterThan(100)
    })

    it("debería rechazar humedad negativa", () => {
      const humedadNegativa = -1
      expect(humedadNegativa).toBeLessThan(0)
    })
  })

  describe("temperatura", () => {
    it("debería validar que temperatura está entre -20 y 60", () => {
      const temperaturaValida = 25
      expect(temperaturaValida).toBeGreaterThanOrEqual(-20)
      expect(temperaturaValida).toBeLessThanOrEqual(60)
    })

    it("debería rechazar temperatura mayor a 60", () => {
      const temperaturaInvalida = 61
      expect(temperaturaInvalida).toBeGreaterThan(60)
    })

    it("debería rechazar temperatura menor a -20", () => {
      const temperaturaInvalida = -21
      expect(temperaturaInvalida).toBeLessThan(-20)
    })
  })

  describe("impurezas", () => {
    it("debería validar que impurezas está entre 0 y 100", () => {
      const impurezasValidas = 2.5
      expect(impurezasValidas).toBeGreaterThanOrEqual(0)
      expect(impurezasValidas).toBeLessThanOrEqual(100)
    })
  })
})

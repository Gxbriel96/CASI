import { describe, it, expect } from "vitest";

interface LiquidacionInput {
  totalKilos: number;
  precioBase: number;
  porcentajeApoyo: number;
}

function calcularLiquidacion(input: LiquidacionInput) {
  const { totalKilos, precioBase, porcentajeApoyo } = input;
  const importeBruto = totalKilos * precioBase;
  const apoyoGobierno = importeBruto * (porcentajeApoyo / 100);
  const importeTotal = importeBruto + apoyoGobierno;

  return {
    importeBruto: Math.round(importeBruto * 100) / 100,
    apoyoGobierno: Math.round(apoyoGobierno * 100) / 100,
    importeTotal: Math.round(importeTotal * 100) / 100,
  };
}

describe("Cálculo de Liquidaciones", () => {
  it("debería calcular importe bruto correctamente", () => {
    const result = calcularLiquidacion({
      totalKilos: 1000,
      precioBase: 0.30,
      porcentajeApoyo: 5,
    });

    expect(result.importeBruto).toBe(300);
  });

  it("debería calcular apoyo gubernamental correctamente", () => {
    const result = calcularLiquidacion({
      totalKilos: 1000,
      precioBase: 0.30,
      porcentajeApoyo: 5,
    });

    expect(result.apoyoGobierno).toBe(15);
  });

  it("debería calcular importe total correctamente", () => {
    const result = calcularLiquidacion({
      totalKilos: 1000,
      precioBase: 0.30,
      porcentajeApoyo: 5,
    });

    expect(result.importeTotal).toBe(315);
  });

  it("debería calcular correctamente con trigo", () => {
    const result = calcularLiquidacion({
      totalKilos: 5000,
      precioBase: 0.25,
      porcentajeApoyo: 10,
    });

    expect(result.importeBruto).toBe(1250);
    expect(result.apoyoGobierno).toBe(125);
    expect(result.importeTotal).toBe(1375);
  });

  it("debería manejar porcentaje de apoyo cero", () => {
    const result = calcularLiquidacion({
      totalKilos: 1000,
      precioBase: 0.30,
      porcentajeApoyo: 0,
    });

    expect(result.importeBruto).toBe(300);
    expect(result.apoyoGobierno).toBe(0);
    expect(result.importeTotal).toBe(300);
  });

  it("debería manejar números decimales correctamente", () => {
    const result = calcularLiquidacion({
      totalKilos: 1234.56,
      precioBase: 0.295,
      porcentajeApoyo: 7.5,
    });

    expect(result.importeBruto).toBe(364.19);
    expect(result.apoyoGobierno).toBe(27.31);
    expect(result.importeTotal).toBe(391.5);
  });

  it("debería manejar precio base cero", () => {
    const result = calcularLiquidacion({
      totalKilos: 1000,
      precioBase: 0,
      porcentajeApoyo: 5,
    });

    expect(result.importeBruto).toBe(0);
    expect(result.apoyoGobierno).toBe(0);
    expect(result.importeTotal).toBe(0);
  });

  it("debería manejar kilos cero", () => {
    const result = calcularLiquidacion({
      totalKilos: 0,
      precioBase: 0.30,
      porcentajeApoyo: 5,
    });

    expect(result.importeBruto).toBe(0);
    expect(result.apoyoGobierno).toBe(0);
    expect(result.importeTotal).toBe(0);
  });
});
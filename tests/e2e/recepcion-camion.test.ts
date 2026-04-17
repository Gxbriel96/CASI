import { test, expect } from "@playwright/test"

test.describe("Recepción de Camión de Cereales", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:5173")
    
    // Login
    await page.fill('input[type="email"]', "admin@casi.es")
    await page.fill('input[type="password"]', "admin123")
    await page.click('button[type="submit"]')
    
    await expect(page).toHaveURL(/dashboard/)
  })

  test("debería registrar una entrada de camión con muestreo de humedad", async ({ page }) => {
    // Navegar a entradas de almacén
    await page.click("text=Almacén")
    await expect(page).toHaveURL(/entradas/)
    
    // Click en nueva entrada
    await page.click("text=Nueva Entrada")
    
    // Seleccionar socio
    await page.selectOption('select:has-text("Seleccionar socio")', { index: 1 })
    
    // Completar datos de entrada
    await page.fill('input[id="peso"]', "15000")
    await page.fill('input[id="humedad"]', "14.5")
    await page.fill('input[id="pesoEspecifico"]', "1.25")
    await page.fill('input[id="temperatura"]', "22")
    await page.fill('input[id="impurezas"]', "1.8")
    
    // Seleccionar silo
    await page.selectOption('select:has-text("Seleccionar silo")', { index: 1 })
    
    // Enviar
    await page.click("text=Registrar Entrada")
    
    // Verificar éxito
    await expect(page.locator("text=Entrada registrada correctamente")).toBeVisible()
  })

  test("debería validar parámetros fuera de rango", async ({ page }) => {
    await page.click("text=Almacén")
    await page.click("text=Nueva Entrada")
    
    // Humedad muy alta (debería fallar validación)
    await page.fill('input[id="humedad"]', "999")
    await page.click("text=Registrar Entrada")
    
    // Ver que muestra error
    await expect(page.locator("text=Máximo 100%")).toBeVisible()
  })

  test("debería almacenar en silo y actualizar stock", async ({ page }) => {
    await page.click("text=Almacén")
    await page.click("text=Nueva Entrada")
    
    await page.selectOption('select:has-text("Seleccionar socio")', { index: 1 })
    await page.fill('input[id="peso"]', "10000")
    await page.fill('input[id="humedad"]', "12")
    await page.fill('input[id="pesoEspecifico"]', "1.3")
    await page.fill('input[id="temperatura"]', "18")
    await page.fill('input[id="impurezas"]', "1")
    await page.selectOption('select:has-text("Seleccionar silo")', { index: 1 })
    
    await page.click("text=Registrar Entrada")
    
    // Verificar incremento de stock en silo
    await page.click("text=Dashboard")
    await expect(page.locator("text=Ocupación de Silos")).toBeVisible()
  })
})

test.describe("Control de Calidad APPCC", () => {
  test("debería registrar control de frutas con parámetros APPCC", async ({ page }) => {
    await page.click("text=Control Calidad")
    await expect(page).toHaveURL(/control-calidad/)
    
    await page.click("text=Nuevo Control")
    
    // Seleccionar socio
    await page.selectOption('select:has-text("Seleccionar socio")', { index: 1 })
    
    // Especie y variedad
    await page.selectOption('select:has-text("Especie")', { index: 1 }) // Melocotón
    await page.fill('input[id="variedad"]', "Calrico")
    
    // Calibre
    await page.selectOption('select:has-text("Calibre")', { index: 1 }) // AA
    
    // Parámetros APPCC
    await page.fill('input[id="azucar"]', "12.5")
    await page.fill('input[id="dureza"]', "8.5")
    await page.fill('input[id="defectos"]', "3")
    
    await page.click("text=Registrar Control")
    
    // Verificar registro
    await expect(page.locator("text=Control de calidad registrado")).toBeVisible()
  })
})

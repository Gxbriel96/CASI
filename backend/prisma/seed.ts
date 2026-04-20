import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting seed...");

  // ==================== USUARIOS ====================
  const hashedPassword = await bcrypt.hash("admin123", 10);
  
  const adminUser = await prisma.usuario.upsert({
    where: { email: "admin@casi.es" },
    update: {},
    create: {
      email: "admin@casi.es",
      password: hashedPassword,
      rol: "ADMIN",
    },
  });
  console.log("✅ Admin user created:", adminUser.email);

  // ==================== SILOS ====================
  const silos = await Promise.all([
    prisma.silo.upsert({ where: { nombre: "Silo Norte" }, update: {}, create: { nombre: "Silo Norte", capacidad: 50000, cultivo: "MAIZ" } }),
    prisma.silo.upsert({ where: { nombre: "Silo Sur" }, update: {}, create: { nombre: "Silo Sur", capacidad: 40000, cultivo: "TRIGO" } }),
    prisma.silo.upsert({ where: { nombre: "Silo Central" }, update: {}, create: { nombre: "Silo Central", capacidad: 30000, cultivo: "CEBADA" } }),
    prisma.silo.upsert({ where: { nombre: "Silo Este" }, update: {}, create: { nombre: "Silo Este", capacidad: 25000, cultivo: "MAIZ" } }),
    prisma.silo.upsert({ where: { nombre: "Silo Oeste" }, update: {}, create: { nombre: "Silo Oeste", capacidad: 20000 } }),
  ]);
  console.log("✅ Silos created:", silos.length);

  // ==================== CAMPAÑA ====================
  const campana = await prisma.campana.upsert({
    where: { nombre: "Campaña 2024" },
    update: {},
    create: {
      nombre: "Campaña 2024",
      precioBaseMaiz: 0.35,
      precioBaseTrigo: 0.40,
      // precioBaseCebada removido - no existe en schema
      porcentajeApoyo: 12,
      fechaInicio: new Date("2024-01-01"),
      fechaFin: new Date("2024-12-31"),
      activa: true,
    },
  });
  console.log("✅ Campaña created:", campana.nombre);

  // ==================== SOCIOS ====================
  const sociosData = [
    { numero: "0001", nombre: "Juan García López", telefono: "612345678", email: "juan@email.es", direccion: "Calle Mayor 10" },
    { numero: "0002", nombre: "María Martínez Ruiz", telefono: "612345679", email: "maria@email.es", direccion: "Avenida Principal 25" },
    { numero: "0003", nombre: "Pedro Sánchez Torres", telefono: "612345680", email: "pedro@email.es", direccion: "Plaza del Pueblo 5" },
    { numero: "0004", nombre: "Ana López García", telefono: "612345681", email: "ana@email.es", direccion: "Calle Nueva 15" },
    { numero: "0005", nombre: "Luis Fernández", telefono: "612345682", email: "luis@email.es", direccion: "Carretera Norte 30" },
  ];

  const socios = await Promise.all(
    sociosData.map(s => 
      prisma.socio.upsert({
        where: { numeroSocio: s.numero },
        update: {},
        create: { numeroSocio: s.numero, nombre: s.nombre, telefono: s.telefono, email: s.email, direccion: s.direccion }
      })
    )
  );
  console.log("✅ Socios created:", socios.length);

  // ==================== PARCELAS ====================
  const parcelasData = [
    { socio: "0001", nombre: "Parcela Norte", hectareas: 10.5, ubicacion: "Polígono 1, Parcela 12", coordenadas: "38.5, -1.2" },
    { socio: "0001", nombre: "Parcela Este", hectareas: 8.0, ubicacion: "Polígono 1, Parcela 15", coordenadas: "38.5, -1.15" },
    { socio: "0002", nombre: "Huerta Grande", hectareas: 15.0, ubicacion: "Polígono 3, Parcela 8", coordenadas: "38.6, -1.25" },
    { socio: "0002", nombre: "Campo Bajo", hectareas: 12.5, ubicacion: "Polígono 3, Parcela 10", coordenadas: "38.6, -1.2" },
    { socio: "0003", nombre: "Tierras Altas", hectareas: 20.0, ubicacion: "Polígono 5, Parcela 1", coordenadas: "38.7, -1.3" },
    { socio: "0003", nombre: "Loma Alta", hectareas: 18.5, ubicacion: "Polígono 5, Parcela 3", coordenadas: "38.7, -1.28" },
    { socio: "0004", nombre: "Valle Medio", hectareas: 9.0, ubicacion: "Polígono 2, Parcela 20", coordenadas: "38.55, -1.22" },
    { socio: "0005", nombre: "Eras del Pueblo", hectareas: 6.5, ubicacion: "Polígono 4, Parcela 5", coordenadas: "38.58, -1.18" },
  ];

  const parcelas = await Promise.all(
    parcelasData.map(async (p) => {
      const socio = await prisma.socio.findUnique({ where: { numeroSocio: p.socio } });
      if (!socio) return null;
      return prisma.parcela.create({
        data: { socioId: socio.id, nombre: p.nombre, hectareas: p.hectareas, ubicacion: p.ubicacion, coordenadas: p.coordenadas }
      });
    })
  );
  console.log("✅ Parcelas created:", parcelas.filter(Boolean).length);

  // ==================== COSECHAS ====================
  const allParcelas = await prisma.parcela.findMany();
  
  const cosechasData = [
    { parcela: 0, cultivo: "MAIZ", rendimiento: 12000, fechaSiembra: "2024-03-15", fechaCosecha: "2024-10-20" },
    { parcela: 0, cultivo: "TRIGO", rendimiento: 5500, fechaSiembra: "2023-11-10", fechaCosecha: "2024-06-15" },
    { parcela: 1, cultivo: "MAIZ", rendimiento: 10500, fechaSiembra: "2024-03-20", fechaCosecha: "2024-10-25" },
    { parcela: 2, cultivo: "MAIZ", rendimiento: 14000, fechaSiembra: "2024-03-10", fechaCosecha: "2024-10-15" },
    { parcela: 3, cultivo: "CEBADA", rendimiento: 4800, fechaSiembra: "2023-11-20", fechaCosecha: "2024-06-20" },
    { parcela: 4, cultivo: "TRIGO", rendimiento: 6500, fechaSiembra: "2023-11-15", fechaCosecha: "2024-06-25" },
    { parcela: 5, cultivo: "MAIZ", rendimiento: 11800, fechaSiembra: "2024-03-25", fechaCosecha: "2024-10-30" },
    { parcela: 6, cultivo: "TRIGO", rendimiento: 5200, fechaSiembra: "2023-11-05", fechaCosecha: "2024-06-10" },
    { parcela: 7, cultivo: "CEBADA", rendimiento: 4200, fechaSiembra: "2023-11-25", fechaCosecha: "2024-06-18" },
  ];

  const cosechas = await Promise.all(
    cosechasData.map(c => {
      if (!allParcelas[c.parcela]) return null;
      return prisma.cosecha.create({
        data: {
          parcelaId: allParcelas[c.parcela].id,
          cultivo: c.cultivo as "MAIZ" | "TRIGO" | "CEBADA",
          rendimiento: c.rendimiento,
          fechaSiembra: new Date(c.fechaSiembra),
          fechaCosecha: new Date(c.fechaCosecha),
        }
      });
    })
  );
  console.log("✅ Cosechas created:", cosechas.filter(Boolean).length);

  // ==================== ENTRADAS ====================
  const allCosechas = await prisma.cosecha.findMany();
  const allSilos = await prisma.silo.findMany();

  const entradasData = [
    { socio: "0001", cosecha: 0, silo: 0, peso: 5200, humedad: 13.5, pesoEspecifico: 1.25, temperatura: 18, impurezas: 1.2 },
    { socio: "0001", cosecha: 1, silo: 1, peso: 3800, humedad: 12.8, pesoEspecifico: 1.28, temperatura: 20, impurezas: 0.8 },
    { socio: "0001", cosecha: 2, silo: 3, peso: 4500, humedad: 14.0, pesoEspecifico: 1.22, temperatura: 19, impurezas: 1.5 },
    { socio: "0002", cosecha: 3, silo: 0, peso: 6800, humedad: 13.2, pesoEspecifico: 1.26, temperatura: 17, impurezas: 1.0 },
    { socio: "0002", cosecha: 4, silo: 2, peso: 2900, humedad: 12.5, pesoEspecifico: 1.30, temperatura: 21, impurezas: 0.6 },
    { socio: "0003", cosecha: 5, silo: 1, peso: 8200, humedad: 13.8, pesoEspecifico: 1.24, temperatura: 18, impurezas: 1.3 },
    { socio: "0003", cosecha: 6, silo: 3, peso: 5500, humedad: 14.2, pesoEspecifico: 1.21, temperatura: 20, impurezas: 1.8 },
    { socio: "0004", cosecha: 7, silo: 1, peso: 3200, humedad: 12.2, pesoEspecifico: 1.29, temperatura: 19, impurezas: 0.5 },
    { socio: "0005", cosecha: 8, silo: 2, peso: 1800, humedad: 13.0, pesoEspecifico: 1.27, temperatura: 18, impurezas: 0.9 },
  ];

  const allSocios = await prisma.socio.findMany();

  const entradas = await Promise.all(
    entradasData.map(async (e) => {
      const socio = allSocios.find(s => s.numeroSocio === e.socio);
      const silo = allSilos[e.silo];
      const user = await prisma.usuario.findFirst();
      if (!socio || !user) return null;
      
      const entrada = await prisma.entradaAlmacen.create({
        data: {
          socioId: socio.id,
          siloId: silo?.id,
          peso: e.peso,
          humedad: e.humedad,
          pesoEspecifico: e.pesoEspecifico,
          temperatura: e.temperatura,
          impurezas: e.impurezas,
          usuarioId: user.id,
        }
      });

      // Crear control de calidad
      await prisma.controlCalidad.create({
        data: {
          entradaAlmacenId: entrada.id,
          humedad: e.humedad,
          pesoEspecifico: e.pesoEspecifico,
          temperatura: e.temperatura,
          impurezas: e.impurezas,
          resultado: e.humedad > 14 ? "RECHAZADO" : "APROBADO",
        }
      });

      return entrada;
    })
  );
  console.log("✅ Entradas created:", entradas.filter(Boolean).length);
  console.log("✅ Controles de calidad created:", entradas.filter(Boolean).length);

  // ==================== CONTROL FRUTAS ====================
  const controlFrutasData = [
    { socio: "0001", especie: "MELOCOTON", variedad: "Calrico", calibre: "AA", azucar: 12.5, dureza: 8.5, defectos: 2 },
    { socio: "0001", especie: "NECTARINA", variedad: "Big Top", calibre: "A", azucar: 11.2, dureza: 9.0, defectos: 3 },
    { socio: "0002", especie: "ALBARICOQUE", variedad: "Monaco", calibre: "AA", azucar: 14.0, dureza: 7.2, defectos: 1 },
    { socio: "0002", especie: "CIRUELA", variedad: "Black Diamond", calibre: "A", azucar: 13.5, dureza: 8.0, defectos: 2 },
    { socio: "0003", especie: "MELOCOTON", variedad: "Spring Crest", calibre: "B", azucar: 10.8, dureza: 9.5, defectos: 4 },
    { socio: "0003", especie: "NECTARINA", variedad: "Fire Brite", calibre: "AA", azucar: 12.0, dureza: 8.2, defectos: 2 },
    { socio: "0004", especie: "CIRUELA", variedad: "Angeleno", calibre: "A", azucar: 14.5, dureza: 7.5, defectos: 1 },
    { socio: "0005", especie: "ALBARICOQUE", variedad: "Peach", calibre: "C", azucar: 11.0, dureza: 8.8, defectos: 5 },
  ];

  const frutas = await Promise.all(
    controlFrutasData.map(async (f) => {
      const socio = allSocios.find(s => s.numeroSocio === f.socio);
      const user = await prisma.usuario.findFirst();
      if (!socio || !user) return null;
      return prisma.frutaControl.create({
        data: {
          socioId: socio.id,
          especie: f.especie as "MELOCOTON" | "NECTARINA" | "ALBARICOQUE" | "CIRUELA",
          variedad: f.variedad,
          calibre: f.calibre as "AA" | "A" | "B" | "C",
          azucar: f.azucar,
          dureza: f.dureza,
          defectos: f.defectos,
          usuarioId: user.id,
        }
      });
    })
  );
  console.log("✅ Controles de frutas created:", frutas.filter(Boolean).length);

  // ==================== LIQUIDACIONES ====================
  const liquidacionesData = [
    { socio: "0001", kilos: 8520, precio: 0.35 },
    { socio: "0002", kilos: 9700, precio: 0.35 },
    { socio: "0003", kilos: 13700, precio: 0.40 },
    { socio: "0004", kilos: 3200, precio: 0.35 },
  ];

  const liquidaciones = await Promise.all(
    liquidacionesData.map(async (l) => {
      const socio = allSocios.find(s => s.numeroSocio === l.socio);
      if (!socio) return null;
      const importeBruto = l.kilos * l.precio;
      const apoyoGobierno = importeBruto * 0.12;
      
      return prisma.liquidacion.create({
        data: {
          socioId: socio.id,
          totalKilos: l.kilos,
          precioBase: l.precio,
          importeBruto,
          apoyoGobierno,
          importeTotal: importeBruto + apoyoGobierno,
        }
      });
    })
  );
  console.log("✅ Liquidaciones created:", liquidaciones.filter(Boolean).length);

  console.log("\n🎉 Seed completed!");
  console.log("\n📋 Datos de prueba:");
  console.log("  - Admin: admin@casi.es / admin123");
  console.log("  - 5 Socios registrados");
  console.log("  - 8 Parcelas");
  console.log("  - 9 Cosechas");
  console.log("  - 9 Entradas con control de calidad");
  console.log("  - 8 Controles de frutas");
  console.log("  - 4 Liquidaciones");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
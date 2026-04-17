import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting seed...");

  // Crear usuario administrador
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

  // Crear algunos silos de ejemplo
  const silos = await Promise.all([
    prisma.silo.upsert({
      where: { nombre: "Silo Norte" },
      update: {},
      create: { nombre: "Silo Norte", capacidad: 50000, cultivo: "MAIZ" },
    }),
    prisma.silo.upsert({
      where: { nombre: "Silo Sur" },
      update: {},
      create: { nombre: "Silo Sur", capacidad: 40000, cultivo: "TRIGO" },
    }),
    prisma.silo.upsert({
      where: { nombre: "Silo Central" },
      update: {},
      create: { nombre: "Silo Central", capacidad: 30000, cultivo: "CEBADA" },
    }),
  ]);
  console.log("✅ Silos created:", silos.length);

  // Crear campaña activa
  const campana = await prisma.campana.upsert({
    where: { nombre: "Campaña 2024" },
    update: {},
    create: {
      nombre: "Campaña 2024",
      precioBaseMaiz: 0.35,
      precioBaseTrigo: 0.40,
      porcentajeApoyo: 12,
      fechaInicio: new Date("2024-01-01"),
      fechaFin: new Date("2024-12-31"),
      activa: true,
    },
  });
  console.log("✅ Campaña created:", campana.nombre);

  console.log("🎉 Seed completed!");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
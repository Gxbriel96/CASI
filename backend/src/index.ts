import dotenv from "dotenv";
import app from "./app";
import prisma from "./config/database";
import bcrypt from "bcrypt";

dotenv.config();

const PORT = process.env.PORT || 3000;

async function seed() {
  try {
    const hashedPassword = await bcrypt.hash("admin123", 10);
    
    await prisma.usuario.upsert({
      where: { email: "admin@casi.es" },
      update: {},
      create: {
        email: "admin@casi.es",
        password: hashedPassword,
        rol: "ADMIN",
        nombre: "Administrador",
      },
    });
    console.log("✅ Usuario admin creado: admin@casi.es / admin123");
  } catch (error) {
    console.log("ℹ️ Usuario admin ya existe o error en seed");
  }
}

if (process.env.NODE_ENV !== "production") {
  seed().finally(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Servidor CASI corriendo en http://localhost:${PORT}`);
      console.log(`📋 Health check: http://localhost:${PORT}/api/health`);
      console.log(`🔑 Login: admin@casi.es / admin123`);
    });
  });
} else {
  app.listen(PORT, () => {
    console.log(`🚀 Servidor CASI corriendo en http://localhost:${PORT}`);
  });
}
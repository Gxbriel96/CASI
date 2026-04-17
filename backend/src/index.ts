import dotenv from "dotenv";
import app from "./app";

dotenv.config();

// Para desarrollo local
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`🚀 Servidor CASI corriendo en http://localhost:${PORT}`);
    console.log(`📋 Health check: http://localhost:${PORT}/api/health`);
  });
}

// Exportar para Vercel serverless
export default app;
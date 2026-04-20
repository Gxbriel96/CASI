import express, { Request, Response, NextFunction } from "express";
import helmet from "helmet";
import cors from "cors";
import compression from "compression";
import routes from "./routes";
import { errorHandler } from "./middleware/error-handler";

const app = express();

app.use(helmet());

// Configuración CORS
const allowedOrigins = process.env.NODE_ENV === "production"
  ? [
      process.env.FRONTEND_URL,
      "https://casi-frontend.vercel.app",
      "https://casi-nevf.vercel.app",
      "https://casi-nevf.vercel.app/",
    ].filter(Boolean)
  : ["http://localhost:5173", "http://localhost:3000"];

console.log("🔒 CORS allowed origins:", allowedOrigins);

app.use(cors({
  origin: function (origin, callback) {
    // Permitir requests sin origin (Postman, curl, mobile apps)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1 || allowedOrigins.includes("*")) {
      callback(null, true);
    } else {
      console.log("❌ CORS blocked origin:", origin);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
}));
app.use(compression());

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.use("/api", routes);

app.use((req: Request, res: Response) => {
  res.status(404).json({ status: "error", message: "Route not found" });
});

app.use(errorHandler);

export default app;
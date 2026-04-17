import express, { Request, Response, NextFunction } from "express";
import helmet from "helmet";
import cors from "cors";
import compression from "compression";
import routes from "./routes";
import { errorHandler } from "./middleware/error-handler";

const app = express();

app.use(helmet());
const allowedOrigins = process.env.NODE_ENV === "production"
  ? [process.env.FRONTEND_URL || "https://casi-frontend.vercel.app"]
  : ["http://localhost:5173", "http://localhost:3000", "*"];

app.use(cors({ 
  origin: allowedOrigins,
  credentials: true 
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
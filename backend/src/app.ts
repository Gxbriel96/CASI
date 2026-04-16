import express, { Request, Response, NextFunction } from "express";
import helmet from "helmet";
import cors from "cors";
import compression from "compression";
import routes from "./routes";
import { errorHandler } from "./middleware/error-handler";

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.ALLOWED_ORIGINS?.split(",") || "*" }));
app.use(compression());

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.use("/api", routes);

app.use((req: Request, res: Response) => {
  res.status(404).json({ status: "error", message: "Route not found" });
});

app.use(errorHandler);

export default app;
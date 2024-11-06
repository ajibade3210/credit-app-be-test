import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
dotenv.config();
import userRoutes from "./routes/user";
import authRoutes from "./routes/auth";
import transferRoutes from "./routes/transaction";
import walletRoutes from "./routes/wallet";
import { logger } from "./utils/logger";

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: "*", credentials: true }));

app.use("/v1/api/auth", authRoutes);
app.use("/v1/api/user", userRoutes);
app.use("/v1/api/wallet", walletRoutes);
app.use("/v1/api/transfer", transferRoutes);

app.get(
  "/v1/api/test",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.json({ status: "success", message: "Welcome to Lendsqr! Demo App" });
    } catch (error) {
      next(error);
    }
  }
);

app.all(
  "/v1/api/*",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      res
        .status(404)
        .json({ status: "success", message: "Endpoint not found ☹️" });
    } catch (error) {
      next(error);
    }
  }
);

// Global error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error(err.message);
  res
    .status(500)
    .json({
      status: "failed",
      message: err.message || "Internal Server Error",
    });
});

export default app;

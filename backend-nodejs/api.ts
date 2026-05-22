import express from "express";
import type { Request, Response, NextFunction } from "express";
import { authRouter } from "./src/modules/auth/auth.router";
import { todoRouter } from "./src/modules/todo/todo.router";
import cookieParser from "cookie-parser";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./src/shared/config/swagger";
import cors from "cors";
import { authMiddleware } from "./src/shared/middleware/auth.middleware";
import { csrfMiddleware } from "./src/shared/middleware/csrf.middleware";

export const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/api", csrfMiddleware);

app.use("/api/auth", authRouter);

app.use(authMiddleware);

app.use("/api/task", todoRouter);

// Error handling middleware (must be last)
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    error: message,
    statusCode,
  });
});

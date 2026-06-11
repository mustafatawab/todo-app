import express from "express";
import type { Request, Response, NextFunction } from "express";
import { authRouter } from "./src/modules/auth/auth.router";
import { todoRouter } from "./src/modules/todo/todo.router";
import { orgRouter } from "./src/modules/organization/org.router";
import cookieParser from "cookie-parser";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./src/shared/config/swagger";
import cors from "cors";
import { authMiddleware } from "./src/shared/middleware/auth.middleware";
import { csrfMiddleware } from "./src/shared/middleware/csrf.middleware";
import { AppError } from "./src/shared/error/AppError";

export const app = express();

app.use(
  cors({
    origin: [ process.env.FRONTEND_URL! , "http://localhost:3000" , "http://localhost:3001" , "http://localhost:5173" ],
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

app.use("/api/org" , orgRouter)

// Error handling middleware (must be last)
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";


  if (err instanceof AppError){
    return res.status(statusCode).json({
      message: err.message
    })
  }

  if (err.name == "ZodError" || err.issues){
    console.log("Zod Validation error " , JSON.stringify(err.issues || err.errors, null , 2))
    return res.status(statusCode).json({
      message : "Validation Failed",
      errors : err.errors || err.issues
    })
  }

  console.error(err)

  res.status(statusCode).json({
    error: message,
    statusCode,
  });
});

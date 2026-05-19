import express from "express";
import { authRouter } from "./src/modules/auth/auth.router";
import cookieParser from "cookie-parser";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./src/shared/config/swagger";

export const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/api-docs" , swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/auth", authRouter);


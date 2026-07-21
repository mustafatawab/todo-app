import swaggerJSDoc from "swagger-jsdoc";
import { env } from "./env.js";
const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Task Flow API",
            version: "1.0.1",
            description: "API documentation for the Task Flow App",
        },
        servers: [
            {
                url: `http://localhost:${env.PORT}`,
                description: "Development server",
            },
        ],
        components: {
            securitySchemes: {
                cookieAuth: {
                    type: "apiKey",
                    in: "cookie",
                    name: "accessToken",
                    description: "Login first to get the access token cookie",
                },
            },
        },
    },
    apis: ["./src/modules/**/*.ts", "./api.ts"],
};
export const swaggerSpec = swaggerJSDoc(options);
//# sourceMappingURL=swagger.js.map
# Swagger / OpenAPI Learning Guide

This guide explains the basic OpenAPI concepts and shows how to document routes using `swagger-jsdoc` in your Express app.

## 1. What is OpenAPI?

OpenAPI is a standard format for describing REST APIs in a machine-readable way. Swagger UI reads this description and generates interactive documentation.

## 2. Core OpenAPI elements

### `openapi`
- Defines the OpenAPI version.
- Example: `openapi: "3.0.0"`

### `info`
- Metadata about the API.
- Includes `title`, `version`, and `description`.

### `servers`
- A list of base URLs for the API.
- Example:
  ```yaml
  servers:
    - url: "http://localhost:9000"
      description: "Development server"
  ```

### `paths`
- The main place where routes are defined.
- Each path contains one or more HTTP methods like `get`, `post`, `put`, `delete`.

Example:
```yaml
paths:
  /auth/register:
    post:
      tags:
        - Auth
      summary: Register a new user
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required:
                - name
                - email
                - password
              properties:
                name:
                  type: string
                email:
                  type: string
                password:
                  type: string
      responses:
        '201':
          description: User created successfully
        '400':
          description: Validation error
```

## 3. Documenting route request bodies

For POST or PUT endpoints, use `requestBody`:
```yaml
requestBody:
  required: true
  content:
    application/json:
      schema:
        type: object
        required:
          - email
          - password
        properties:
          email:
            type: string
          password:
            type: string
```

## 4. Documenting responses

Each endpoint should define expected responses.

Example:
```yaml
responses:
  '200':
    description: Logged in successfully
    content:
      application/json:
        schema:
          type: object
          properties:
            message:
              type: string
  '401':
    description: Invalid credentials
```

## 5. Reusable components

Use `components` to define reusable schemas and security settings.

Example:
```yaml
components:
  schemas:
    UserCredentials:
      type: object
      required:
        - email
        - password
      properties:
        email:
          type: string
        password:
          type: string
  securitySchemes:
    cookieAuth:
      type: apiKey
      in: cookie
      name: accessToken
```

Reuse it with `$ref`:
```yaml
requestBody:
  content:
    application/json:
      schema:
        $ref: '#/components/schemas/UserCredentials'
```

## 6. Security definitions

For cookie-based auth:
```yaml
security:
  - cookieAuth: []
```

This tells Swagger UI that the route requires the auth scheme defined in `components.securitySchemes`.

## 7. Tags

Tags group related routes in Swagger UI.

Example:
```yaml
tags:
  - name: Auth
    description: Authentication endpoints
```

Use `tags` in each route to categorize it.

## 8. `swagger-jsdoc` comments in code

In the project, you can document each route with JSDoc-style comments.

Example for `auth.router.ts`:
```ts
/**
 * @openapi
 * /auth/register:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       '201':
 *         description: User created successfully
 *       '400':
 *         description: Validation error
 */
router.post("/register", userRegisterationHandler);
```

Example for `login`:
```ts
/**
 * @openapi
 * /auth/login:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Login a user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Logged in successfully
 *       '401':
 *         description: Invalid credentials
 */
router.post("/login", userLoginHandler);
```

Example for protected logout route:
```ts
/**
 * @openapi
 * /auth/logout:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Logout the current user
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       '200':
 *         description: Logged out successfully
 */
router.post("/logout", authMiddleware, userLogoutHandler);
```

## 9. Common mistakes to avoid

- Use `/**` for JSDoc comments, not `/*`.
- Fix misspellings like `securitySchemes`.
- Ensure `apis` includes the right file paths.
- Use quoted status codes like `'200'` or `200` consistently.
- Include `responses` for all possible status codes.

## 10. How to check the docs

1. Start your server.
2. Open `http://localhost:<PORT>/api-docs`
3. Verify the routes appear and the request/response examples are correct.

## 11. Example `swagger.ts` configuration

```ts
import swaggerJSDoc from "swagger-jsdoc";
import { env } from "./env";

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Todo App API",
      version: "1.0.0",
      description: "API documentation for the Todo App",
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
```

## 12. Learning path

- Start with one route and verify it appears in Swagger UI.
- Add request and response schemas.
- Add reusable `components.schemas` once you have repeated models.
- Add `security` only for authenticated endpoints.
- Read the OpenAPI 3.0 docs for more advanced details on `parameters`, `headers`, and `responses`.

Good luck learning Swagger! This file is a reference you can keep in the repo while you build more routes.
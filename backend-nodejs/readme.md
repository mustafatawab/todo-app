```
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
              required: [name, email, password]
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
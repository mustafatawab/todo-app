# Frontend API Reference

The frontend expects the following API endpoints from the backend. All endpoints require authentication unless marked otherwise.

---

## Auth

### Register

```http
POST /api/auth/register
```

**Body:**
```json
{
  "name": "John Doe",
  "username": "john_doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response `201`:**
```json
{
  "message": "User registered successfully",
  "user": { "id": "...", "name": "John Doe", "username": "john_doe", "email": "john@example.com" }
}
```

---

### Login

```http
POST /api/auth/login
```

Takes **either** email or username in the same field.

**Body:**
```json
{
  "emailOrUsername": "john@example.com",
  "password": "password123"
}
```

**Response `200`:** Sets `accessToken` + `refreshToken` httpOnly cookies.

```json
{
  "message": "User logged in successfully",
  "user": { "id": "...", "name": "John Doe", "email": "john@example.com" }
}
```

---

### Logout

```http
POST /api/auth/logout
```
Requires auth. Clears all session tokens.

---

### Get Current User

```http
GET /api/auth/me
```
Requires auth.

**Response `200`:**
```json
{
  "id": "...",
  "name": "John Doe",
  "email": "john@example.com",
  "username": "john_doe",
  "createdAt": "..."
}
```

---

### Refresh Token

```http
POST /api/auth/refresh-token
```
Reads `refreshToken` from cookie. Rotates tokens.

---

## Organizations

### List User's Organizations

```http
GET /api/org
```
Requires auth.

**Response `200`:**
```json
[
  {
    "id": "...",
    "name": "Acme Corp",
    "slug": "acme-corp",
    "role": "ADMIN",
    "createdAt": "..."
  }
]
```

`role` is the requesting user's role in that org.

---

### Create Organization

```http
POST /api/org
```
Requires auth. Creator becomes ADMIN.

**Body:**
```json
{
  "name": "Acme Corp"
}
```

**Response `201`:**
```json
{
  "id": "...",
  "name": "Acme Corp",
  "slug": "acme-corp",
  "createdAt": "..."
}
```

---

### Join Organization

```http
POST /api/org/join
```
Requires auth. Joiner becomes MEMBER.

**Body:**
```json
{
  "code": "XXX-XXX"
}
```

**Response `200`:**
```json
{
  "message": "Joined organization successfully",
  "slug": "acme-corp"
}
```

---

## Members (Admin only)

### List Members

```http
GET /api/org/:slug/members
```

**Response `200`:**
```json
[
  {
    "id": "...",
    "userId": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "username": "john_doe",
    "role": "ADMIN",
    "joinedAt": "..."
  }
]
```

---

### Add Member

```http
POST /api/org/:slug/members
```

Admin creates a user with credentials. The user can then log in with email or username.

**Body:**
```json
{
  "name": "Jane Doe",
  "username": "jane_doe",
  "email": "jane@example.com",
  "password": "temporary-password"
}
```

**Response `201`:**
```json
{
  "message": "Member added successfully"
}
```

---

### Remove Member

```http
DELETE /api/org/:slug/members/:userId
```

**Response `200`:**
```json
{
  "message": "Member removed"
}
```

---

### Change Member Role

```http
PATCH /api/org/:slug/members/:userId/role
```

**Body:**
```json
{
  "role": "ADMIN"
}
```

Valid roles: `"ADMIN"` | `"MEMBER"`

**Response `200`:**
```json
{
  "message": "Member role updated"
}
```

---

## Tasks (Org-scoped)

### List Tasks

```http
GET /api/org/:slug/tasks
```

**Response `200`:**
```json
[
  {
    "id": "...",
    "title": "Fix login bug",
    "description": "Users cannot log in with username",
    "status": "TODO",
    "priority": "HIGH",
    "dueDate": "2026-06-20T00:00:00.000Z" | null,
    "createdAt": "...",
    "assignee": {
      "id": "...",
      "name": "Jane Doe",
      "email": "jane@example.com"
    } | null,
    "createdBy": {
      "id": "...",
      "name": "John Doe"
    } | null
  }
]
```

**Valid statuses:** `"TODO"` | `"IN_PROGRESS"` | `"DONE"`  
**Valid priorities:** `"LOW"` | `"MEDIUM"` | `"HIGH"` | `"URGENT"`

---

### Create Task (Admin only)

```http
POST /api/org/:slug/tasks
```

**Body:**
```json
{
  "title": "Fix login bug",
  "description": "Users cannot log in with username",
  "priority": "HIGH",
  "status": "TODO",
  "dueDate": "2026-06-20T00:00:00.000Z",
  "assigneeId": "<user_id>"
}
```

All fields except `title` are optional. `assigneeId` must be a valid user ID from the org.

---

### Update Task (Admin only)

```http
PUT /api/org/:slug/tasks/:id
```

All fields are optional — only provided fields will be updated.

**Body:**
```json
{
  "title": "Fix login bug",
  "description": "Updated description",
  "priority": "URGENT",
  "status": "IN_PROGRESS",
  "dueDate": "2026-06-25T00:00:00.000Z",
  "assigneeId": "<user_id>"
}
```

Set `assigneeId` to `null` to unassign.

---

### Update Task Status (Admin & Member)

```http
PATCH /api/org/:slug/tasks/:id/status
```

**Body:**
```json
{
  "status": "DONE"
}
```

Both admin and member can change status. Admin uses the full PUT endpoint above.

---

### Delete Task (Admin only)

```http
DELETE /api/org/:slug/tasks/:id
```

**Response `200`:**
```json
{
  "message": "Task deleted"
}
```

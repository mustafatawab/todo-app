import type { CreateMemberInput } from "./member.schema";
import { prisma } from "../../shared/lib/prisma";
import { AppError } from "../../shared/error/AppError";
import { hashPassword } from "../../shared/utils/hash";


/*
1. GET /api/org/:slug/members
// Response 200
[
  {
    "id": "<orgMemberId>",
    "userId": "<userId>",
    "name": "Jane Doe",
    "email": "jane@example.com",
    "username": "jane_doe",
    "role": "MEMBER",
    "joinedAt": "2026-06-11T..."
  }
]
2. POST /api/org/:slug/members
// Request body
{ "name": "Jane Doe", "username": "jane_doe", "email": "jane@example.com", "password": "temp123" }

// Response 201
{ "message": "Member added successfully" }
3. DELETE /api/org/:slug/members/:userId
// Response 200
{ "message": "Member removed" }
4. PATCH /api/org/:slug/members/:userId/role
// Request body
{ "role": "ADMIN" } // or "MEMBER"

// Response 200
{ "message": "Member role updated" }
*/

export const getMembers = async (orgId : string) => {
    const org = await prisma.organization.findMany()

}





export const createMember = async (input: CreateMemberInput, orgId: string) => {
  const { name, email, username, password } = input;

  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [{ email }, { username }],
    },
  });

  if (existingUser) {
    throw new AppError("Try different username or email", 409);
  }

  await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        name,
        email,
        username,
        password: await hashPassword(password),
      },
    });

    const membership = await tx.orgMember.create({
      data: {
        userId: user.id,
        role: "MEMBER",
        orgId: orgId,
      },
    });
  });

  //   const user = await prisma.user.create({
  //     data: {
  //       name,
  //       email,
  //       username,
  //       password: await hashPassword(password),
  //     },
  //   });

  //   const membership = await prisma.orgMember.create({
  //     data: {
  //       userId: user.id,
  //       role: "MEMBER",
  //       orgId: orgId,
  //     },
  //   });

  return { message: "User has been created successfully" };
};

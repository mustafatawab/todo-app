import type { CreateMemberInput, UpdateMemberInput } from "./member.schema";
import { prisma } from "../../shared/lib/prisma";
import { AppError } from "../../shared/error/AppError";
import { hashPassword } from "../../shared/utils/hash";

export const getMembers = async (orgId: string) => {
  const orgMembers = await prisma.orgMember.findMany({
    where: { orgId },
    include: { user: true, org: true },
  });

  return orgMembers.map((m) => ({
    id: m.id,
    userId: m.user.id,
    name: m.user.name,
    email: m.user.email,
    role: m.role,
    joinedAt: m.joinedAt,
  }));
};

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

  return { message: "Member added successfully" };
};

export const updateMember = async (
  input: UpdateMemberInput,
  orgId: string,
  userId: string,
) => {
  const updated = await prisma.orgMember.update({
    where: {
      userId_orgId: {
        userId,
        orgId,
      },
    },
    data: {
      role: input.role,
    },
  });

  return { message: "Member role updated" };
};

export const deleteMember = async (orgId: string, userId: string) => {
  await prisma.orgMember.delete({
    where: {
      userId_orgId: {
        orgId,
        userId,
      },
    },
  });

  return { message: "Member deleted successfully" };
};

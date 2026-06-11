import type {
  CreateOrganizationInput,
  JoinOrganizationInput,
} from "./org.schema";
import { prisma } from "../../shared/lib/prisma";
import { AppError } from "../../shared/error/AppError";

export const createOrganization = async (
  input: CreateOrganizationInput,
  userId: string,
) => {
  const slug = input.name.toLowerCase().replace(/\s+/g, "-");

  const existingOrg = await prisma.organization.findUnique({
    where: {
      slug: slug,
    },
  });

  if (existingOrg) {
    throw new AppError("Organization with the same name already exists", 400);
  }

  const organization = await prisma.organization.create({
    data: {
      name: input.name,
      slug: slug,
      members: {
        create: {
          userId,
          role: "ADMIN",
        },
      },
    },
  });

  //   await prisma.orgMember.create({
  //     data: {
  //       userId,
  //       orgId: organization.id,
  //       role: "ADMIN",
  //     },
  //   });

  return organization;
};


// ============== List User Organizations
export const listUserOrganizations = async (userId: string) => {
  const memberships = await prisma.orgMember.findMany({
    where: {
      userId: userId,
    },
    include: {
      org: true,
    },
  });

  return memberships.map((m) => ({
    id: m.org.id,
    name: m.org.name,
    slug: m.org.slug,
    role: m.role,
    createdAt: m.org.createdAt,
  }));
};



// ========= Join Organization
export const joinOrganization = async (
  input: JoinOrganizationInput,
  userId: string,
) => {
  const org = await prisma.organization.findUnique({
    where: { inviteCode: input.code },
  });

  if (!org) {
    throw new AppError("Organization Invite Code is incorrect", 404);
  }

  const member = await prisma.orgMember.findFirst({
    where: { userId: userId, orgId: org.id },
  });

  if (member) {
    throw new AppError(`Already the member of ${org.name}`, 409);
  }

  await prisma.orgMember.create({
    data: {
      userId,
      role: "MEMBER",
      orgId: org.id,
    },
  });

  return { message: "Joined Successfully", slug: org.slug };
};

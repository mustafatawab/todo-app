import type { CreateOrganizationInput } from "./org.schema";
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
    createdAt: m.org.createdAt,
  }));
};

import { prisma } from "../lib/prisma";
import { AppError } from "../error/AppError";

export const getUserRole = async (userId: string, orgId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { orgMemberships: { where: { orgId } } },
  });
  if (!user || !user.orgMemberships[0]) {
    throw new AppError("User is not a member of this organization", 403);
  }
  return { role: user.orgMemberships[0].role, user };
};

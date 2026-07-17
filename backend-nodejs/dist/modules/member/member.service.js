import { prisma } from "../../shared/lib/prisma.js";
import { AppError } from "../../shared/error/AppError.js";
import { hashPassword } from "../../shared/utils/hash.js";
export const getMembers = async (orgId) => {
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
export const createMember = async (input, orgId) => {
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
const countAdmins = async (orgId) => {
    return prisma.orgMember.count({
        where: { orgId, role: "ADMIN" },
    });
};
export const updateMember = async (input, orgId, userId) => {
    const current = await prisma.orgMember.findUnique({
        where: { userId_orgId: { userId, orgId } },
    });
    if (!current) {
        throw new AppError("Member not found", 404);
    }
    if (current.role === "ADMIN" && input.role === "MEMBER") {
        const adminCount = await countAdmins(orgId);
        if (adminCount <= 1) {
            throw new AppError("Cannot demote the last admin of the organization", 403);
        }
    }
    await prisma.orgMember.update({
        where: { userId_orgId: { userId, orgId } },
        data: { role: input.role },
    });
    return { message: "Member role updated" };
};
export const deleteMember = async (orgId, userId) => {
    const current = await prisma.orgMember.findUnique({
        where: { userId_orgId: { userId, orgId } },
    });
    if (!current) {
        throw new AppError("Member not found", 404);
    }
    if (current.role === "ADMIN") {
        const adminCount = await countAdmins(orgId);
        if (adminCount <= 1) {
            throw new AppError("Cannot remove the last admin of the organization", 403);
        }
    }
    await prisma.orgMember.delete({
        where: { userId_orgId: { orgId, userId } },
    });
    return { message: "Member deleted successfully" };
};
//# sourceMappingURL=member.service.js.map
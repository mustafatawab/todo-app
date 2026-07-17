import { AppError } from "../error/AppError.js";
import { prisma } from "../../shared/lib/prisma.js";
export const resolveOrg = async (req, res, next) => {
    try {
        const slug = req.params.slug;
        if (!slug) {
            throw new AppError("Organization slug is required", 400);
        }
        const org = await prisma.organization.findUnique({
            where: { slug },
        });
        if (!org) {
            throw new AppError("Organization not found", 404);
        }
        const membership = await prisma.orgMember.findFirst({
            where: { userId: req.user.userId, orgId: org.id },
        });
        if (!membership) {
            throw new AppError("You are not a member of this organization", 403);
        }
        req.org = { id: org.id, slug, role: membership.role };
        next();
    }
    catch (error) {
        next(error);
    }
};
//# sourceMappingURL=resolveOrg.middleware.js.map
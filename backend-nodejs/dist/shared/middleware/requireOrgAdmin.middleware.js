import { AppError } from "../error/AppError";
import { prisma } from "../../shared/lib/prisma";
export const requireOrgAdmin = async (req, res, next) => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            throw new AppError("User ID not found", 404);
        }
        const slug = req.params.slug;
        if (!slug) {
            throw new AppError("Organization Slug is required", 400);
        }
        const membership = await prisma.orgMember.findFirst({
            where: { userId: userId, org: { slug: slug } },
        });
        if (!membership) {
            throw new AppError("Not a member of this organization", 403);
        }
        if (membership.role !== "ADMIN") {
            throw new AppError("Admin access required", 403);
        }
        req.org = { id: membership.orgId, slug, role: membership.role };
        next();
    }
    catch (error) {
        next(error);
    }
};
//# sourceMappingURL=requireOrgAdmin.middleware.js.map
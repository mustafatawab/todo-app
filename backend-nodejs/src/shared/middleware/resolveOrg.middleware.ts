import type { Request, Response, NextFunction } from "express";
import { AppError } from "../error/AppError";
import { prisma } from "../../shared/lib/prisma";

export const resolveOrg = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const slug = req.params.slug as string;

    if (!slug) {
      throw new AppError("Organization slug is required", 400);
    }

    const org = await prisma.organization.findUnique({
      where: { slug },
    });

    if (!org) {
      throw new AppError("Organization not found", 404);
    }

    req.org = { id: org.id, slug, role: "MEMBER" };
    next();
  } catch (error) {
    next(error);
  }
};

import { createMemberSchema } from "./member.schema";
import { createMember } from "./member.service";
import type { Request, Response, NextFunction } from "express";

export const createMemberHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const validatedData =  createMemberSchema.parse(req.body);
    const orgId = req.org?.id as string;

    const result = await createMember(validatedData, orgId);
    return res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
};

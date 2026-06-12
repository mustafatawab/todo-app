import { createMemberSchema, updateMemberSchema } from "./member.schema";
import {
  createMember,
  deleteMember,
  getMembers,
  updateMember,
} from "./member.service";
import type { Request, Response, NextFunction } from "express";

export const createMemberHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const validatedData = createMemberSchema.parse(req.body);
    const orgId = req.org?.id as string;

    const result = await createMember(validatedData, orgId);
    return res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
};

export const getMembersHandlers = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await getMembers(req.org!.id);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const updateMembersHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const validatedData = updateMemberSchema.parse(req.body);
    const result = await updateMember(
      validatedData,
      req.org!.id,
      req.params!.userId as string,
    );
    return res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
};

export const deleteMemberHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await deleteMember(req.org!.id, req.params?.userId as string);
    return res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
};

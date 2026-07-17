import { createOrganizationSchema, joinOrganizationSchema } from "./org.schema.js";
import { createOrganization, joinOrganization, listUserOrganizations, getInviteCode, resetInviteCode } from "./org.service.js";
import type { Request, Response, NextFunction } from "express";

export const createOrgHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const validatedBody = createOrganizationSchema.parse(req.body);

    const org = await createOrganization(validatedBody, req.user!.userId);

    return res.status(201).json(org);
  } catch (error) {
    return next(error);
  }
};


export const listUserOrghandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await listUserOrganizations(req.user!.userId);

    return res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
};


export const joinOrganizationHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedBody = joinOrganizationSchema.parse(req.body)

    const result = await joinOrganization(validatedBody, req.user!.userId)

    return res.status(200).json(result)
  } catch (error) {
    return next(error)
  }
}

export const getInviteCodeHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await getInviteCode(req.org!.id)
    return res.status(200).json(result)
  } catch (error) {
    return next(error)
  }
}

export const resetInviteCodeHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await resetInviteCode(req.org!.id)
    return res.status(200).json(result)
  } catch (error) {
    return next(error)
  }
}

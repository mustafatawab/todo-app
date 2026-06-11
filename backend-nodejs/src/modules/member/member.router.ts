import { requireOrgAdmin } from "../../shared/middleware/requireOrgAdmin.middleware";
import { createMemberHandler } from "./member.controller";
import { Router } from "express";

const router = Router();

router.post("/:slug", requireOrgAdmin, createMemberHandler);

export { router as memberRouter };

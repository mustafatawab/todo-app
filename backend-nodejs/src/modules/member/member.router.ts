import { requireOrgAdmin } from "../../shared/middleware/requireOrgAdmin.middleware";
import { createMemberHandler, deleteMemberHandler, getMembersHandlers, updateMembersHandler } from "./member.controller";
import { Router } from "express";

const router = Router();

router.post("", createMemberHandler);

router.get(""  , getMembersHandlers)

router.patch("/:userId/role"  , updateMembersHandler)

router.delete("/:userId"  , deleteMemberHandler)

export { router as memberRouter };

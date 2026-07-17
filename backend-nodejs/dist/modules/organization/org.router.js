import { Router } from "express";
import { createOrgHandler, listUserOrghandler, joinOrganizationHandler, getInviteCodeHandler, resetInviteCodeHandler, } from "./org.controller";
import { memberRouter } from "../member/member.router";
import { requireOrgAdmin } from "../../shared/middleware/requireOrgAdmin.middleware";
const router = Router();
router.post("/", createOrgHandler);
router.get("/", listUserOrghandler);
router.post("/join", joinOrganizationHandler);
router.get("/:slug/invite-code", requireOrgAdmin, getInviteCodeHandler);
router.post("/:slug/invite-code/reset", requireOrgAdmin, resetInviteCodeHandler);
router.use("/:slug/members", requireOrgAdmin, memberRouter);
export { router as orgRouter };
//# sourceMappingURL=org.router.js.map
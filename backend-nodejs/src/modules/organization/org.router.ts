import { Router } from "express";
import {
  createOrgHandler,
  listUserOrghandler,
  joinOrganizationHandler,
} from "./org.controller";
import { memberRouter } from "../member/member.router";
import { requireOrgAdmin } from "../../shared/middleware/requireOrgAdmin.middleware";

const router = Router();

router.post("/", createOrgHandler);

router.get("/", listUserOrghandler);

router.post("/join", joinOrganizationHandler);

router.use("/:slug/members", requireOrgAdmin, memberRouter);

export { router as orgRouter };

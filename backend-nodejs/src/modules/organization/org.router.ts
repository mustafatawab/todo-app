import { Router } from "express";
import { createOrgHandler, listUserOrghandler, joinOrganizationHandler } from "./org.controller";
import { memberRouter } from "../member/member.router";

const router = Router()


router.post("/" ,createOrgHandler)

router.get("/" , listUserOrghandler)

router.post("/join" , joinOrganizationHandler)


router.use("/:slug/members")

export { router as orgRouter }
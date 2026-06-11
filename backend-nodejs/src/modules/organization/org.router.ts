import { Router } from "express";
import { createOrgHandler, listUserOrghandler, joinOrganizationHandler } from "./org.controller";

const router = Router()


router.post("/" ,createOrgHandler)

router.get("/" , listUserOrghandler)

router.post("/join" , joinOrganizationHandler)

export { router as orgRouter }
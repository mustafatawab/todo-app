import { Router } from "express";
import { createTodoHandler, updateTodoHandler, statusChangeTodoHandler, deleteTodoHandler, listAllTodoHandler, } from "./todo.controller.js";
import { requireOrgAdmin } from "../../shared/middleware/requireOrgAdmin.middleware.js";
import { resolveOrg } from "../../shared/middleware/resolveOrg.middleware.js";
const router = Router({ mergeParams: true });
router.get("/", resolveOrg, listAllTodoHandler);
router.post("/", requireOrgAdmin, createTodoHandler);
router.put("/:id", requireOrgAdmin, updateTodoHandler);
router.patch("/:id/status", resolveOrg, statusChangeTodoHandler);
router.delete("/:id", requireOrgAdmin, deleteTodoHandler);
export { router as todoRouter };
//# sourceMappingURL=todo.router.js.map
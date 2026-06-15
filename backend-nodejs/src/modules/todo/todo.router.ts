import Router from "express";
import {
  createTodoHandler,
  updateTodoHandler,
  statusChangeTodoHandler,
  deleteTodoHandler,
  listAllTodoHandler

} from "./todo.controller";
import { requireOrgAdmin } from "../../shared/middleware/requireOrgAdmin.middleware";

const router = Router();


router.get("/" , listAllTodoHandler)

router.post("/", requireOrgAdmin, createTodoHandler);

router.put("/:id", requireOrgAdmin, updateTodoHandler);

router.patch("/:id/status", statusChangeTodoHandler);

router.delete("/:id", requireOrgAdmin, deleteTodoHandler);

export { router as todoRouter };

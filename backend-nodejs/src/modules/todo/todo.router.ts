import Router from "express";
import {
  createTodoHandler,
  updateTodoHandler,
  statusChangeTodoHandler,
  deleteTodoHandler,
  listAllTodoHandler

} from "./todo.controller";

const router = Router();


router.get("/" , listAllTodoHandler)

router.post("/", createTodoHandler);

router.put("/:id", updateTodoHandler);

router.patch("/:id/status", statusChangeTodoHandler);

router.delete("/:id", deleteTodoHandler);

export { router as todoRouter };

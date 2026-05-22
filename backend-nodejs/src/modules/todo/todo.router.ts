import Router from "express";
import {
  createTodoHandler,
  updateTodoHandler,
  completeTodoHandler,
  deleteTodoHandler,
} from "./todo.controller";

const router = Router();

router.post("/", createTodoHandler);

router.put("/:id", updateTodoHandler);

router.patch("/:id/complete", completeTodoHandler);

router.delete("/:id", deleteTodoHandler);

export { router as todoRouter };

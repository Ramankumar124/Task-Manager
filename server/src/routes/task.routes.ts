import { Router } from "express";
import {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask,
} from "../controller/task.controller";
import { createTaskSchema } from "../schema/TaskSchemas";
import validateYup from "../middlewares/validateYup.middleware";

const router = Router();
router.route("/create").post(validateYup(createTaskSchema), createTask);
router.route("/getAllTasks").get(getAllTasks);
router.route("/:id").get(getTaskById);
router.route("/:id").put(updateTask);
router.route("/:id").delete(deleteTask);

export { router as taskRoutes };

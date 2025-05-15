import { Router } from "express";
import {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask,
} from "../controller/task.controller";
import { TaskSchema } from "../schema/TaskSchemas";
import validateYup from "../middlewares/validateYup.middleware";

const router = Router();
router.route("/").post(validateYup(TaskSchema), createTask);
router.route("/").get(getAllTasks);
router.route("/:id").get(getTaskById);
router.route("/:id").put(validateYup(TaskSchema), updateTask);
router.route("/:id").delete(deleteTask);

export { router as taskRoutes };

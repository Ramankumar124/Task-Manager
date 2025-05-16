import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../utils/Asynchandler";
import { model, Types } from "mongoose";
import Task from "../models/task.model";
import User from "../models/user.model";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import redisClient from "../utils/redisClient"; // Added import for redisClient

const createTask = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { title, description, dueDate, priority, status } = req.body;

    // @ts-ignore
    const userId = req.user?.id;

    if (!userId) {
      return next(new ApiError(401, "User not authenticated"));
    }

    const newTask = await Task.create({
      title,
      description,
      priority,
      status,
      dueDate,
      userId,
    });

    if (!newTask) {
      return next(new ApiError(400, "Unable to create the task"));
    }

    await User.findByIdAndUpdate(userId, { $push: { Tasks: newTask._id } });

    await redisClient.del(`tasks:${userId}`);

    return res
      .status(201)
      .json(new ApiResponse(201, newTask, "Task Created Successfully"));
  }
);

const getAllTasks = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    //@ts-ignore
    const userId = req?.user?.id!;
    const cacheKey = `tasks:${userId}`;

    if (!userId) {
      return next(new ApiError(401, "User not authenticated"));
    }

    
    const cachedTasks = await redisClient.get(cacheKey);
    if (cachedTasks) {
      return res
        .status(200)
        .json(
          new ApiResponse(
            200,
            JSON.parse(cachedTasks),
            "Tasks fetched successfully from cache"
          )
        );
    }

    const user = await User.findById(userId).populate("Tasks");

    if (!user) {
      return next(new ApiError(404, "User not found"));
    }
    const tasks = user.Tasks;


    await redisClient.set(cacheKey, JSON.stringify(tasks), "EX", 3600);

    return res
      .status(200)
      .json(new ApiResponse(200, tasks, "Tasks fetched successfully"));
  }
);

const getTaskById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    // @ts-ignore
    const userId = req.user?.id;

    if (!userId) {
      return next(new ApiError(401, "User not authenticated"));
    }

    const task = await Task.findById(id);

    if (!task) {
      return next(new ApiError(404, "Task not found"));
    }

    const user = await User.findById(userId);
    if (!user) {
      return next(new ApiError(403, "Not authorized to access this task"));
    }

    return res
      .status(200)
      .json(new ApiResponse(200, task, "Task fetched successfully"));
  }
);

const updateTask = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    console.log(req.body);

    const { id } = req.params;
    const { title, description, dueDate, priority, status } = req.body;
    // @ts-ignore
    const userId = req.user?.id;

    if (!userId) {
      return next(new ApiError(401, "User not authenticated"));
    }
    const user = await User.findById(userId);
    if (!user) {
      return next(new ApiError(403, "Not authorized to update this task"));
    }

    const task = await Task.findByIdAndUpdate(
      id,
      {
        title,
        description,
        dueDate,
        priority,
        status,
      },
      { new: true, runValidators: true }
    );

    if (!task) {
      return next(new ApiError(404, "Task not found"));
    }

    await redisClient.del(`tasks:${userId}`);

    return res
      .status(200)
      .json(new ApiResponse(200, task, "Task updated successfully"));
  }
);

const deleteTask = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    // @ts-ignore
    const userId = req.user?.id;

    if (!userId) {
      return next(new ApiError(401, "User not authenticated"));
    }

    const user = await User.findById(userId);
    if (!user) {
      return next(new ApiError(403, "Not authorized to delete this task"));
    }

    const task = await Task.findByIdAndDelete(id);

    if (!task) {
      return next(new ApiError(404, "Task not found"));
    }

    await User.findByIdAndUpdate(userId, {
      $pull: { Tasks: new Types.ObjectId(id) },
    });

    await redisClient.del(`tasks:${userId}`);

    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Task deleted successfully"));
  }
);

export { createTask, getAllTasks, getTaskById, updateTask, deleteTask };

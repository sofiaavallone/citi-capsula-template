import { Router } from "express";
import { getUsers } from "../controllers/users.controller";
import { asyncHandler } from "../middlewares/errorHandler";

export const usersRouter = Router();

usersRouter.get("/", asyncHandler(getUsers));

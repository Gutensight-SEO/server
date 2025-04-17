/** @format */
import { UserController } from "@/controllers";
import { adminMiddleware, authMiddleware } from "@/middlewares";
import { Router } from "express";

const userRouter = Router();

// get users :admin
userRouter.get("/all", adminMiddleware, UserController.getUsers);
// get user
userRouter.get("/", UserController.getUser);
userRouter.patch("/", UserController.updateUser);
userRouter.delete("/", UserController.deleteUser);

export default userRouter;

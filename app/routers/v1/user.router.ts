/** @format */
import { UserController } from "@/controllers";
import { adminMiddleware, authMiddleware } from "@/middlewares";
import { Router } from "express";

const userRouter = Router();

// get users :admin
userRouter.get("/all", adminMiddleware, UserController.getUsers);
// get user
userRouter.get("/", UserController.getUser);
// update user - remove authorizationMiddleware since we already have authMiddleware in v1Router
userRouter.patch("/", UserController.updateUser);
// delete user - remove authorizationMiddleware for the same reason
userRouter.delete("/", UserController.deleteUser);

export default userRouter;

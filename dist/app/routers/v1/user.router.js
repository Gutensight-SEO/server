"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/** @format */
const controllers_1 = require("../../controllers");
const middlewares_1 = require("../../middlewares");
const express_1 = require("express");
const userRouter = (0, express_1.Router)();
// get users :admin
userRouter.get("/all", middlewares_1.adminMiddleware, controllers_1.UserController.getUsers);
// get user
userRouter.get("/", controllers_1.UserController.getUser);
userRouter.patch("/", controllers_1.UserController.updateUser);
userRouter.delete("/", controllers_1.UserController.deleteUser);
exports.default = userRouter;

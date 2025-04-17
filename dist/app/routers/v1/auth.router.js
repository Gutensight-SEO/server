"use strict";
/** @format */
Object.defineProperty(exports, "__esModule", { value: true });
const controllers_1 = require("../../controllers");
const middlewares_1 = require("../../middlewares");
const schemas_1 = require("../../schemas");
const express_1 = require("express");
const authRouter = (0, express_1.Router)();
authRouter.post("/register", (0, middlewares_1.ZodValidation)(schemas_1.ZodSchema.UserSchema.createUserBaseSchema), controllers_1.AuthController.register);
authRouter.post("/login", (0, middlewares_1.ZodValidation)(schemas_1.ZodSchema.UserSchema.loginUserSchema), controllers_1.AuthController.login);
authRouter.post("/refreshtoken", controllers_1.AuthController.refreshToken);
exports.default = authRouter;

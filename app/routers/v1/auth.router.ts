/** @format */


import { AuthController } from "@/controllers";
import { ZodValidation } from "@/middlewares";
import { ZodSchema } from "@/schemas";
import { Router } from "express";


const authRouter = Router();

authRouter.post("/register", ZodValidation(ZodSchema.UserSchema.createUserBaseSchema),
AuthController.register);
authRouter.post("/login", ZodValidation(ZodSchema.UserSchema.loginUserSchema), AuthController.login);
authRouter.post("/refreshtoken", AuthController.refreshToken);


export default authRouter;
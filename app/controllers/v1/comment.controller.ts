/** @format */


import { errorHandlerWrapper } from "@/helpers";
import { Request, Response, NextFunction } from "express";
import asyncHandler from "express-async-handler";


const registerUserHandler = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    try {
        
    } catch (error) {
        
    }
})


export const register = errorHandlerWrapper(registerUserHandler);
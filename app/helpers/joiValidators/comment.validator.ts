/** @format */


import Joi from "joi";
import { Request, Response, NextFunction } from "express";
import { Logs } from "@/monitoring";

const newCommentValidationSchema = Joi.object({
    body: Joi.string().min(2).max(500).trim(),
});

const updateCommentValidationSchema = Joi.object({
    body: Joi.string().min(2).max(500).trim(),
})


export const newCommentValidator = async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
        const comment = req.body;

        await  newCommentValidationSchema.validateAsync(comment);
        next();
    } catch (error) {
        Logs.error("New Comment Validator Error:", error);
        return next({
            status: 406,
            message: (error as any).details[0].message
        });
    }
}

export const updateCommentValidator = async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
        const comment = req.body;
        
        await updateCommentValidationSchema.validateAsync(comment);
        next();
    } catch (error) {
        Logs.error("Update Comment Validator Error:", error);
        return next({
            status: 406,
            message: (error as any).details[0].message
        })
    }
}

 
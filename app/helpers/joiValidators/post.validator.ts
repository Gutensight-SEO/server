/** @format */


import Joi from "joi";
import { Request, Response, NextFunction } from "express";
import { Logs } from "@/monitoring";

const newPostValidationSchema = Joi.object({
    title: Joi.string().min(2).max(200).trim(),
    body: Joi.string().min(2).max(1200).trim(),
    keywords: Joi.string().trim(),
});

const updatePostValidationSchema = Joi.object({
    title: Joi.string().min(2).max(200).trim(),
    body: Joi.string().min(2).max(1200).trim(),
    keywords: Joi.string().trim(),
    state: Joi.string().trim().valid("draft", "published"),
})


export const newPostValidator = async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
        const post = req.body;

        await  newPostValidationSchema.validateAsync(post);
        next();
    } catch (error) {
        Logs.error("New Post Validator Error:", error);
        return next({
            status: 406,
            message: (error as any).details[0].message
        });
    }
}

export const updatePostValidator = async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
        const post = req.body;
        
        await updatePostValidationSchema.validateAsync(post);
        next();
    } catch (error) {
        Logs.error("Update Post Validator Error:", error);
        return next({
            status: 406,
            message: (error as any).details[0].message
        })
    }
}

 
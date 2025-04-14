/** @format */

import { Logs } from "@/monitoring";
import { Request, Response, NextFunction } from "express";
import Joi from "joi";


const userValidationSchema = Joi.object({
    firstname: Joi.string().min(2).max(12).required(),
    lastname: Joi.string().min(2).max(12).required(),
    username: Joi.string().min(2).max(12).required(),
    email: Joi.string().min(5).max(50).required().email({
        minDomainSegments: 2,
        tlds: { allow: [ "com", "net", "org", "edu" ] },
    }),
    password: Joi.string()
        .pattern(new RegExp(
            "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})"
        ))
        .required(),
    confirmPassword: Joi.string()
        .pattern(new RegExp(
            "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})"
        ))
        .required(),
})


const userValidator = async (body: { firstname: string; lastname: string; username: string; email: string; password?: string | undefined; confirmPassword?: string | undefined; role?: string | undefined; }) => {
    try {        
        await userValidationSchema.validateAsync(body);
        return;
        // next();
    } catch (error) {
        Logs.error("User Validator Error:", error);
        // return next({
        //     status: 406,
        //     message: (error as any).details[0].message
        // })
        return error;
    }
}

export default userValidator;
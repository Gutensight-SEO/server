/** @format */


import { STATUS_CODES } from "@/constants";
import { Request, Response, NextFunction } from "express";
import { z } from "zod";


const validate = (schema: z.ZodObject<any, any>) => (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        schema.parse({
            body: req.body,
            query: req.query,
            params: req.params
        });
        next();
    } catch (error: any) {
        if (error instanceof z.ZodError) {
            const errorMessages = error.errors.map((issue: any) => (`${issue.message}`))
            res.status(STATUS_CODES.CLIENT_ERRORS.BAD_REQUEST).json({
                success: false,
                message: errorMessages
            });
            return;
        } else {
            res.status(STATUS_CODES.SERVER_ERRORS.INTERNAL_SERVER_ERROR).send({
                success: false,
                message: "Server Error! Please Try Again"
            });
            return;
        }
    }
}

export default validate;
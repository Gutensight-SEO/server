"use strict";
/** @format */
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("@/constants");
const zod_1 = require("zod");
const validate = (schema) => async (req, res, next) => {
    try {
        schema.parse({
            body: req.body,
            query: req.query,
            params: req.params
        });
        return next();
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            const errorMessages = error.errors.map((issue) => (`${issue.message}`));
            res.status(constants_1.STATUS_CODES.CLIENT_ERRORS.BAD_REQUEST).json({
                success: false,
                message: errorMessages
            });
            return;
        }
        else {
            res.status(constants_1.STATUS_CODES.SERVER_ERRORS.INTERNAL_SERVER_ERROR).send({
                success: false,
                message: "Server Error! Please Try Again"
            });
            return;
        }
    }
};
exports.default = validate;

"use strict";
/** @format */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const monitoring_1 = require("../../monitoring");
const joi_1 = __importDefault(require("joi"));
const userValidationSchema = joi_1.default.object({
    firstname: joi_1.default.string().min(2).max(12).required(),
    lastname: joi_1.default.string().min(2).max(12).required(),
    username: joi_1.default.string().min(2).max(12).required(),
    email: joi_1.default.string().min(5).max(50).required().email({
        minDomainSegments: 2,
        tlds: { allow: ["com", "net", "org", "edu"] },
    }),
    password: joi_1.default.string()
        .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})"))
        .required(),
    confirmPassword: joi_1.default.string()
        .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})"))
        .required(),
});
const userValidator = async (body) => {
    try {
        await userValidationSchema.validateAsync(body);
        return;
        // next();
    }
    catch (error) {
        monitoring_1.Logs.error("User Validator Error:", error);
        // return next({
        //     status: 406,
        //     message: (error as any).details[0].message
        // })
        return error;
    }
};
exports.default = userValidator;

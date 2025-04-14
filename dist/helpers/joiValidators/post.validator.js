"use strict";
/** @format */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePostValidator = exports.newPostValidator = void 0;
const joi_1 = __importDefault(require("joi"));
const monitoring_1 = require("@/monitoring");
const newPostValidationSchema = joi_1.default.object({
    title: joi_1.default.string().min(2).max(200).trim(),
    body: joi_1.default.string().min(2).max(1200).trim(),
    keywords: joi_1.default.string().trim(),
});
const updatePostValidationSchema = joi_1.default.object({
    title: joi_1.default.string().min(2).max(200).trim(),
    body: joi_1.default.string().min(2).max(1200).trim(),
    keywords: joi_1.default.string().trim(),
    state: joi_1.default.string().trim().valid("draft", "published"),
});
const newPostValidator = async (req, _res, next) => {
    try {
        const post = req.body;
        await newPostValidationSchema.validateAsync(post);
        next();
    }
    catch (error) {
        monitoring_1.Logs.error("New Post Validator Error:", error);
        return next({
            status: 406,
            message: error.details[0].message
        });
    }
};
exports.newPostValidator = newPostValidator;
const updatePostValidator = async (req, _res, next) => {
    try {
        const post = req.body;
        await updatePostValidationSchema.validateAsync(post);
        next();
    }
    catch (error) {
        monitoring_1.Logs.error("Update Post Validator Error:", error);
        return next({
            status: 406,
            message: error.details[0].message
        });
    }
};
exports.updatePostValidator = updatePostValidator;

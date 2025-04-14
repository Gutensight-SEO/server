"use strict";
/** @format */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCommentValidator = exports.newCommentValidator = void 0;
const joi_1 = __importDefault(require("joi"));
const monitoring_1 = require("@/monitoring");
const newCommentValidationSchema = joi_1.default.object({
    body: joi_1.default.string().min(2).max(500).trim(),
});
const updateCommentValidationSchema = joi_1.default.object({
    body: joi_1.default.string().min(2).max(500).trim(),
});
const newCommentValidator = async (req, _res, next) => {
    try {
        const comment = req.body;
        await newCommentValidationSchema.validateAsync(comment);
        next();
    }
    catch (error) {
        monitoring_1.Logs.error("New Comment Validator Error:", error);
        return next({
            status: 406,
            message: error.details[0].message
        });
    }
};
exports.newCommentValidator = newCommentValidator;
const updateCommentValidator = async (req, _res, next) => {
    try {
        const comment = req.body;
        await updateCommentValidationSchema.validateAsync(comment);
        next();
    }
    catch (error) {
        monitoring_1.Logs.error("Update Comment Validator Error:", error);
        return next({
            status: 406,
            message: error.details[0].message
        });
    }
};
exports.updateCommentValidator = updateCommentValidator;

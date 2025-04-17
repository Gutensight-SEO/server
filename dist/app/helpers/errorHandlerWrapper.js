"use strict";
/** @format */
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandlerWrapper = void 0;
const errorHandlerWrapper = (func) => {
    return async (req, res, next) => {
        try {
            await func(req, res, next);
        }
        catch (error) {
            next(error);
        }
    };
};
exports.errorHandlerWrapper = errorHandlerWrapper;

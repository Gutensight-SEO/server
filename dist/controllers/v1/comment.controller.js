"use strict";
/** @format */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = void 0;
const helpers_1 = require("@/helpers");
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const registerUserHandler = (0, express_async_handler_1.default)(async (req, res, next) => {
    try {
    }
    catch (error) {
    }
});
exports.register = (0, helpers_1.errorHandlerWrapper)(registerUserHandler);

"use strict";
/** @format */
Object.defineProperty(exports, "__esModule", { value: true });
const controllers_1 = require("@/controllers");
const express_1 = require("express");
const streamingRouter = (0, express_1.Router)();
// get status
streamingRouter.get("/status/:correlationId", controllers_1.getStreamingResult);
exports.default = streamingRouter;

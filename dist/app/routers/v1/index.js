"use strict";
/** @format */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_router_1 = __importDefault(require("./auth.router"));
const user_router_1 = __importDefault(require("./user.router"));
// import postRouter from "./post.router";
const comment_router_1 = __importDefault(require("./comment.router"));
const notification_router_1 = __importDefault(require("./notification.router"));
const streaming_router_1 = __importDefault(require("./streaming.router"));
// import apiKeyRouter from "./key.router";
const analysis_router_1 = __importDefault(require("./analysis.router"));
const subscriptionPlan_router_1 = __importDefault(require("./subscriptionPlan.router"));
// import paymentRouter from "./payment.router";
const subscription_router_1 = __importDefault(require("./subscription.router"));
const middlewares_1 = require("../../middlewares");
const express_1 = require("express");
const v1Router = (0, express_1.Router)();
// No auth middleware for auth routes
v1Router.use("/auth", auth_router_1.default);
// Auth middleware for protected routes
v1Router.use("/user", middlewares_1.authMiddleware, user_router_1.default);
// v1Router.use("/post", authMiddleware, postRouter);
v1Router.use("/comment", middlewares_1.authMiddleware, comment_router_1.default);
v1Router.use("/notification", middlewares_1.authMiddleware, notification_router_1.default);
v1Router.use("/streaming", streaming_router_1.default);
v1Router.use("/analyze", middlewares_1.authMiddleware, analysis_router_1.default);
v1Router.use("/subscription-plan", middlewares_1.authMiddleware, subscriptionPlan_router_1.default);
v1Router.use("/subscription", middlewares_1.authMiddleware, subscription_router_1.default);
// v1Router.use("/payment", authMiddleware, paymentRouter);
// v1Router.use("/api-keys", authMiddleware, apiKeyRouter);
exports.default = v1Router;

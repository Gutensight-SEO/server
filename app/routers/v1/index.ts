/** @format */


import authRouter from "./auth.router";
import userRouter from "./user.router";
import postRouter from "./post.router";
import commentRouter from "./comment.router";
import notificationRouter from "./notification.router";
import streamingRouter from "./streaming.router";
// import apiKeyRouter from "./key.router";
import analysisRouter from "./analysis.router";
import subscriptionPlanRouter from "./subscriptionPlan.router";
// import paymentRouter from "./payment.router";
import subscriptionRouter from "./subscription.router";
import { authMiddleware, authorizationMiddleware } from "@/middlewares";
import { Router } from "express";


const v1Router = Router();

// No auth middleware for auth routes
v1Router.use("/auth", authRouter);

// Auth middleware for protected routes
v1Router.use("/user", authMiddleware, userRouter);
v1Router.use("/post", authMiddleware, postRouter);
v1Router.use("/comment", authMiddleware, commentRouter);
v1Router.use("/notification", authMiddleware, notificationRouter);
v1Router.use("/streaming", streamingRouter)
v1Router.use("/analyze", authMiddleware, analysisRouter);
v1Router.use("/subscription-plan", authMiddleware, subscriptionPlanRouter)
v1Router.use("/subscription", authMiddleware, subscriptionRouter);
// v1Router.use("/payment", authMiddleware, paymentRouter);
// v1Router.use("/api-keys", authMiddleware, apiKeyRouter);


export default v1Router;
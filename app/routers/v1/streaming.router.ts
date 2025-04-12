/** @format */


import { getStreamingResult } from "@/controllers";
import { Router } from "express";


const streamingRouter = Router();

// get status
streamingRouter.get("/status/:correlationId", getStreamingResult);


export default streamingRouter;

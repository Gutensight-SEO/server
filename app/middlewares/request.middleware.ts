/** @format */


import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import { Validators } from "@/helpers";
import { Logs } from "@/monitoring";
// import { STATUS_CODES } from "@/constants";

dotenv.config();


const formatRequestData = (req: Request) => ({
    url: `${req.protocol}://${req.hostname}:${process.env.PORT}${req.url}`,
    params: req.params,
    query: req.query,
    body: req.body,
});

export const routerMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        if (req.path === "/health") {
            return next()
        }

        const ipValidation = Validators.IpValidation.validateIp(req.ip);
        const clientInfo = ipValidation.isValid 
            ? await Validators.IpValidation.validateClientIp(req.ip) 
            : { error: ipValidation.reason }

        Logs.group(
            "Router Middleware Group Logs:", {
            title: "New Request",
            descriptions: [
                { description: "URL", info: formatRequestData(req).url },
                { description: "PARAMS", info: formatRequestData(req).params },
                { description: "QUERY", info: formatRequestData(req).query },
                {
                    description: "BODY",
                    info: JSON.stringify(formatRequestData(req).body, null, 2)
                },
                {
                    description: "CLIENTINFO",
                    info: JSON.stringify(clientInfo, null, 2)
                }
            ]
        });

        next();
    } catch (error) {
        Logs.error("Router Middleware Error:", error);
        next(error);
    }
}
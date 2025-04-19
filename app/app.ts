/** @format */


// import modules
import express, { Express, Request, Response, NextFunction } from "express";
import responseTime from "response-time";
import cors from "cors";
// import xss from "xss-clean";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import morgan from "morgan";
import dotenv from "dotenv";

// import logs and metrics
import Logger from "./monitoring/logger";
import Logs from "./monitoring/local/logs";
import { Metrics, Prometheus } from "./monitoring";
import { errorHandlerMiddleware, routerMiddleware } from "./middlewares";

import "./types/global.type";

// import routes
import router from "./routers";

// setups
dotenv.config();

const app: Express = express();

// set up elk stack
const logger = Logger();

// configure app level middleware
app.use(cors({
    origin: [process.env.CLIENT_URL!, 'http://localhost:5173', 'https://gutensight-seo.netlify.app'],
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(helmet());
// app.use(xss());
app.use(mongoSanitize());
app.use(morgan("dev"));
app.use(routerMiddleware);
app.use(errorHandlerMiddleware);
app.use((req: Request, res: Response, next: NextFunction) => {
    req.logger = logger;
    next();
})
// local metrics
app.use(
    responseTime((req: Request, res: Response, time: number) => { 
        if (req?.route?.path) {
            Metrics.restResponseTimeHistogram.observe(
                {
                    method: req.method,
                    route: req.route.path,
                    status_code: req.statusCode,
                },
                time * 1000 // Now valid as 'time' is primitive number
            )
        }
    })
);

// app.set('trust proxy', 1); // Trust first proxy

// // Example Express.js middleware
// app.use((req: Request, res: Response, next: NextFunction) => {
//     res.header('Access-Control-Allow-Origin', process.env.CLIENT_URL!);
//     res.header('Access-Control-Allow-Credentials', 'true');
//     next();
// });

// configure routes
app.use("/api", router);

app.get("/health", (_req: Request, res: Response) => {
    res.send({
        success: true,
        message: "Server Healthy!"
    })
})

// elk stack metrics
app.get("/metrics", async (_req: Request, res: Response) => {
    try {
        res.set("Content-Type", Prometheus.Metrics.register.contentType);
        res.end(await Prometheus.Metrics.register.metrics());
    } catch (error) {
        // console.error(error)
        Logs.error("Server Metrics Error:", error);
    }
})

// catch all router
app.use("*", (req: Request, res: Response) => {
    res.status(404).json({
        success: false,
        message: "Resource Not Found!"
    })
});

// error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    logger.error(err.stack);
    Logs.error("Error Handling Middleware Error - Stack:", err.stack);
    Logs.error("Error Handling Middleware Error - Message:", err.message);
    res.status(500).json({
        success: false,
        message: "Server Error!"
    })
})


export default app;
/** @format */


import express, { Express, Request, Response } from "express";
import client from "prom-client";
import Logs from "./logs";

const app: Express = express();

export const restResponseTimeHistogram = new client.Histogram({
    name: "rest_response_time_duration_seconds",
    help: "MERN_TEMPLATE_API response time in seconds",
    labelNames: ["method", "route", "status_code"],
});

export const databaseResponseTimeHistogram = new client.Histogram({
    name: "db_response_time_duration_seconds",
    help: "MERN_TEMPLATE_API_DB response time in seconds",
    labelNames: ["operation", "success"],
});

export function startServerMetrics() {
    
    const register = new client.Registry();

    register.registerMetric(restResponseTimeHistogram);
    register.registerMetric(databaseResponseTimeHistogram);

    register.setDefaultLabels({
        app: "MEN_TEMPLATE_API-LOCAL_METRICS"
    });
    
    client.collectDefaultMetrics({ register });

    app.get("/metrics", async (_req: Request, res: Response) => {
        res.set("Content-Type", register.contentType);

        res.end(await register.metrics());
    })

    const port = 9100;

    app.listen(port, () => {
        Logs.success("Connection successful", `Metrics server started on port ${port}`)
    })
}
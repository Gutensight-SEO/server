"use strict";
/** @format */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.databaseResponseTimeHistogram = exports.restResponseTimeHistogram = void 0;
exports.startServerMetrics = startServerMetrics;
const express_1 = __importDefault(require("express"));
const prom_client_1 = __importDefault(require("prom-client"));
const logs_1 = __importDefault(require("./logs"));
const app = (0, express_1.default)();
exports.restResponseTimeHistogram = new prom_client_1.default.Histogram({
    name: "rest_response_time_duration_seconds",
    help: "MERN_TEMPLATE_API response time in seconds",
    labelNames: ["method", "route", "status_code"],
});
exports.databaseResponseTimeHistogram = new prom_client_1.default.Histogram({
    name: "db_response_time_duration_seconds",
    help: "MERN_TEMPLATE_API_DB response time in seconds",
    labelNames: ["operation", "success"],
});
function startServerMetrics() {
    const register = new prom_client_1.default.Registry();
    register.registerMetric(exports.restResponseTimeHistogram);
    register.registerMetric(exports.databaseResponseTimeHistogram);
    register.setDefaultLabels({
        app: "MEN_TEMPLATE_API-LOCAL_METRICS"
    });
    prom_client_1.default.collectDefaultMetrics({ register });
    app.get("/metrics", async (_req, res) => {
        res.set("Content-Type", register.contentType);
        res.end(await register.metrics());
    });
    const port = 9100;
    app.listen(port, () => {
        logs_1.default.success("Connection successful", `Metrics server started on port ${port}`);
    });
}

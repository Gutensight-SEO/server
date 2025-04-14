"use strict";
/** @format */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// import modules
const express_1 = __importDefault(require("express"));
const response_time_1 = __importDefault(require("response-time"));
const cors_1 = __importDefault(require("cors"));
// import xss from "xss-clean";
const helmet_1 = __importDefault(require("helmet"));
const express_mongo_sanitize_1 = __importDefault(require("express-mongo-sanitize"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
// import logs and metrics
const logger_1 = __importDefault(require("./monitoring/logger"));
const logs_1 = __importDefault(require("./monitoring/local/logs"));
const monitoring_1 = require("./monitoring");
const middlewares_1 = require("./middlewares");
require("./types/global.type");
// import routes
const routers_1 = __importDefault(require("./routers"));
// setups
dotenv_1.default.config();
const app = (0, express_1.default)();
// set up elk stack
const logger = (0, logger_1.default)();
// configure app level middleware
app.use((0, cors_1.default)({
    origin: [process.env.CLIENT_URL || ''],
    credentials: true,
}));
app.use(express_1.default.json());
app.use((0, helmet_1.default)());
// app.use(xss());
app.use((0, express_mongo_sanitize_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use((0, morgan_1.default)("dev"));
app.use(middlewares_1.routerMiddleware);
app.use(middlewares_1.errorHandlerMiddleware);
app.use((req, res, next) => {
    req.logger = logger;
    next();
});
// local metrics
app.use((0, response_time_1.default)((req, res, time) => {
    var _a;
    if ((_a = req === null || req === void 0 ? void 0 : req.route) === null || _a === void 0 ? void 0 : _a.path) {
        monitoring_1.Metrics.restResponseTimeHistogram.observe({
            method: req.method,
            route: req.route.path,
            status_code: req.statusCode,
        }, time * 1000);
    }
}));
// configure routes
app.use("/api", routers_1.default);
app.get("/health", (_req, res) => {
    res.send({
        success: true,
        message: "Server Healthy!"
    });
});
// elk stack metrics
app.get("/metrics", async (_req, res) => {
    try {
        res.set("Content-Type", monitoring_1.Prometheus.Metrics.register.contentType);
        res.end(await monitoring_1.Prometheus.Metrics.register.metrics());
    }
    catch (error) {
        // console.error(error)
        logs_1.default.error("Server Metrics Error:", error);
    }
});
// catch all router
app.use("*", (req, res) => {
    res.status(404).json({
        success: false,
        message: "Resource Not Found!"
    });
});
// error handling middleware
app.use((err, req, res, next) => {
    logger.error(err.stack);
    logs_1.default.error("Error Handling Middleware Error - Stack:", err.stack);
    logs_1.default.error("Error Handling Middleware Error - Message:", err.message);
    res.status(500).json({
        success: false,
        message: "Server Error!"
    });
});
exports.default = app;

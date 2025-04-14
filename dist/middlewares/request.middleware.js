"use strict";
/** @format */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.routerMiddleware = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const helpers_1 = require("@/helpers");
const monitoring_1 = require("@/monitoring");
dotenv_1.default.config();
const formatRequestData = (req) => ({
    url: `${req.protocol}://${req.hostname}:${process.env.PORT}${req.url}`,
    params: req.params,
    query: req.query,
    body: req.body,
});
const routerMiddleware = async (req, res, next) => {
    try {
        if (req.path === "/health") {
            return next();
        }
        const ipValidation = helpers_1.Validators.IpValidation.validateIp(req.ip);
        const clientInfo = ipValidation.isValid
            ? await helpers_1.Validators.IpValidation.validateClientIp(req.ip)
            : { error: ipValidation.reason };
        monitoring_1.Logs.group("Router Middleware Group Logs:", {
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
    }
    catch (error) {
        monitoring_1.Logs.error("Router Middleware Error:", error);
        next(error);
    }
};
exports.routerMiddleware = routerMiddleware;

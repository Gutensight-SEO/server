"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.activityLogger = void 0;
const activityLog_model_1 = __importDefault(require("../models/activityLog.model"));
const activityLogger = (action) => {
    return async (req, res, next) => {
        const originalSend = res.send;
        res.send = function (body) {
            var _a;
            activityLog_model_1.default.create({
                userId: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id,
                action,
                details: {
                    method: req.method,
                    path: req.path,
                    body: req.body,
                    response: body
                },
                ipAddress: req.ip,
                userAgent: req.get('user-agent')
            }).catch(console.error);
            return originalSend.call(this, body);
        };
        next();
    };
};
exports.activityLogger = activityLogger;

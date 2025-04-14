"use strict";
/** @format */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postCount = exports.userCount = exports.requestCount = exports.register = void 0;
const prom_client_1 = __importDefault(require("prom-client"));
// create a registry which registers the metrics
const register = new prom_client_1.default.Registry();
exports.register = register;
const requestCount = new prom_client_1.default.Counter({
    name: "node_request_operations_total",
    help: "The total number of processed requests",
});
exports.requestCount = requestCount;
const userCount = new prom_client_1.default.Counter({
    name: "users_count",
    help: "Number of registered users",
});
exports.userCount = userCount;
const postCount = new prom_client_1.default.Counter({
    name: "posts_count",
    help: "Number of posts posted / replied to"
});
exports.postCount = postCount;
register.registerMetric(requestCount);
register.registerMetric(userCount);
register.registerMetric(postCount);
// add a default label 
register.setDefaultLabels({
    app: "MERN_TEMPLATE_API",
});
// enable the collection of default metrics
prom_client_1.default.collectDefaultMetrics({ register });

"use strict";
/** @format */
Object.defineProperty(exports, "__esModule", { value: true });
exports.server_version = exports.server_url = void 0;
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
exports.server_url = process.env.SERVER_URL;
exports.server_version = process.env.SERVER_VERSION;

"use strict";
/** @format */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateToken = (id, option) => {
    switch (option) {
        case 'access':
            return jsonwebtoken_1.default.sign({ id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "7d", });
            break; // leaving this cause i am paranoid.
        case 'refresh':
            return jsonwebtoken_1.default.sign({ id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "30d", });
            break;
        case 'email':
            return jsonwebtoken_1.default.sign({ id }, process.env.EMAIL_CONFIRMATION_TOKEN_SECRET, { expiresIn: "1d", });
            break;
        case 'forgot_password':
            return jsonwebtoken_1.default.sign({ id }, process.env.FORGOT_PASSWORD_TOKEN_SECRET, { expiresIn: "30m", });
            break;
        default:
            return null;
        // break;
    }
};
exports.default = generateToken;

"use strict";
/** @format */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const gravatar_1 = __importDefault(require("gravatar"));
const generateGravatar = (email) => {
    const avatar = gravatar_1.default.url(email, {
        protocol: 'https',
        s: '200', // size: 200*200
        r: 'PG', // rating: PG
        d: 'identicon', // default: identicon
    });
    return avatar;
};
exports.default = generateGravatar;

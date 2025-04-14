"use strict";
/** @format */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = bufferConversion;
const parser_1 = __importDefault(require("datauri/parser"));
const path_1 = __importDefault(require("path"));
const dataURIChild = new parser_1.default();
function bufferConversion(originalName, buffer) {
    const extension = path_1.default.extname(originalName);
    return dataURIChild.format(extension, buffer).content;
}

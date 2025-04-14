"use strict";
/** @format */
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCommentSchema = exports.updateCommentSchema = exports.getCommentSchema = exports.createCommentSchema = void 0;
const zod_1 = require("zod");
const payload = {
    body: (0, zod_1.object)({
        body: (0, zod_1.string)({
            required_error: "Comment body is required",
        }).min(2, "Title must be at least 2 characters long").max(500, "Title can not be more than 500 characters long"),
        reference: (0, zod_1.string)({
            required_error: "Reference ID is required"
        })
    }),
};
const params = {
    params: (0, zod_1.object)({
        commentId: (0, zod_1.string)({
            required_error: "Comment ID is required"
        })
    })
};
exports.createCommentSchema = (0, zod_1.object)(Object.assign({}, payload));
exports.getCommentSchema = (0, zod_1.object)(Object.assign({}, params));
exports.updateCommentSchema = (0, zod_1.object)(Object.assign(Object.assign({}, payload), params));
exports.deleteCommentSchema = (0, zod_1.object)(Object.assign({}, params));

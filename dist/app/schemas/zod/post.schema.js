"use strict";
/** @format */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPostsSchema = exports.deletePostSchema = exports.updatePostSchema = exports.getPostSchema = exports.createPostSchema = void 0;
const zod_1 = require("zod");
const payload = {
    body: (0, zod_1.object)({
        title: (0, zod_1.string)({
            required_error: "Title is required",
        }).min(2, "Title must be at least 2 characters long").max(200, "Title can not be more than 200 characters long"),
        body: (0, zod_1.string)({
            required_error: "Body is required",
        }).min(2, "First name must be at least 2 characters long").max(1200, "First name can not be more than 1200 characters long"),
        // commentCount: number({
        //     required_error: "Comment count is required"
        // }),
    }),
};
const params = {
    params: (0, zod_1.object)({
        postId: (0, zod_1.string)({
            required_error: "Post ID is required"
        })
    })
};
exports.createPostSchema = (0, zod_1.object)(Object.assign({}, payload));
exports.getPostSchema = (0, zod_1.object)(Object.assign({}, params));
exports.updatePostSchema = (0, zod_1.object)(Object.assign(Object.assign({}, payload), params));
exports.deletePostSchema = (0, zod_1.object)(Object.assign({}, params));
exports.getPostsSchema = (0, zod_1.object)({
    params: (0, zod_1.object)({
        userId: (0, zod_1.string)({
            required_error: "User ID is required"
        })
    })
});

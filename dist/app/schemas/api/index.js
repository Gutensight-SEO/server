"use strict";
/** @format */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationSchema = exports.CommentSchema = exports.PostSchema = exports.UserSchema = void 0;
var user_schema_1 = require("./user.schema");
Object.defineProperty(exports, "UserSchema", { enumerable: true, get: function () { return __importDefault(user_schema_1).default; } });
var post_schema_1 = require("./post.schema");
Object.defineProperty(exports, "PostSchema", { enumerable: true, get: function () { return __importDefault(post_schema_1).default; } });
var comment_schema_1 = require("./comment.schema");
Object.defineProperty(exports, "CommentSchema", { enumerable: true, get: function () { return __importDefault(comment_schema_1).default; } });
var notification_schema_1 = require("./notification.schema");
Object.defineProperty(exports, "NotificationSchema", { enumerable: true, get: function () { return __importDefault(notification_schema_1).default; } });

"use strict";
/** @format */
Object.defineProperty(exports, "__esModule", { value: true });
exports.SERVER_ERRORS = exports.CLIENT_ERRORS = exports.REDIRECTED = exports.SUCCESS = void 0;
exports.SUCCESS = Object.freeze({
    OK: 200,
    CREATED: 201,
    ACCEPTED: 202,
});
exports.REDIRECTED = Object.freeze({
    REDIRECTED: 300
});
exports.CLIENT_ERRORS = Object.freeze({
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    NOT_FOUND: 404,
});
exports.SERVER_ERRORS = Object.freeze({
    INTERNAL_SERVER_ERROR: 500,
    NOT_IMPLEMENTED: 501,
});

"use strict";
/** @format */
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizationMiddleware = void 0;
const constants_1 = require("@/constants");
// import { ZodSchema } from "@/schemas";
// import { UserDocument } from "@/models";
const authorizationMiddleware = (req, res, next) => {
    const user = req.user;
    const profileId = req.params.profileId;
    if (!user || !profileId || String(user.id) !== profileId) {
        res.status(constants_1.STATUS_CODES.CLIENT_ERRORS.UNAUTHORIZED).json({
            success: false,
            message: "Access Denied"
        });
        return;
    }
    next();
};
exports.authorizationMiddleware = authorizationMiddleware;

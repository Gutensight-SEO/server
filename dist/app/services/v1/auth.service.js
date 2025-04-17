"use strict";
/** @format */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const models_1 = require("../../models");
const monitoring_1 = require("../../monitoring");
const utils_1 = require("../../utils");
const constants_1 = require("../../constants");
const lodash_1 = require("lodash");
const crypto_1 = __importDefault(require("crypto"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const register = async ({ firstname, lastname, username, email, password, role }) => {
    try {
        const foundUsername = await models_1.UserModel.find({ username });
        if (foundUsername.length > 0) {
            return {
                statusCode: constants_1.STATUS_CODES.CLIENT_ERRORS.BAD_REQUEST,
                errMessage: "Username already taken",
            };
        }
        const foundEmail = await models_1.UserModel.find({ email });
        if (foundEmail.length > 0)
            return {
                statusCode: constants_1.STATUS_CODES.CLIENT_ERRORS.BAD_REQUEST,
                errMessage: "Email already taken",
            };
        const salt = await bcryptjs_1.default.genSalt(12);
        const hashPassword = await bcryptjs_1.default.hash(password, salt);
        const newUser = await models_1.UserModel.create({
            firstname,
            lastname,
            username,
            email,
            password: hashPassword,
            role: role
        });
        if (newUser) {
            // create free subscription
            const subscriptionPlan = await models_1.SubscriptionPlanModel.findOne({
                name: "Free Tier",
                isFreetier: true
            });
            if (!subscriptionPlan) {
                await models_1.UserModel.findByIdAndDelete(newUser._id);
                return {
                    statusCode: constants_1.STATUS_CODES.CLIENT_ERRORS.NOT_FOUND,
                    errMessage: "Subscription plan not found"
                };
            }
            // Generate API credentials
            const apiKey = crypto_1.default.randomBytes(16).toString('hex');
            const apiSecret = crypto_1.default.randomBytes(32).toString('hex');
            // hash api keys 
            const key_hash = (0, utils_1.encryptApiKey)(apiKey);
            // Calculate dates
            const startDate = new Date();
            const endDate = new Date();
            endDate.setDate(endDate.getDate() + subscriptionPlan.durationDays);
            const subscription = await models_1.SubscriptionModel.create({
                userId: newUser._id,
                subscriptionPlanId: subscriptionPlan._id,
                apiKey: key_hash,
                startDate,
                endDate,
                totalApiRequests: subscriptionPlan.apiRequestQuota,
                remainingApiRequests: subscriptionPlan.apiRequestQuota,
                paymentId: "Free Tier"
            });
            if (subscription) {
                // add free tier subscripton to user record
                newUser.subscription.push(String(subscriptionPlan._id));
                await newUser.save();
                const savedApiKeys = await models_1.ApiKeyModel.create({
                    subscription_name: subscriptionPlan.name,
                    subscription_id: String(subscription._id),
                    key_hash,
                    user_id: String(newUser._id),
                    requests_remaining: subscriptionPlan.apiRequestQuota,
                    created_at: new Date(),
                });
                if (savedApiKeys)
                    return {
                        statusCode: constants_1.STATUS_CODES.SUCCESS.CREATED,
                        message: "Registration successful",
                        data: (0, lodash_1.omit)(newUser.toJSON(), "password", "__v"),
                    };
                else {
                    await models_1.UserModel.findByIdAndDelete(newUser._id);
                    await models_1.SubscriptionModel.findByIdAndDelete(subscription._id);
                    return {
                        statusCode: constants_1.STATUS_CODES.CLIENT_ERRORS.BAD_REQUEST,
                        errMessage: "Registration Failed",
                    };
                }
            }
            else {
                await models_1.UserModel.findByIdAndDelete(newUser._id);
                return {
                    statusCode: constants_1.STATUS_CODES.CLIENT_ERRORS.BAD_REQUEST,
                    errMessage: "Registration Failed",
                };
            }
        }
        else {
            return {
                statusCode: constants_1.STATUS_CODES.CLIENT_ERRORS.BAD_REQUEST,
                errMessage: "Registration Failed",
            };
        }
    }
    catch (error) {
        monitoring_1.Logs.error("Register Service Error:", error);
        return null;
    }
};
exports.register = register;
const login = async ({ detail, password }) => {
    try {
        const users = await models_1.UserModel.find({ $or: [{ username: detail }, { email: detail }] });
        const foundUser = users[0];
        if (!foundUser) {
            return {
                statusCode: constants_1.STATUS_CODES.CLIENT_ERRORS.BAD_REQUEST,
                errMessage: "Account Not Found",
            };
        }
        const validatedUser = await bcryptjs_1.default.compare(password, foundUser.password);
        if (!validatedUser)
            return {
                statusCode: constants_1.STATUS_CODES.CLIENT_ERRORS.BAD_REQUEST,
                errMessage: "Invalid Login Details",
            };
        try {
            // generate tokens
            const accessToken = (0, utils_1.GenerateToken)(foundUser._id, "access");
            const refreshToken = (0, utils_1.GenerateToken)(foundUser._id, "refresh");
            if (!accessToken || !refreshToken) {
                return {
                    statusCode: constants_1.STATUS_CODES.CLIENT_ERRORS.BAD_REQUEST,
                    errMessage: "Token generation failed",
                };
            }
            foundUser.refreshToken = refreshToken;
            await foundUser.save();
            const user = (0, lodash_1.omit)(foundUser.toJSON(), "password", "__v", "refreshToken");
            return { accessToken, refreshToken, user };
        }
        catch (error) {
            monitoring_1.Logs.error("Login Service Error - Client Error:", error);
            return {
                statusCode: constants_1.STATUS_CODES.CLIENT_ERRORS.BAD_REQUEST,
                errMessage: "Error Occurred",
            };
        }
    }
    catch (error) {
        monitoring_1.Logs.error("Login Service Error - Server Error:", error);
        return null;
    }
};
exports.login = login;

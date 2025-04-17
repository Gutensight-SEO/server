"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeDefaults = initializeDefaults;
const constants_1 = require("../constants");
const models_1 = require("../models");
const monitoring_1 = require("../monitoring");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const dotenv_1 = __importDefault(require("dotenv"));
const crypto_1 = __importDefault(require("crypto"));
const utils_1 = require("../utils");
const lodash_1 = require("lodash");
dotenv_1.default.config();
const defaultAdmin = {
    firstname: process.env.FIRSTNAME,
    lastname: process.env.LASTNAME,
    username: process.env.USERNAME,
    email: process.env.EMAIL,
    password: process.env.PASSWORD,
    role: "admin"
};
const subscriptionPlans = [
    {
        name: "Free Tier",
        description: "This GutensightSEO's Free Plan allows for a maximum of 100 API requests to our Analytics Server per year",
        priceUSD: 0,
        apiRequestQuota: 100,
        durationDays: 365,
        isActive: true,
        isFreetier: true,
        paymentLink: 'none',
    },
    {
        name: "Special Plan",
        description: "This GutensightSEO's Special Plan allows for a maximum of 1000000 API requests to our Analytics Server per year. It is for marketing, administrative, and adoption purposes",
        priceUSD: 0,
        apiRequestQuota: 1000000,
        durationDays: 365,
        isActive: true,
        isFreetier: true,
        paymentLink: 'none',
    },
    {
        name: "Admin Plan",
        description: "Administrative plan with high API quota",
        priceUSD: 0,
        apiRequestQuota: 10000000000,
        durationDays: 365,
        isActive: true,
        isFreetier: true,
        paymentLink: 'none',
    },
    {
        name: "Basic Plan",
        description: "This GutensightSEO's Basic Plan allows for a maximum of 5000 API requests to our Analytics Server per year.",
        priceUSD: 10,
        apiRequestQuota: 5000,
        durationDays: 365,
        isActive: true,
        isFreetier: false,
        paymentLink: process.env.NODE_ENV === "production" ? process.env.PAYMENT_LINK_BASIC_LIVE : process.env.PAYMENT_LINK_BASIC_TEST,
    },
    {
        name: "Starter Plan",
        description: "This GutensightSEO's Starter Plan allows for a maximum of 50000 API requests to our Analytics Server per year.",
        priceUSD: 100,
        apiRequestQuota: 50000,
        durationDays: 365,
        isActive: true,
        isFreetier: false,
        paymentLink: process.env.NODE_ENV === "production" ? process.env.PAYMENT_LINK_STARTER_LIVE : process.env.PAYMENT_LINK_STARTER_TEST,
    },
    {
        name: "Corporate Plan",
        description: "This GutensightSEO's Corporate Plan allows for a maximum of 1000000 API requests to our Analytics Server per year.",
        priceUSD: 1000,
        apiRequestQuota: 1000000,
        durationDays: 365,
        isActive: true,
        isFreetier: false,
        paymentLink: process.env.NODE_ENV === "production" ? process.env.PAYMENT_LINK_CORPORATE_LIVE : process.env.PAYMENT_LINK_CORPORATE_TEST,
    },
];
async function initializeDefaults() {
    try {
        // Check and create default subscription plans
        for (const plan of subscriptionPlans) {
            const existingPlan = await models_1.SubscriptionPlanModel.findOne({ name: plan.name });
            if (!existingPlan) {
                await models_1.SubscriptionPlanModel.create(plan);
                monitoring_1.Logs.info("Initial Setup -", `Created subscription plan: ${plan.name}`);
            }
        }
        // Check and create admin user
        const adminExists = await models_1.UserModel.findOne({ email: defaultAdmin.email });
        if (!adminExists) {
            const salt = await bcryptjs_1.default.genSalt(12);
            const hashPassword = await bcryptjs_1.default.hash(defaultAdmin.password, salt);
            const admin = await models_1.UserModel.create(Object.assign(Object.assign({}, defaultAdmin), { password: hashPassword }));
            if (admin) {
                // create free subscription
                const subscriptionPlan = await models_1.SubscriptionPlanModel.findOne({
                    name: "Admin Plan",
                    isFreetier: true
                });
                if (!subscriptionPlan) {
                    await models_1.UserModel.findByIdAndDelete(admin._id);
                    return {
                        statusCode: constants_1.STATUS_CODES.CLIENT_ERRORS.NOT_FOUND,
                        errMessage: "Subscription plan not found"
                    };
                }
                // Generate API credentials
                const apiKey = crypto_1.default.randomBytes(16).toString('hex');
                const apiSecret = crypto_1.default.randomBytes(32).toString('hex');
                // encrypt api keys 
                const key_hash = (0, utils_1.encryptApiKey)(apiKey);
                // Calculate dates
                const startDate = new Date();
                const endDate = new Date();
                endDate.setFullYear(endDate.getFullYear() + subscriptionPlan.durationDays * 100);
                const subscription = await models_1.SubscriptionModel.create({
                    userId: admin._id,
                    subscriptionPlanId: subscriptionPlan._id,
                    apiKey: key_hash,
                    startDate,
                    endDate,
                    totalApiRequests: subscriptionPlan.apiRequestQuota,
                    remainingApiRequests: subscriptionPlan.apiRequestQuota,
                    paymentId: "Admin Tier"
                });
                if (subscription) {
                    // add free tier subscripton to user record
                    admin.subscription.push(String(subscriptionPlan._id));
                    await admin.save();
                    const savedApiKeys = await models_1.ApiKeyModel.create({
                        subscription_name: subscriptionPlan.name,
                        subscription_id: String(subscription._id),
                        key_hash,
                        user_id: String(admin._id),
                        requests_remaining: subscriptionPlan.apiRequestQuota,
                        created_at: new Date(),
                    });
                    if (savedApiKeys)
                        return {
                            statusCode: constants_1.STATUS_CODES.SUCCESS.CREATED,
                            message: "Registration successful",
                            data: (0, lodash_1.omit)(admin.toJSON(), "password", "__v"),
                        };
                    else {
                        await models_1.UserModel.findByIdAndDelete(admin._id);
                        await models_1.SubscriptionModel.findByIdAndDelete(subscription._id);
                        return {
                            statusCode: constants_1.STATUS_CODES.CLIENT_ERRORS.BAD_REQUEST,
                            errMessage: "Registration Failed",
                        };
                    }
                }
                else {
                    await models_1.UserModel.findByIdAndDelete(admin._id);
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
            // Logs.info("Success", "Created default admin user");
        }
    }
    catch (error) {
        monitoring_1.Logs.error("Error initializing defaults:", error);
    }
}

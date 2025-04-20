import { STATUS_CODES } from "@/constants";
import { UserModel, SubscriptionPlanModel, SubscriptionModel, ApiKeyModel } from "@/models";
import { Logs } from "@/monitoring";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import crypto from "crypto";
import { encryptApiKey } from "@/utils";
import { omit } from "lodash";


dotenv.config();

const defaultAdmin = {
    firstname: process.env.FIRSTNAME!,
    lastname: process.env.LASTNAME!,
    username: process.env.USERNAME!,
    email: process.env.EMAIL!,
    password: process.env.PASSWORD!,
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
        paymentLink: process.env.NODE_ENV! === "production" ? process.env.PAYMENT_LINK_BASIC_LIVE! : process.env.PAYMENT_LINK_BASIC_TEST!,
    },
    {
        name: "Starter Plan",
        description: "This GutensightSEO's Starter Plan allows for a maximum of 50000 API requests to our Analytics Server per year.",
        priceUSD: 100,
        apiRequestQuota: 50000,
        durationDays: 365,
        isActive: true,
        isFreetier: false,
        paymentLink: process.env.NODE_ENV! === "production" ? process.env.PAYMENT_LINK_STARTER_LIVE! : process.env.PAYMENT_LINK_STARTER_TEST!,
    },
    {
        name: "Corporate Plan",
        description: "This GutensightSEO's Corporate Plan allows for a maximum of 1000000 API requests to our Analytics Server per year.",
        priceUSD: 1000,
        apiRequestQuota: 1000000,
        durationDays: 365,
        isActive: true,
        isFreetier: false,
        paymentLink: process.env.NODE_ENV! === "production" ? process.env.PAYMENT_LINK_CORPORATE_LIVE! : process.env.PAYMENT_LINK_CORPORATE_TEST!,
    },
];

export async function initializeDefaults() {
    try {
        // Check and create default subscription plans
        for (const plan of subscriptionPlans) {
            const existingPlan = await SubscriptionPlanModel.findOne({ name: plan.name });
            if (!existingPlan) {
                await SubscriptionPlanModel.create(plan);
                Logs.info("Initial Setup -", `Created subscription plan: ${plan.name}`);
            }
        }

        // Check and create admin user
        const adminExists = await UserModel.findOne({ email: defaultAdmin.email });
        if (!adminExists) {
            const salt = await bcrypt.genSalt(12);
            const hashPassword = await bcrypt.hash(defaultAdmin.password, salt);
            
            const admin = await UserModel.create({
                ...defaultAdmin,
                password: hashPassword
            });

            if (admin) {
                // create free subscription
                const subscriptionPlan = await SubscriptionPlanModel.findOne({ 
                    name: "Admin Plan",
                    isFreetier: true
                    });
    
                if (!subscriptionPlan) {
                    await UserModel.findByIdAndDelete(admin._id);
                    return {
                        statusCode: STATUS_CODES.CLIENT_ERRORS.NOT_FOUND,
                        errMessage: "Subscription plan not found"
                    };
                }
    
                // Generate API credentials
                const apiKey = crypto.randomBytes(16).toString('hex');
                // encrypt api key
                const key_hash = encryptApiKey(apiKey);
                
                // Calculate dates
                const startDate = new Date();
                const endDate = new Date();
                endDate.setFullYear(endDate.getFullYear() + subscriptionPlan.durationDays * 100);
    
                const subscription = await SubscriptionModel.create({
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
    
                    const savedApiKeys = await ApiKeyModel.create({
                        subscription_name: subscriptionPlan.name,
                        subscription_id: String(subscription._id),
                        key_hash,
                        user_id: String(admin._id),
                        requests_remaining: subscriptionPlan.apiRequestQuota,
                        created_at: new Date(),
                    });
    
                    if (savedApiKeys)
                        return {
                            statusCode: STATUS_CODES.SUCCESS.CREATED,
                            message: "Registration successful",
                            data: omit(admin.toJSON(), "password", "__v"),
                        };
                    else {
                        await UserModel.findByIdAndDelete(admin._id);
                        await SubscriptionModel.findByIdAndDelete(subscription._id);
    
                        return {
                            statusCode: STATUS_CODES.CLIENT_ERRORS.BAD_REQUEST,
                            errMessage: "Registration Failed",
                        };
                    }
                } else {
                    await UserModel.findByIdAndDelete(admin._id);
    
                    return {
                        statusCode: STATUS_CODES.CLIENT_ERRORS.BAD_REQUEST,
                        errMessage: "Registration Failed",
                    };
                }
    
                
            } else {
                return {
                    statusCode: STATUS_CODES.CLIENT_ERRORS.BAD_REQUEST,
                    errMessage: "Registration Failed",
                };
            }
            
            // Logs.info("Success", "Created default admin user");
        }
    } catch (error) {
        Logs.error("Error initializing defaults:", error);
    }
}

/** @format */

import { ApiKeyModel, SubscriptionModel, SubscriptionPlanModel, UserDocument, UserModel } from "@/models";
import { Logs } from "@/monitoring";
import { ZodSchema } from "@/schemas";
import { GenerateToken, encryptApiKey } from "@/utils";
import { STATUS_CODES } from "@/constants";
import { omit } from "lodash";
import crypto from "crypto";
import bcrypt from "bcryptjs";


export const register = async ({
    firstname,
    lastname,
    username,
    email,
    password,
    role
}: ZodSchema.UserSchema.CreateUserInput["body"]): Promise<UserDocument | object | null> => {
    try {
        const foundUsername = await UserModel.find({ username });
        if (foundUsername.length > 0) {
            return {
                statusCode: STATUS_CODES.CLIENT_ERRORS.BAD_REQUEST,
                errMessage: "Username already taken",
            };
        }
        const foundEmail = await UserModel.find({ email })
        if (foundEmail.length > 0) return {
            statusCode: STATUS_CODES.CLIENT_ERRORS.BAD_REQUEST,
            errMessage: "Email already taken",
        };

        const salt = await bcrypt.genSalt(12);
        const hashPassword = await bcrypt.hash(password, salt);

        const newUser = await UserModel.create({
            firstname,
            lastname,
            username,
            email,
            password: hashPassword,
            role: role
        })
        
        if (newUser) {
            // create free subscription
            const subscriptionPlan = await SubscriptionPlanModel.findOne({ 
                name: "Free Tier",
                isFreetier: true
             });

            if (!subscriptionPlan) {
                await UserModel.findByIdAndDelete(newUser._id);
                return {
                    statusCode: STATUS_CODES.CLIENT_ERRORS.NOT_FOUND,
                    errMessage: "Subscription plan not found"
                };
            }

            // Generate API credentials
            const apiKey = crypto.randomBytes(16).toString('hex');
            const apiSecret = crypto.randomBytes(32).toString('hex');
            // hash api keys 
            const key_hash = encryptApiKey(apiKey);
            const secret_hash = encryptApiKey(apiSecret);
            
            // Calculate dates
            const startDate = new Date();
            const endDate = new Date();
            endDate.setDate(endDate.getDate() + subscriptionPlan.durationDays);

            const subscription = await SubscriptionModel.create({
                userId: newUser._id,
                subscriptionPlanId: subscriptionPlan._id,
                apiKey: key_hash,
                apiSecret: secret_hash,
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

                const savedApiKeys = await ApiKeyModel.create({
                    subscription_name: subscriptionPlan.name,
                    subscription_id: String(subscription._id),
                    key_hash,
                    secret_hash,
                    user_id: String(newUser._id),
                    requests_remaining: subscriptionPlan.apiRequestQuota,
                    created_at: new Date(),
                });

                if (savedApiKeys)
                    return {
                        statusCode: STATUS_CODES.SUCCESS.CREATED,
                        message: "Registration successful",
                        data: omit(newUser.toJSON(), "password", "__v"),
                    };
                else {
                    await UserModel.findByIdAndDelete(newUser._id);
                    await SubscriptionModel.findByIdAndDelete(subscription._id);

                    return {
                        statusCode: STATUS_CODES.CLIENT_ERRORS.BAD_REQUEST,
                        errMessage: "Registration Failed",
                    };
                }
            } else {
                await UserModel.findByIdAndDelete(newUser._id);

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
    } catch (error: any) {
        Logs.error("Register Service Error:", error);
        return null;
    }
}

export const login = async ({
    detail, password
}: ZodSchema.UserSchema.LoginUserInput["body"]): Promise<{ accessToken: string; refreshToken: string; user: UserDocument } | {statusCode: number; errMessage: string} | null> => {
    try {
        const users = await UserModel.find({ $or: [{ username: detail }, { email: detail }] });
        const foundUser = users[0];

        if (!foundUser) {
            return {
                statusCode: STATUS_CODES.CLIENT_ERRORS.BAD_REQUEST,
                errMessage: "Account Not Found",
            };
        }

        const validatedUser = await bcrypt.compare(password, foundUser.password);

        if (!validatedUser) return {
            statusCode: STATUS_CODES.CLIENT_ERRORS.BAD_REQUEST,
            errMessage: "Invalid Login Details",
        }; 

        try {
            // generate tokens
            const accessToken = GenerateToken((foundUser._id as string), "access");
            const refreshToken = GenerateToken((foundUser._id as string), "refresh");

            foundUser.refreshToken = refreshToken;
            await foundUser.save();

            const user = omit(foundUser.toJSON(), "password", "__v", "refreshToken");

            return {accessToken, refreshToken, user}
        } catch (error) {
            Logs.error("Login Service Error - Client Error:", error);
            return {
                statusCode: STATUS_CODES.CLIENT_ERRORS.BAD_REQUEST,
                errMessage: "Error Occurred",
            }; 
        }
    } catch (error) {
        Logs.error("Login Service Error - Server Error:", error);
        return null;
    }
}
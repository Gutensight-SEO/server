/** @format */


import { KAFKA_TOPICS, STATUS_CODES } from "@/constants";
import { errorHandlerWrapper, Validators } from "@/helpers";
import { Logs } from "@/monitoring";
import { ZodSchema } from "@/schemas";
import { UpdateUserRequestType } from "@/types";
import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { getOrSetCache } from "@/cache";
import { userWorker } from "@/workers";
import crypto from "crypto";
import { v1Services } from "@/services";
import { producer } from "@/streaming";


const getUserHandler = asyncHandler(
    async (
        req: Request, 
        res: Response) => {
    try {
        if (!req.user) {
            res.status(STATUS_CODES.CLIENT_ERRORS.UNAUTHORIZED).json({
                success: false,
                message: "User not authenticated",
            });
            return;
        }

        const profileId = req.user.id;

        const result = await getOrSetCache(String(profileId), () => v1Services.getUser({profileId}));

        if (result !== null) {
            if (result['errMessage']) {
                res.status(result['statusCode']).json({
                    success: false,
                    message: result['errMessage'],
                })
                return;
            } else {
                res.status(STATUS_CODES.SUCCESS.OK).json({
                    success: true,
                    message: "User Profile Fetched",
                    data: result
                });
                return;
            } 
        } else {
            res.status(STATUS_CODES.CLIENT_ERRORS.BAD_REQUEST).json({
                success: false,
                message: "Fetch User Failed"
            });
            return;
        }
    } catch (error) {
        Logs.error("Get User Handler Error:", error);
        res.status(STATUS_CODES.SERVER_ERRORS.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Server Error! Please Try Again Later"
        });  
        return;      
    }
})

const getUsersHandler = asyncHandler(
    async (
        req: Request, 
        res: Response) => {
    try {
        // const user = req.user;
        // if (user.role !== 'admin') {
        //     res.status(STATUS_CODES.CLIENT_ERRORS.UNAUTHORIZED).json({
        //         success: false,
        //         message: "Unauthorized"
        //     })
        // }

        const results = await getOrSetCache('users', () => userWorker("getUsers"));

        if (results) {
            if (results['errMessage']) {
                res.status(results['statusCode']).json({
                    success: false,
                    message: results['errMessage'],
                    data: [],
                });
                return;
            } else {
                res.status(STATUS_CODES.SUCCESS.OK).json({
                    success: true,
                    message: "Users Profile Fetched",
                    data: results
                });
                return;
            } 
        } else {
            res.status(STATUS_CODES.CLIENT_ERRORS.BAD_REQUEST).json({
                success: false,
                message: "Fetching Users Failed"
            });
            return;
        }
    } catch (error) {
        Logs.error("Get Users Handler Error:", error);
        res.status(STATUS_CODES.SERVER_ERRORS.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Server Error! Please Try Again Later"
        });
        return;        
    }
})

const updateUserHandler = asyncHandler(async (req: Request, res: Response) => {
    try {
        if (!req.user) {
            res.status(STATUS_CODES.CLIENT_ERRORS.UNAUTHORIZED).json({
                success: false,
                message: "User not authenticated",
            });
            return;
        }

        const profileId = req.user.id; // Get ID from authenticated user
        const details = req.body;

        const correlationId = await producer.publish(
            KAFKA_TOPICS.UPDATE_USER,
            () => v1Services.updateUser({ profileId }, details)
        );

        res.status(STATUS_CODES.SUCCESS.ACCEPTED).json({
            success: true,
            message: "Update request received",
            correlationId
        });
    } catch (error) {
        Logs.error("Update User Ctrl Error:", error);
        res.status(STATUS_CODES.SERVER_ERRORS.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Server Error! Try Again Later"
        });
    }
});

const deleteUserHandler = asyncHandler(async (req: Request, res: Response) => {
    try {
        if (!req.user) {
            res.status(STATUS_CODES.CLIENT_ERRORS.UNAUTHORIZED).json({
                success: false,
                message: "User not authenticated",
            });
            return;
        }

        const correlationId = await producer.publish(
            KAFKA_TOPICS.DELETE_USER,
            () => v1Services.deleteUser({ profileId: req.params.profileId })
        );

        res.status(STATUS_CODES.SUCCESS.ACCEPTED).json({
            success: true,
            message: "User deletion in progress",
            correlationId
        });
    } catch (error) {
        Logs.error("Delete User Ctrl Error:", error);
        res.status(STATUS_CODES.SERVER_ERRORS.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Server Error! Please Try Again Later"
        });
    }
});


export const getUser    = errorHandlerWrapper(getUserHandler);
export const getUsers   = errorHandlerWrapper(getUsersHandler);
export const updateUser = errorHandlerWrapper(updateUserHandler);
export const deleteUser = errorHandlerWrapper(deleteUserHandler);
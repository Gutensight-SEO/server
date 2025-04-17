/** @format */
import { errorHandlerWrapper, Validators } from "@/helpers";
import { KAFKA_TOPICS, STATUS_CODES } from "@/constants";
import { Logs } from "@/monitoring";
import { ZodSchema } from "@/schemas";
import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { v1Services } from "@/services";
import jwt from "jsonwebtoken";
import { GenerateToken } from "@/utils";
import { server_url, server_version } from "@/globals";
import { producer } from "@/streaming";

const registerUserHandler = asyncHandler(
async (
req: Request<{}, {}, ZodSchema.UserSchema.CreateUserInput["body"]>,
res: Response
) => {
    try {
        const error = await Validators.ValidateUser(req.body);
        if (error) {
            res.status(STATUS_CODES.CLIENT_ERRORS.BAD_REQUEST).json({
                success: false,
                message: (error as any).details[0].message
            });
            return;
        }

        const { firstname, lastname, username, email, password } = req.body;
        
        
        
        const correlationId = await producer.publish(
            KAFKA_TOPICS.REGISTER_USER,
            () => v1Services.register({
                firstname,
                lastname,
                username,
                email,
                password,
                role: 'user'
            })
        );

        res.status(STATUS_CODES.SUCCESS.ACCEPTED).json({
            success: true,
            message: "Registration in progress",
            url: `${server_url}/${server_version}/streaming/status/${correlationId}`
        });
    } catch (error) {
        Logs.error("Register User Ctrl Error:", error);
        res.status(STATUS_CODES.SERVER_ERRORS.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Server Error! Try Again Later"
        });
    }
});

const loginUserHandler = asyncHandler(
    async (req: Request<{}, {}, ZodSchema.UserSchema.LoginUserInput["body"]>, res: Response) => {
        try {
            const { detail, password } = req.body;

            const result = await v1Services.login({ detail, password });

            if (result !== null) {
                if ('errMessage' in result) {
                    res.status(result['statusCode']).json({
                        success: false,
                        message: result['errMessage']
                    });
                    return;
                } else {
                    // Set both tokens in HTTP-only cookies
                    res.cookie('accessToken', result["accessToken"], {
                        httpOnly: false, // Allow JS
                        secure: process.env.NODE_ENV === 'Production', // Required for Partitioned cookies
                        sameSite: process.env.NODE_ENV === 'Production' ? 'none' : 'strict',
                        path: '/',
                        maxAge: 15 * 60 * 1000, // 15 minutes
                        partitioned: true 
                    });
                    
                    res.cookie('refreshToken', result["refreshToken"], {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'Production',
                    sameSite: process.env.NODE_ENV === 'Production' ? 'none' : 'strict',
                    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
                    partitioned: true 
                    });

                    res.status(STATUS_CODES.SUCCESS.OK).json({
                        success: true,
                        message: "Login Successful",
                        data: {
                            user: result["user"]
                        },
                    });
                }
            } else {
                res.status(STATUS_CODES.CLIENT_ERRORS.BAD_REQUEST).json({
                    success: false,
                    message: "Login Failed"
                })
            }            
        } catch (error) {
            Logs.error("Login User Error:", error)
            res.status(STATUS_CODES.SERVER_ERRORS.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: "Server Error! Try Again Later"
            })
        }
    }
)

const refreshTokenHandler = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
        try {
            const refreshToken = req.cookies.refreshToken;

            if (!refreshToken) {
                res.status(STATUS_CODES.CLIENT_ERRORS.UNAUTHORIZED).json({
                    message: "Refresh token not found"
                })
            }

            // verify refresh token
            const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!) as any;

            // Generate new access token
            const accessToken = GenerateToken(decoded.userId, 'access');

            res.status(STATUS_CODES.SUCCESS.OK).json({ accessToken });
            return;
        } catch (error) {
            res.status(STATUS_CODES.CLIENT_ERRORS.UNAUTHORIZED);
            return;
        }
    }
)


export const register = errorHandlerWrapper(registerUserHandler);
export const login = errorHandlerWrapper(loginUserHandler);
export const refreshToken = errorHandlerWrapper(refreshTokenHandler);
/** @format */


import dotenv from "dotenv";
import nodemailer from "nodemailer";
import { google } from "googleapis";

dotenv.config();


const clientId = process.env.OAUTH_CLIENT_ID;
const clientSecret = process.env.OAUTH_CLIENT_SECRET
const refreshToken = process.env.REFRESH_TOKEN
const redirectUrl = process.env.REDIRECT_URL

const oAuthPass = new google.auth.OAuth2(
    clientId,
    clientSecret,
    redirectUrl
);

oAuthPass.setCredentials({ refresh_token: refreshToken });

const accessToken = async () => (await oAuthPass.getAccessToken()).token;

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        type: 'OAuth2',
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
        clientId,
        clientSecret,
        refreshToken: refreshToken,
        accessToken,
    }
});

export default transporter;
"use strict";
// import dotenv from "dotenv";
// import transporter from "./transporter";
// import { GenerateToken } from "@/utils";
// import { Logs } from "@/monitoring";
// dotenv.config();
// const sendMail = async ({ option, recipient, template }: { option: string, recipient: string, template: any }) => {
//     try {
//         const { subject, text, html, link, senderMail } = template;
//         const token = GenerateToken(recipient, option);
//     const message = {
//         from: `${process.env.COMPANY_NAME} <${senderMail ? senderMail : process.env.COMPANY_EMAIL}>`,
//         to: recipient,
//         subject,
//         text,
//         token,
//         html
//     };
//     const result = transporter.sendMail(message);
//     Logs.success("SendMail Success:", result);
//     return result;
//     } catch (error) {
//         Logs.error("SendMail Error:", error);
//     }
// }
// export default sendMail;

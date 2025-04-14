/** @format */


export type CreateNotificationRequestType = {
    id?: string,
    sender: string,
    recipients: string[],
    subject: string,
    body: string,
    reference: string,
}
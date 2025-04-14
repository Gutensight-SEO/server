"use strict";
/** @format */
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    type: 'object',
    properties: {
        sender: {
            type: 'object',
            description: 'The Sender of the Notification',
            schema: {
                $ref: './user.schema',
            }
        },
        recipients: {
            type: 'array',
            description: 'The Recipients of the Notification',
            items: {
                $ref: './user.schema',
            }
        },
        subject: {
            type: 'string',
            description: 'The subject of the Post',
        },
        body: {
            type: 'string',
            description: 'The main content of the Notification',
        },
        reference: {
            type: 'string',
            description: 'The Content the Notification is associated to',
        },
    }
};

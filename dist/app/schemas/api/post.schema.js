"use strict";
/** @format */
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    type: 'object',
    properties: {
        user: {
            type: 'object',
            description: 'The Author of the Post',
            schema: {
                $ref: './user.schema',
            }
        },
        title: {
            type: 'string',
            description: 'The title of the Post',
        },
        body: {
            type: 'string',
            description: 'The main content of the Post',
        },
        comments: {
            type: 'array',
            description: 'The Comments associated to the Post',
            items: {
                $ref: './comment.schema'
            }
        },
    }
};

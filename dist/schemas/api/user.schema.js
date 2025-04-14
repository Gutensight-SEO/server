"use strict";
/** @format */
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    required: ['username', 'email'],
    type: 'object',
    properties: {
        firstname: {
            type: 'string',
            description: 'The First Name of the User',
        },
        lastname: {
            type: 'string',
            description: 'The Last Name of the User',
        },
        username: {
            type: 'string',
            description: 'The unique Username of the User',
        },
        email: {
            type: 'string',
            description: 'The Email address of the User',
        },
        password: {
            type: 'string',
            description: 'The Password of the User',
        },
        role: {
            type: 'string',
            description: 'The Role assigned to the User',
        },
    },
};

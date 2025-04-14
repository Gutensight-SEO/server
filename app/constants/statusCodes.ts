/** @format */


export const SUCCESS = Object.freeze({
    OK: 200,
    CREATED: 201,
    ACCEPTED: 202,
});

export const REDIRECTED = Object.freeze({
    REDIRECTED: 300
})

export const CLIENT_ERRORS = Object.freeze({
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    NOT_FOUND: 404,
});

export const SERVER_ERRORS = Object.freeze({
    INTERNAL_SERVER_ERROR: 500,
    NOT_IMPLEMENTED: 501,
});
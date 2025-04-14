/** @format */


export default {
    type: 'object',
    properties: {
        user: {
            type: 'object',
            description: 'The Author of the Comment',
            schema: {
                $ref: './user.schema',
            }
        },
        body: {
            type: 'string',
            description: 'The main content of the Comment',
        },
        reference: {
            type: 'string',
            description: 'The Post or Comment this Comment is responding to',
        },

    }
}
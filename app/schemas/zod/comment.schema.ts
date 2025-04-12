/** @format */


import { object, number, string, TypeOf } from "zod";


const payload = {
    body: object({
        body: string({
            required_error: "Comment body is required",
        }).min(2, "Title must be at least 2 characters long").max(500, "Title can not be more than 500 characters long"),
        reference: string({
            required_error: "Reference ID is required"
        })
    }),
}

const params = {
    params: object({
        commentId: string({
            required_error: "Comment ID is required"
        })
    })
};

export const createCommentSchema = object({
    ...payload,
});

export const getCommentSchema = object({
    ...params,
});

export const updateCommentSchema = object({
    ...payload,
    ...params,
});

export const deleteCommentSchema = object({
    ...params,
});


export type CreateCommentInput = TypeOf<typeof createCommentSchema>;
export type GetCommentInput    = TypeOf<typeof getCommentSchema>;
export type UpdateCommentInput = TypeOf<typeof updateCommentSchema>;
export type deleteCommentInput = TypeOf<typeof deleteCommentSchema>;
/** @format */


import { object, string, TypeOf } from "zod";


const payload = {
    body: object({
        title: string({
            required_error: "Title is required",
        }).min(2, "Title must be at least 2 characters long").max(200, "Title can not be more than 200 characters long"),
        body: string({
            required_error: "Body is required",
        }).min(2, "First name must be at least 2 characters long").max(1200, "First name can not be more than 1200 characters long"),
        // commentCount: number({
        //     required_error: "Comment count is required"
        // }),
    }),
}

const params = {
    params: object({
        postId: string({
            required_error: "Post ID is required"
        })
    })
};

export const createPostSchema = object({
    ...payload,
});

export const getPostSchema = object({
    ...params,
});

export const updatePostSchema = object({
    ...payload,
    ...params,
});

export const deletePostSchema = object({
    ...params,
});

export const getPostsSchema = object({
    params: object({
        userId: string({
            required_error: "User ID is required"
        })
    })
})


export type CreatePostInput = TypeOf<typeof createPostSchema>;
export type GetPostInput    = TypeOf<typeof getPostSchema>;
export type UpdatePostInput = TypeOf<typeof updatePostSchema>;
export type DeletePostInput = TypeOf<typeof deletePostSchema>;
export type GetPostsInput   = TypeOf<typeof getPostsSchema>;
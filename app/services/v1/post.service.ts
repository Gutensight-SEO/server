/** @format */

import { deleteCache, setCache, updateCache } from "@/cache";
import { STATUS_CODES } from "@/constants";
import { PostDocument, PostModel } from "@/models";
import { Logs } from "@/monitoring";
import { ZodSchema } from "@/schemas";
import { omit } from "lodash";
// import { DocumentDefinition, FilterQuery, QueryOptions, UpdateQuery } from 'mongoose';


// get post 
export const getPost = async (
    { postId }: ZodSchema.PostSchema.GetPostInput['params']
): Promise<PostDocument | object | null> => {
    try {
        const foundPost = await PostModel.findById(postId);

        if (!foundPost) return {
            statusCode: STATUS_CODES.CLIENT_ERRORS.NOT_FOUND,
            errMessage: "Post Not Found"
        }

        return foundPost;
    } catch (error) {
        Logs.error("Get Post Service:", error);
        return null;
    }
}

// get posts
export const getPosts = async (
    // {
        userId: string,
        queryString: any
    // }
): Promise<PostDocument | object> => {
    try {
        let posts: PostDocument[] | [] = [];
        let page: number = queryString.page;
        let limit: number = queryString.limit;
        
        if (queryString.search) {
            let filteredData: PostDocument[] = [];
            let qArray: string[] = [];

            const allPosts = await PostModel.find({ user: userId })

            if (allPosts.length > 0) {
                await allPosts.map((post: PostDocument) => {
                    qArray = queryString.search?.toString().toLowerCase().split(" ");

                    let title = post.title.toLowerCase();
                    let body = post.body.toLowerCase();

                    if (
                        qArray.some((qq) => title.includes(qq)) ||
                        qArray.some((qq) => body.includes(qq)) 
                    ) filteredData.push(post)
                });

                posts = filteredData;
            }
        } else {
            posts = await PostModel.find({ user: userId });
        }

        if (posts.length > 0) {
            // apply pagination
            limit = limit || 20;
            // const startIndex = 0;
            // const endIndex = startIndex + limit + 1;
            page = page || 0;
            const startIndex = page * limit;
            const endIndex = startIndex + limit + 1;

            posts = posts.slice(startIndex, endIndex);

            return posts;
        } else {
            return {
                statusCode: STATUS_CODES.CLIENT_ERRORS.NOT_FOUND,
                errMessage: "No Posts Yet"
            }
        }
    } catch (error) {
        Logs.error("Get Posts Error:", error)
        return {
            statusCode: STATUS_CODES.CLIENT_ERRORS.NOT_FOUND,
            errMessage: "No Posts Yet",
        }
    }
}

// create post
export const createPost = async (
    userId: string,
    details: ZodSchema.PostSchema.CreatePostInput['body'] 
): Promise<PostDocument | object> => {
    try {
        const newPost = await PostModel.create({
            user: userId,
            title: details.title,
            body: details.body
        })

        if (newPost) {
            await setCache(String(newPost._id), newPost);
            await deleteCache(`${userId}_posts`);

            return {
                statusCode: STATUS_CODES.SUCCESS.CREATED,
                message: "New Post Created",
                data: omit(newPost.toJSON(), "__v") 
            };
        }
        else return {
            statusCode: STATUS_CODES.CLIENT_ERRORS.BAD_REQUEST,
            errMessage: "New post not created"
        }
    } catch (error) {
        Logs.error("Create Post Service Error:", error);
        return null;
    }
}

// update post 
export const updatePost = async (
    userId: string,
    { postId }: ZodSchema.PostSchema.UpdatePostInput['params'],
    details: ZodSchema.PostSchema.UpdatePostInput['body']
): Promise<PostDocument | object> => {
    try {
        const foundPosts = await PostModel.find({
            _id: postId,
            user: userId
        });
        const foundPost = foundPosts[0];

        if (!foundPost) return {
            statusCode: STATUS_CODES.CLIENT_ERRORS.NOT_FOUND,
            errMessage: "Post Not Found",
        }

        if (String(foundPost.user) !== String(userId)) {
            return { 
                statusCode: STATUS_CODES.CLIENT_ERRORS.UNAUTHORIZED,
                errMessage: "Unauthorized"
            }
        }

        const updatedPost = await PostModel.findByIdAndUpdate(
            postId,
            details,
            { new: true }
        )

        await updateCache(String(updatedPost._id), updatedPost);
        await deleteCache(`${userId}_posts`);

        return {
            statusCode: STATUS_CODES.SUCCESS.OK,
            message: "Post updated",
            data: updatedPost
        };
    } catch (error) {
        Logs.error("Update Post Service:", error);
        return null;
    }
}

// delete post
export const deletePost = async (
    userId: string,
    { postId }: ZodSchema.PostSchema.GetPostInput['params']
): Promise<string | object | null> => {
    try {
        const foundPosts = await PostModel.find({
            _id: postId,
            user: userId
        });
        const foundPost = foundPosts[0];
        
        if (!foundPost) return {
            statusCode: STATUS_CODES.CLIENT_ERRORS.NOT_FOUND,
            errMessage: "Post Not Found"
        }

        await PostModel.findByIdAndDelete(postId);

        await deleteCache(String(postId));
        await deleteCache(`${userId}_posts`);

        return {
            statusCode: STATUS_CODES.SUCCESS.OK,
            message: "Post Deleted"
        };
    } catch (error) {
        Logs.error("Delete Post Service:", error);
        return null;
    }
}

// delete posts
export const deletePosts = async (
    userId: string
): Promise<string | object | null> => {
    try {
        const foundPosts = await PostModel.find({ user: userId });

        if (foundPosts.length < 0) return {
            statusCode: STATUS_CODES.CLIENT_ERRORS.NOT_FOUND,
            errMessage: "No Posts Found"
        }

        const deleteResult = await PostModel.deleteMany({ user: userId });
        if (deleteResult.deletedCount === 0) {
            return {
                statusCode: STATUS_CODES.CLIENT_ERRORS.BAD_REQUEST,
                errMessage: "Failed to delete posts"
            };
        }

        await deleteCache(`${userId}_posts`);

        return {
            statusCode: STATUS_CODES.SUCCESS.OK,
            message: "All Posts Deleted"
        };
    } catch (error) {
        Logs.error("Delete Posts Service error:", error);
        return null;
    }
}



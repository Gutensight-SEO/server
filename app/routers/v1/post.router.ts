/** @format */


import { PostController } from "@/controllers";
import { ZodValidation } from "@/middlewares";
import { ZodSchema } from "@/schemas";
import { Router } from "express";


const postRouter = Router();

// get posts 
postRouter.get('/', PostController.getPosts);
// create post
postRouter.post('/', ZodValidation(ZodSchema.PostSchema.createPostSchema), PostController.createPost);
// delete posts ('user')
postRouter.delete('/', PostController.deletePosts);
// get post
postRouter.get('/:postId', ZodValidation(ZodSchema.PostSchema.getPostSchema), PostController.getPost);
// update post
postRouter.patch('/:postId', ZodValidation(ZodSchema.PostSchema.updatePostSchema), PostController.updatePost);
// delete post 
postRouter.delete('/:postId', ZodValidation(ZodSchema.PostSchema.deletePostSchema), PostController.deletePost);


export default postRouter;

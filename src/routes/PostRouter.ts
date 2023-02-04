import express from 'express'
import { PostController } from '../controller/PostController'

export const postRouter = express.Router()
const postController = new PostController()
postRouter.get("/", postController.getAllPosts)
postRouter.post("/post", postController.createPost)
postRouter.get("/post/:id", postController.searchPostById)
postRouter.get("/type", postController.getPostsByTpe)
postRouter.post("/:postId", postController.likeAPost)
postRouter.delete("/:postId", postController.dislikeAPost)
postRouter.post("/comment/:postId", postController.leaveAComment)
postRouter.get("/feed/:userId", postController.getFeed)

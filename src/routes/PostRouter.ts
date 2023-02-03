import express from 'express'
import { PostController } from '../controller/PostController'

export const postRouter = express.Router()
const postController = new PostController()
postRouter.post("/post", postController.createUser)
postRouter.get("/post/:id", postController.searchPostById)
postRouter.get("/type", postController.getPostsByTpe)

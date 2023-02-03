import express from 'express'
import { UserController } from '../controller/UserController'

export const userRouter = express.Router()
const userController = new UserController()
userRouter.post("/user", userController.createUser)
userRouter.post("/:userId/add", userController.addFriends)
userRouter.delete("/:userId/delete", userController.deleteFriend)
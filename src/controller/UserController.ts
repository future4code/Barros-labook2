import { Request, Response } from "express";
import { UserBusiness } from "../business/UserBusiness";
import { FriendsInputDTO, UserInputDTO } from "../model/userDTO";

const userBusiness = new UserBusiness()

export class UserController {
    createUser = async (req: Request, res: Response): Promise<void> => {
        let message = "Success!"

        try {
            const input:UserInputDTO = {
                name: req.body.name,
                email: req.body.email,
                password: req.body.password
            }

            await userBusiness.createUser(input)

            res.status(201).send({message})
        } catch (error:any) {
            res.status(error.statusCode || 400).send(error.message || error.sqlMessage)
        }
    };

    getAllUsers = async (req: Request, res: Response): Promise<void> => {
        try {
            const result = await userBusiness.getAllUsers()

            res.status(200).send(result)
        } catch (error:any) {
            res.status(error.statusCode || 400).send(error.message || error.sqlMessage)
        }
    }

    addFriends = async (req: Request, res: Response): Promise<void> => {
        let message = "Success! You are now friends."

        try {
            const userId = req.params.userId as string
            const friendId = req.body.friendId as string

            const users: FriendsInputDTO = {
                userOneId: userId,
                userTwoId: friendId
            }
            
            await userBusiness.addFriends(users)

            res.status(201).send({message})

        } catch (error:any) {
            res.status(error.statusCode || 400).send(error.message || error.sqlMessage)
        }
    };

    deleteFriend = async (req: Request, res: Response): Promise<void> => {
        let message = "Friendship deleted."

        try {
            const userId = req.params.userId as string
            const friendId = req.body.friendId as string

            const users: FriendsInputDTO = {
                userOneId: userId,
                userTwoId: friendId
            }
            
            await userBusiness.deleteFriend(users)

            res.status(201).send({message})

        } catch (error:any) {
            res.status(error.statusCode || 400).send(error.message || error.sqlMessage)
        }
    };
}
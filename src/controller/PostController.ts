import { Request, Response } from "express";
import { PostBusiness } from "../business/PostBusiness";
import { PostInputDTO } from "../model/postDTO";

export class PostController {
    createUser = async (req: Request, res: Response): Promise<void> => {
        let message = "Success!"

        try {
            const input: PostInputDTO = {
                photo: req.body.photo,
                description: req.body.description,
                type: req.body.type,
                authorId: req.body.authorId
            }

            const postBusiness = new PostBusiness()
            await postBusiness.createPost(input)

            res.status(201).send({message})
        } catch (error:any) {
            res.status(error.statusCode || 400).send(error.message || error.sqlMessage)
        }
    }
}
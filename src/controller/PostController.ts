import { Request, Response } from "express";
import { PostBusiness } from "../business/PostBusiness";
import { post } from "../model/post";
import { CommentInputDTO, LikesInputDTO, PostInputDTO } from "../model/postDTO";

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
    };

    searchPostById = async (req: Request, res: Response): Promise<void> => {
        let message = "Success!"

        try {
            const {id} = req.params

            const postBusiness = new PostBusiness()
            const result = await postBusiness.searchPostById(id)

            const post: post = {
                id: result.id,
                photo: result.photo,
                description: result.description,
                type: result.type,
                createdAt: result.created_at,
                authorId: result.author_id
            }

            res.status(200).send({message, post})
        } catch (error:any) {
            res.status(error.statusCode || 400).send(error.message || error.sqlMessage)
        }
    };

    getPostsByTpe = async (req: Request, res: Response): Promise<void> => {
        try {
            const type = req.query.type as string

            const postBusiness = new PostBusiness()
            const result = await postBusiness.getPostsByType(type)

            res.status(200).send(result)
        } catch (error:any) {
            res.status(error.statusCode || 400).send(error.message || error.sqlMessage)
        }
    };
    
    likeAPost = async (req: Request, res: Response): Promise<void> => {
        let message = "Post liked!"
        try {
            const input: LikesInputDTO = {
                postId: req.params.postId,
                userId: req.body.userId
            }

            const postBusiness = new PostBusiness()
            await postBusiness.likeAPost(input)

            res.status(201).send({message})
        } catch (error:any) {
            res.status(error.statusCode || 400).send(error.message || error.sqlMessage)
        }
    };

    dislikeAPost = async (req: Request, res: Response): Promise<void> => {
        let message = "Post disliked!"
        
        try {
            const input: LikesInputDTO = {
                postId: req.params.postId,
                userId: req.body.userId
            }

            const postBusiness = new PostBusiness()
            await postBusiness.dislikeAPost(input)

            res.status(201).send({message})
        } catch (error:any) {
            res.status(error.statusCode || 400).send(error.message || error.sqlMessage)
        }
    };

    leaveAComment = async(req: Request, res: Response): Promise<void> => {
        let message = "Comment posted!"

        try {
            const input: CommentInputDTO = {
                postId: req.params.postId,
                userId: req.body.userId,
                comment: req.body.comment
            }

            const postBusiness = new PostBusiness()
            await postBusiness.leaveAComment(input)

            res.status(201).send({message})
        } catch (error:any) {
            res.status(error.statusCode || 400).send(error.message || error.sqlMessage)
        }
    }
}
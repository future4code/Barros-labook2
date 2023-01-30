import { PostDatabase } from "../data/PostDatabase";
import { CustomError } from "../error/CustomError";
import { MissingData, WrongType } from "../error/PostErrors";
import { InsertPostInputDTO, PostInputDTO } from "../model/postDTO";
import { generateId } from "../services/idGenerator";

export class PostBusiness {
    createPost = async (input: PostInputDTO): Promise<void> => {
        try {
            const { photo, description, type, authorId } = input

            if (!photo || !description || !type || !authorId) {
                throw new MissingData()
            }

            if (type !== 'normal' && type !== 'event') {
                throw new WrongType()
            }

            const postId = generateId()

            const postDatabase = new PostDatabase
            const postInput: InsertPostInputDTO = {
                id: postId,
                photo: photo,
                description: description,
                type: type,
                author_id: authorId
            }

            await postDatabase.createPost(postInput)
            
        } catch (error:any) {
            throw new CustomError(error.statusCode, error.message)
        }
    }
}
import { CustomError } from "../error/CustomError";
import { InsertCommentInputDTO, InsertLikesInputDTO, InsertPostInputDTO, LikesOutputDTO, PostOutputDTO } from "../model/postDTO";
import { BaseDatabase } from "./BaseDatabase";

export class PostDatabase extends BaseDatabase {

    createPost = async (post: InsertPostInputDTO): Promise<void> => {

        try {            
            await PostDatabase.connection("labook_posts").insert(post)
        } catch (error:any) {
            throw new CustomError(error.statusCode, error.message)
        }
    };

    getAllPosts = async(): Promise<PostOutputDTO[]> => {
        try {

            const result = await PostDatabase.connection("labook_posts").select()
            return result

        } catch (error:any) {
            throw new CustomError(error.statusCode, error.message)
        }
    }

    searchPostById = async (id: string): Promise<PostOutputDTO> => {
        try {

            const result = await PostDatabase.connection("labook_posts")
            .select()
            .where({id})

            return result[0]

        } catch (error:any) {
            throw new CustomError(error.statusCode, error.message)
        }
    };

    getUserPosts = async (id: string): Promise<PostOutputDTO[]> => {
        try {

            const result = await PostDatabase.connection("labook_posts")
            .select()
            .where("author_id", "like", `${id}`)
            return result

        } catch (error:any) {
            throw new CustomError(error.statusCode, error.message)
        }
    };

    getPostsbyType = async (type: string): Promise<PostOutputDTO[]> => {
        try {

            const result = await PostDatabase.connection("labook_posts")
            .select()
            .where("type", "like", `${type}`)
            return result

        } catch (error:any) {
            throw new CustomError(error.statusCode, error.message)
        }
    };

    likeAPost = async (like: InsertLikesInputDTO): Promise<void> => {
        try {
            await PostDatabase.connection("labook_posts_liked").insert(like)
        } catch (error:any) {
            throw new CustomError(error.statusCode, error.message)
        }
    };

    dislikeAPost = async(id: string): Promise<void> => {
        try {
            
            await PostDatabase.connection("labook_posts_liked")
            .delete()
            .where({id})

        } catch (error:any) {
            throw new CustomError(error.statusCode, error.message)
        }
    }

    getAllLikes = async(): Promise<LikesOutputDTO[]> => {
        try {
            const result = await PostDatabase.connection("labook_posts_liked").select()
            return result
        } catch (error:any) {
            throw new CustomError(error.statusCode, error.message)
        }
    };

    leaveAComment = async(comment: InsertCommentInputDTO): Promise<void> => {
        try {
            await PostDatabase.connection("labook_posts_comments").insert(comment)
        } catch (error:any) {
            throw new CustomError(error.statusCode, error.message)
        }
    };
}
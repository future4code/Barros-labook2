import { CustomError } from "../error/CustomError";
import { post } from "../model/post";
import { InsertPostInputDTO, PostOutputDTO } from "../model/postDTO";
import { BaseDatabase } from "./BaseDatabase";

export class PostDatabase extends BaseDatabase {

    createPost = async (post: InsertPostInputDTO): Promise<void> => {

        try {            
            await PostDatabase.connection("labook_posts").insert(post)
        } catch (error:any) {
            throw new CustomError(error.statusCode, error.message)
        }
    };

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
    }


}
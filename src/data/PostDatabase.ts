import { CustomError } from "../error/CustomError";
import { InsertPostInputDTO } from "../model/postDTO";
import { BaseDatabase } from "./BaseDatabase";

export class PostDatabase extends BaseDatabase {

    createPost = async (post: InsertPostInputDTO): Promise<void> => {

        try {            
            await PostDatabase.connection("labook_posts").insert(post)
        } catch (error:any) {
            throw new CustomError(error.statusCode, error.message)
        }
    }
}
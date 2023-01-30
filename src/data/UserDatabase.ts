import { CustomError } from "../error/CustomError";
import { user } from "../model/user";
import { BaseDatabase } from "./BaseDatabase";

export class UserDatabase extends BaseDatabase {

    createUser = async(user: user): Promise<void> => {
        try {
            await UserDatabase.connection.insert({
                id: user.id,
                name: user.name,
                email: user.email,
                password: user.password
            })
            .into("labook_users")

        } catch (error:any) {
            throw new CustomError(error.statusCode, error.message)
        }
    }
}
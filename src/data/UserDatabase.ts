import { CustomError } from "../error/CustomError";
import { friends, user } from "../model/user";
import { FriendsOutputDTO } from "../model/userDTO";
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

    addFriends = async (friends: friends): Promise<void> => {
        try {
            await UserDatabase.connection.insert({
                id: friends.id,
                user_1_id: friends.userOneId,
                user_2_id: friends.userTwoId
            })
            .into("labook_users_friends")

        } catch (error:any) {
            throw new CustomError(error.statusCode, error.message)
        }
    };
    
    getAllUsers = async(): Promise<user[]> => {
        try {
            const result = await UserDatabase.connection("labook_users").select("*")
            return result
        } catch (error:any) {
            throw new CustomError(error.statusCode, error.message)
        }
    }

    getAllFriendships = async(): Promise<FriendsOutputDTO[]> => {
        try {
            const result = await UserDatabase.connection("labook_users_friends").select("*")
            return result
        } catch (error:any) {
            throw new CustomError(error.statusCode, error.message)
        }
    }

    deleteFriend = async(id: string): Promise<void> => {
        try {
            await UserDatabase.connection("labook_users_friends").delete().where({id})
        } catch (error: any) {
            throw new CustomError(error.statusCode, error.message)
        }
    }
}
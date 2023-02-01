import { UserDatabase } from "../data/UserDatabase";
import { CustomError } from "../error/CustomError";
import { FriendsIdError, MissingData, UserIdNotFound } from "../error/UserErrors";
import { FriendsInputDTO, UserInputDTO } from "../model/userDTO";
import { generateId } from "../services/idGenerator";

export class UserBusiness {

    createUser = async(input: UserInputDTO): Promise<void> => {
        try {
            const { name, email, password } = input
            
            if (!name || !email || !password) {
                throw new MissingData()
            }

            const id = generateId()

            const userDatabase = new UserDatabase()
            await userDatabase.createUser({
                id, name, email, password
            })

        } catch (error:any) {
            throw new CustomError(error.statusCode, error.message)
        }
    };

    addFriends = async(input: FriendsInputDTO): Promise<void> => {
        try {
            const {userOneId, userTwoId} = input

            if (!userOneId || userOneId === ":userId" || !userTwoId) {
                throw new FriendsIdError()
            }

            const userDatabase = new UserDatabase()
            const users = await userDatabase.getAllUsers()

            const getUserOne = users.find(user => user.id === userOneId)
            if (!getUserOne) {
                throw new UserIdNotFound()
            }

            const getUserTwo = users.find(user => user.id === userTwoId)
            if (!getUserTwo) {
                throw new UserIdNotFound()
            }

            if (getUserOne.id === getUserTwo.id) {
                throw new CustomError(404, "You can't add yourself.")
            }

            const friendships = await userDatabase.getAllFriendships()
            for (let i = 0; i < friendships.length; i++) {
                if (friendships[i].user_1_id === getUserOne.id || friendships[i].user_1_id === getUserTwo.id) {
                    for (let y = 0; i < friendships.length; i++) {
                        if (friendships[y].user_2_id === getUserOne.id || friendships[y].user_2_id === getUserTwo.id) {
                            throw new CustomError(404, "You have already added this user.")
                        }
                    }
                }
            }

            const friendshipId = generateId()

            await userDatabase.addFriends({
                id: friendshipId, userOneId: getUserOne.id, userTwoId: getUserTwo.id
            })
                        
        } catch (error:any) {
            throw new CustomError(error.statusCode, error.message)
        }
    };
}
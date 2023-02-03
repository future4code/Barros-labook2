import { PostDatabase } from "../data/PostDatabase";
import { UserDatabase } from "../data/UserDatabase";
import { CustomError } from "../error/CustomError";
import { FriendsIdError, MissingData, UserIdNotFound } from "../error/UserErrors";
import { PostOutputDTO } from "../model/postDTO";
import { FriendsInputDTO, FriendsOutputDTO, UserInputDTO } from "../model/userDTO";
import { generateId } from "../services/idGenerator";

const userDatabase = new UserDatabase()
const postDatabase = new PostDatabase()

export class UserBusiness {

    createUser = async(input: UserInputDTO): Promise<void> => {
        try {
            const { name, email, password } = input
            
            if (!name || !email || !password) {
                throw new MissingData()
            }

            const id = generateId()

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

    deleteFriend = async(input: FriendsInputDTO): Promise<void> => {
        try {
            const {userOneId, userTwoId} = input

            if (!userOneId || userOneId === ":userId" || !userTwoId) {
                throw new FriendsIdError()
            }

            const users = await userDatabase.getAllUsers()

            const getUserOne = users.find(user => user.id === userOneId)
            if (!getUserOne) {
                throw new UserIdNotFound()
            }

            const getUserTwo = users.find(user => user.id === userTwoId)
            if (!getUserTwo) {
                throw new UserIdNotFound()
            }

            const friendships = await userDatabase.getAllFriendships()
            const getFriendship = friendships.find(friendship => friendship.user_1_id === getUserOne.id && friendship.user_2_id === getUserTwo.id 
                || friendship.user_2_id === getUserOne.id && friendship.user_1_id === getUserTwo.id)

            if (!getFriendship) {
                throw new CustomError (400, "The users selected are not friends.")
            }

            await userDatabase.deleteFriend(getFriendship.id)
        } catch (error:any) {
            throw new CustomError(error.statusCode, error.message)
        }
    };

    getUserFeed = async(input: string): Promise<PostOutputDTO[]> => {
        try {
            const userId: string = input

            const users = await userDatabase.getAllUsers()

            const getUser = users.find(user => user.id === userId)
            if (!getUser) {
                throw new UserIdNotFound()
            }

            const friendsList = await userDatabase.getUserFriendships(userId)
            if (!friendsList) {
                throw new CustomError(400, "No friends added.")
            }

            let feed: PostOutputDTO[] = []
            let posts = null
            for (let i = 0; i < friendsList.length; i++) {
                if (friendsList[i].user_1_id !== getUser.id) {
                    posts = await postDatabase.getUserPosts(friendsList[i].user_1_id)
                    if (posts !== null) {
                        feed.push(...posts)
                    }
                }
                if (friendsList[i].user_2_id !== getUser.id) {
                    posts = await postDatabase.getUserPosts(friendsList[i].user_2_id)
                    if (posts !== null) {
                        feed.push(...posts)
                    }
                 }
            }

            if (feed.length === 0) {
                throw new CustomError(400, "No posts available.")
            }

            function order (a: PostOutputDTO , b: PostOutputDTO) {
                if (a.created_at > b.created_at) {
                    return -1
                } else if (a.created_at < b.created_at) {
                    return 1
                } else {
                    return 0
                }
            }
        
            return feed.sort(order)

        } catch (error:any) {
            throw new CustomError(error.statusCode, error.message)
        }
    };
}
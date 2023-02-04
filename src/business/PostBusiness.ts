import { PostDatabase } from "../data/PostDatabase";
import { UserDatabase } from "../data/UserDatabase";
import { CustomError } from "../error/CustomError";
import { IdNotFound, MissingData, WrongType } from "../error/PostErrors";
import { UserIdNotFound } from "../error/UserErrors";
import { CommentInputDTO, InsertCommentInputDTO, InsertLikesInputDTO, InsertPostInputDTO, LikesInputDTO, PostInputDTO, PostOutputDTO } from "../model/postDTO";
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
    };

    searchPostById = async(id: string): Promise<PostOutputDTO> => {
        try {

            if (!id || id === ":id") {
                throw new IdNotFound()
            }

            const postDatabase = new PostDatabase()
            const result = await postDatabase.searchPostById(id)

            return result

        } catch (error:any) {
            throw new CustomError(error.statusCode, error.message)
        }
    };

    getAllPosts = async(): Promise<PostOutputDTO[]> => {
        try {
            const postDatabase = new PostDatabase()
            const result = await postDatabase.getAllPosts()

            return result
        } catch (error:any) {
            throw new CustomError(error.statusCode, error.message)
        }
    }

    getUserFeed = async(id: string): Promise<PostOutputDTO[]> => {
        try {
            const userId: string = id

            const userDatabase = new UserDatabase()
            const users = await userDatabase.getAllUsers()

            const getUser = users.find(user => user.id === userId)
            if (!getUser) {
                throw new UserIdNotFound()
            }

            const friendsList = await userDatabase.getUserFriendships(userId)
            if (!friendsList) {
                throw new CustomError(400, "No friends added.")
            }

            const postDatabase = new PostDatabase()
            let feed: PostOutputDTO[] = []
            let posts: PostOutputDTO[] = []
            for (let i = 0; i < friendsList.length; i++) {
                if (friendsList[i].user_1_id !== getUser.id) {
                    posts = await postDatabase.getUserPosts(friendsList[i].user_1_id)
                    if (posts.length > 0) {
                        feed.push(...posts)
                    }
                }
                if (friendsList[i].user_2_id !== getUser.id) {
                    posts = await postDatabase.getUserPosts(friendsList[i].user_2_id)
                    if (posts.length > 0) {
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

    getPostsByType = async(type: string): Promise<PostOutputDTO[]> => {
        try {
            if (!type) {
                throw new CustomError(400, "Type not informed.")
            }

            if (type !== "normal" && type !== "event") {
                throw new WrongType()
            }

            const postDatabase = new PostDatabase()
            const result = await postDatabase.getPostsbyType(type)

            function order (a: PostOutputDTO , b: PostOutputDTO) {
                if (a.created_at > b.created_at) {
                    return -1
                } else if (a.created_at < b.created_at) {
                    return 1
                } else {
                    return 0
                }
            }
        
            return result.sort(order)

        } catch (error:any) {
            throw new CustomError(error.statusCode, error.message)
        }
    };

    likeAPost = async(input: LikesInputDTO): Promise<void> => {
        try {
            const { postId, userId } = input

            if (!postId || !userId) {
                throw new CustomError(400, "Insert post and user id.")
            }

            const userDatabase = new UserDatabase()
            const allUsers = await userDatabase.getAllUsers()
            const findUser = allUsers.find(user => user.id === userId)
            if (!findUser) {
                throw new UserIdNotFound()
            }

            const postDatabase = new PostDatabase()
            const getPost = await postDatabase.searchPostById(postId)
            if (!getPost) {
                throw new CustomError(400, "Post not found.")
            }

            const allLikes = await postDatabase.getAllLikes()
            for (let i = 0; i < allLikes.length; i++) {
                if (allLikes[i].user_id === userId) {
                    for (let y = 0; y < allLikes.length; y++) {
                        if (allLikes[y].post_id === postId) {
                            throw new CustomError(400, "You have already liked this post.")
                        }
                    }
                }
            }

            const likeId = generateId()

            const likeInput: InsertLikesInputDTO = {
                id: likeId,
                user_id: userId,
                post_id: postId
            }

            await postDatabase.likeAPost(likeInput)
        } catch (error:any) {
           throw new CustomError(error.statusCode, error.message)
        }
    };

    dislikeAPost = async(input: LikesInputDTO): Promise<void> => {
        try {
            const { postId, userId } = input

            if (!postId || !userId) {
                throw new CustomError(400, "Insert post and user id.")
            }

            const userDatabase = new UserDatabase()
            const allUsers = await userDatabase.getAllUsers()
            const findUser = allUsers.find(user => user.id === userId)
            if (!findUser) {
                throw new UserIdNotFound()
            }

            const postDatabase = new PostDatabase()
            const getPost = await postDatabase.searchPostById(postId)
            if (!getPost) {
                throw new CustomError(400, "Post not found.")
            }

            const allLikes = await postDatabase.getAllLikes()
            const findLike = allLikes.find(like => like.user_id === userId && like.post_id === postId)
            if (!findLike) {
                throw new CustomError(400, "The post selected was not 'liked' by the user informed.")
            }

            await postDatabase.dislikeAPost(findLike.id)
        } catch (error:any) {
            throw new CustomError(error.statusCode, error.message)
        }
    };

    leaveAComment = async(input: CommentInputDTO): Promise<void> => {
        try {
            const { postId, userId, comment } = input

            if (!postId || !userId) {
                throw new CustomError(400, "Insert post and user id.")
            }

            const userDatabase = new UserDatabase()
            const allUsers = await userDatabase.getAllUsers()
            const findUser = allUsers.find(user => user.id === userId)
            if (!findUser) {
                throw new UserIdNotFound()
            }

            const postDatabase = new PostDatabase()
            const getPost = await postDatabase.searchPostById(postId)
            if (!getPost) {
                throw new CustomError(400, "Post not found.")
            }

            if (!comment) {
                throw new CustomError(400, "Comment can not be blank.")
            }

            const commentId = generateId()

            const newComment: InsertCommentInputDTO = {
                id: commentId,
                user_id: userId,
                post_id: postId,
                comment: comment
            } 

            await postDatabase.leaveAComment(newComment)

        } catch (error:any) {
            throw new CustomError(error.statusCode, error.message)
        }
    };
}
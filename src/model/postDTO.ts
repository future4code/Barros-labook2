import { POST_TYPES } from "./post";

export interface PostInputDTO {
    photo: string,
    description: string,
    type: POST_TYPES,
    authorId: string
}

export interface InsertPostInputDTO {
    id: string,
    photo: string,
    description: string,
    type: POST_TYPES,
    author_id: string
}

export interface PostOutputDTO {
    id: string,
    photo: string,
    description: string,
    type: POST_TYPES,
    created_at: Date,
    author_id: string,
}

export interface LikesInputDTO {
    postId: string,
    userId: string
}

export interface InsertLikesInputDTO {
    id: string,
    post_id: string,
    user_id: string
}

export interface LikesOutputDTO {
    id: string,
    post_id: string,
    user_id: string
}

export interface CommentInputDTO {
    postId: string,
    userId: string,
    comment: string
}

export interface InsertCommentInputDTO {
    id: string,
    comment: string,
    post_id: string,
    user_id: string
}
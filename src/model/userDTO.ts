export interface UserInputDTO {
    name: string,
    email: string,
    password: string
}

export interface FriendsInputDTO {
    userOneId: string,
    userTwoId: string
}

export interface FriendsOutputDTO {
    id: string,
    user_1_id: string,
    user_2_id: string
}
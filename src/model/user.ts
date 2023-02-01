export type user = {
    id: string,
    name: string,
    email: string,
    password: string
}

export type friends = {
    id: string,
    userOneId: string,
    userTwoId: string
}
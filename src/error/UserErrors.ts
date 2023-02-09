import { CustomError } from "./CustomError";

export class MissingData extends CustomError {
    constructor() {
        super(406, '"name", "email" and "password" must be provided')
    }
}

export class FriendsIdError extends CustomError {
    constructor() {
        super(400, "Users IDs not provided.")
    }
}

export class UserIdNotFound extends CustomError {
    constructor() {
        super(400, "User ID not found.")
    }
}
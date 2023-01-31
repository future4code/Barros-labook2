import { CustomError } from "./CustomError";

export class MissingData extends CustomError {
    constructor() {
        super(406, '"name", "email" and "password" must be provided.')
    }
}

export class WrongType extends CustomError {
    constructor() {
        super(422, " 'type' must be either 'normal' or 'event'.")
    }
}

export class IdNotFound extends CustomError {
    constructor() {
        super(404, "Post not found.")
    }
}
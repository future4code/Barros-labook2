import { UserDatabase } from "../data/UserDatabase";
import { CustomError } from "../error/CustomError";
import { MissingData } from "../error/UserErrors";
import { UserInputDTO } from "../model/userDTO";
import { generateId } from "../services/idGenerator";

export class UserBusiness {

    createUser = async (input: UserInputDTO): Promise<void> => {
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
    }
}
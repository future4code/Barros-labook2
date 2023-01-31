import knex from "knex"
import dotenv from "dotenv"
import app from "./app"
import { userRouter } from "./routes/UserRouter"
import { postRouter } from "./routes/PostRouter"

app.use("/users", userRouter)
app.use("/posts", postRouter)

dotenv.config()

export const connection= knex({
   client: "mysql",
   connection: {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      port: 3306,
      multipleStatements: true
   }
})
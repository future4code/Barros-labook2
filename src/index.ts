import express, { Express, Request, Response } from "express"
import knex from "knex"
import dotenv from "dotenv"
import app from "./app"
import { userRouter } from "./routes/UserRouter"
import { postRouter } from "./routes/PostRouter"

/**************************** CONFIG ******************************/

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

/**************************** TYPES ******************************/

type authenticationData = {
   id: string
}

type user = {
   id: string,
   name: string,
   email: string,
   password: string
}

enum POST_TYPES {
   NORMAL = "normal",
   EVENT = "event"
}

type post = {
   id: string,
   photo: string,
   description: string,
   type: POST_TYPES,
   createdAt: Date,
   authorId: string
}


/**************************** ENDPOINTS ******************************/

app.use("/users", userRouter)
app.use("/posts", postRouter)

app.get('/posts/:id', async (req: Request, res: Response) => {
   try {
      let message = "Success!"

      const { id } = req.params

      const queryResult: any = await connection("labook_posts")
         .select("*")
         .where({ id })

      if (!queryResult[0]) {
         res.statusCode = 404
         message = "Post not found"
         throw new Error(message)
      }

      const post: post = {
         id: queryResult[0].id,
         photo: queryResult[0].photo,
         description: queryResult[0].description,
         type: queryResult[0].type,
         createdAt: queryResult[0].created_at,
         authorId: queryResult[0].author_id,
      }

      res.status(200).send({ message, post })

   } catch (error:any) {
      let message = error.sqlMessage || error.message
      res.statusCode = 400
      res.send({ message })
   }
})

/**************************** SERVER INIT ******************************/
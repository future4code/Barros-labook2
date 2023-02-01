import app from "./app"
import { userRouter } from "./routes/UserRouter"
import { postRouter } from "./routes/PostRouter"

app.use("/users", userRouter)
app.use("/posts", postRouter)
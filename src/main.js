import { databaseConnection } from "./DB/connectionDB.js"
import express from "express"
import { authController } from "./modules/Auth/auth.controller.js";
import { userController } from "./modules/User/user.controller.js";
import { config } from "dotenv";
import path from "path"; 
import { globalErrorHandler } from "./Middleware/error-handler.middleware.js";
import { messageController } from "./modules/Message/message.controller.js";
config()
// config({ path: path.resolve("src/Config/.dev.env") })
// dotenv

const bootstrap = () => {


    const app = express();
    app.use(express.json())

    // console.log(process.env);
 

    app.use("/auth", authController)
    app.use("/user", userController)
    app.use("/message", messageController)


    app.use(globalErrorHandler)

 
    databaseConnection()

    app.listen(process.env.PORT, () => console.log("Server is running..."));


}

export default bootstrap
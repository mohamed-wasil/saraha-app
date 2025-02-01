import { Router } from "express"
import * as userServices from "./Services/profile.service.js"
import { authenticationMiddleWare, authorizationMiddleware } from "../../Middleware/authenticaton.middleware.js"
import { systemRoles } from "../../Constants/constants.js"
import { errorHandler } from "../../Middleware/error-handler.middleware.js"

export const userController = Router()

userController.use(errorHandler(authenticationMiddleWare()))

userController.get("/profile", errorHandler(userServices.profileServices))
userController.put("/update", errorHandler(userServices.updateProfileService))
userController.get("/list", errorHandler(authorizationMiddleware([systemRoles.ADMIN])), errorHandler(userServices.listUsersService))
userController.patch("/update-password", errorHandler(userServices.updatePasswordSevice))


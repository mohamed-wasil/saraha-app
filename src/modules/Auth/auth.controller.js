import { Router } from "express";
import * as authServices from "./Services/autentication.service.js"
import { errorHandler } from "../../Middleware/error-handler.middleware.js";
import { signUpSchema } from "../../Validators/auth.schema.js";
import { validationMiddleware } from "../../Middleware/validation.middleware.js";

export const authController = Router()

authController.post("/signup", errorHandler(validationMiddleware(signUpSchema)) ,errorHandler( authServices.signUpServicves))
authController.post("/login", errorHandler(authServices.loginServices))
authController.get("/verify/:token", errorHandler(authServices.verifyEmailService))
authController.post("/refreshtoken", errorHandler(authServices.refreshTokenServices))
authController.post("/signout", errorHandler(authServices.signOutServices))
authController.patch("/forget-password", errorHandler(authServices.forgetPasswordService))
authController.put("/reset-password", errorHandler(authServices.resetPasswordService))


import { Router } from "express";
import * as messagesServices from "./Services/message.service.js"
import { errorHandler } from "../../Middleware/error-handler.middleware.js";
import { authenticationMiddleWare } from "../../Middleware/authenticaton.middleware.js";

export const messageController = Router()

messageController.post("/create",errorHandler(messagesServices.sendMessageService))
messageController.get("/list",errorHandler(messagesServices.getMessagesService))
messageController.get("/list-user-messages",errorHandler(authenticationMiddleWare()) ,errorHandler(messagesServices.getUserMessagesService))
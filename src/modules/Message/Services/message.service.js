import { Message } from "../../../DB/Models/message.model.js";
import { User } from "../../../DB/Models/user.model.js";

export const sendMessageService = async (req, res, next) => {
    const { message, ownerId } = req.body;

    // Send Message Here...
    const isUserExist = await User.findById({ _id: ownerId });
    if (!isUserExist) return res.status(404).json({ message: "User not found" });


    const insertMessage = await Message.create({ message, ownerId });
    if (!insertMessage) return res.status(500).json({ message: "Failed to send message" });

    res.status(200).json({ message: "Message sent successfully" });

}

export const getMessagesService = async (req, res, next) => {

    const messages = await Message.find({}).populate(
        [
            {
                path: "ownerId",
                select: "-password -__v"
            }
        ]
    )
    if (!messages) return res.status(404).json({ message: "No messages found" });

    res.status(200).json({ messages });

}

export const getUserMessagesService = async (req, res, next) => {
    const { _id } = req.loggedInUser
    const messages = await Message.find({ ownerId: _id })
    if (messages.length == 0) return res.status(404).json({ message: "No messages found" });


    res.status(200).json({ messages });

}
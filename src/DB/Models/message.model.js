import mongoose from "mongoose";

const messagesSchema = mongoose.Schema({
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    message: {
        type: String,
        required: true
    }
})

export const Message = mongoose.model.Messages || mongoose.model('Messages', messagesSchema)

export default {Message};
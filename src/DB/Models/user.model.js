import mongoose, { Schema } from "mongoose";
import { systemRoles } from "../../Constants/constants.js";


export const userSchema = new Schema({
    name: {
        type: String,
        unique: [true, "User Is already taken"],
        required: [true, 'Name is required'],
        lowercase: true,
        trim: true,

    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: 6,
        // select: false, // not to return password in response
    },
    phone: {
        type: String,
        required: [true, 'Phone number is required'],
    },
    profileImage: String,
    age: {
        type: Number,
        min: [18, "min age is 18"],
        max: [100, "max age is 100"],
    },

    isDeleted: {
        type: Boolean,
        default: false,
    },
    isEmailVerified: {
        type: Boolean,
        default: false,
    },
    otp: {
        type: String,
    },
    role: {
        type: String,
        enum: Object.values(systemRoles),
        default: systemRoles.USER
    }
}, { timestamps: true, })






export const User = mongoose.model.User || mongoose.model('User', userSchema);

import { compareSync, hashSync } from "bcrypt";
import { User } from "../../../DB/Models/user.model.js";
import { Encryption } from "../../../utils/encryption.utils.js";
import { emitter, sendEmailService } from "../../../Services/send-email.service.js";
import { v4 as uuidv4 } from 'uuid';
import path from "path"
import jwt from "jsonwebtoken"
import BlackListTokens from "../../../DB/Models/blach-list-tokens.model.js";
import { log } from "console";

export const signUpServicves = async (req, res, next) => {

    const { name, email, password, confirmPassword, phone, age } = req.body;

    const isEmailExist = await User.findOne({ email })
    if (isEmailExist) return res.status(400).json({ message: 'Email already exists' })

    //hash pasword
    const hashedPassword = hashSync(password, +process.env.SALT)

    const encyptedPhone = await Encryption({ value: phone, secretKey: process.env.ENCRYPTED_KEY })

    const token = jwt.sign({ email }, process.env.JWT_SECRET)
    const confirmEmailLink = `${req.protocol}://${req.headers.host}/auth/verify/${token}`


    // send verification email
    emitter.emit("sendEmail", {
        to: email,
        subject: 'Email Verification',
        html: `<a href= "${confirmEmailLink}">Click To Verify</a>`,

    })
    const newUser = await User.create({ name, email, password: hashedPassword, phone: encyptedPhone, age })
    if (!newUser) return res.status(404).json({ message: 'Created user faild , try again' })
    res.status(201).json({ message: 'User created successfully', newUser })
}


export const verifyEmailService = async (req, res, next) => {
    const { token } = req.params;

    const decotedData = jwt.verify(token, process.env.JWT_SECRET)


    const user = await User.findOneAndUpdate({
        $or: [
            { _id: decotedData._id },
            { email: decotedData.email }
        ]
    }, { isEmailVerified: true }, { new: true })

    res.status(200).json({ message: "Email verified Seccess", user })

}


export const loginServices = async (req, res, next) => {
    const { email, password } = req.body;
    console.log(process.env.JWT_SECRET_LOGIN)
    const user = await User.findOne({ email })
    if (!user) return res.status(400).json({ message: 'Invalid email or Password' })

    const isPasswordMatch = compareSync(password, user.password)
    if (!isPasswordMatch) return res.status(200).json({ message: 'Invalid email or Password' })

    const token = jwt.sign({ _id: user._id, name: user.name, email: user.email }, process.env.JWT_SECRET_LOGIN, { expiresIn: process.env.ACCESS_TOKEN_EXPIRATION_TIME, jwtid: uuidv4() })
    const refreshToken = jwt.sign({ _id: user._id, name: user.name, email: user.email }, process.env.JWT_SECRET_REFRESH, { expiresIn: process.env.REFRESH_TOKEN_EXPIRATION_TIME, jwtid: uuidv4() })

    res.status(201).json({ message: "Login Success", tokens: { token: token, refreshToken: refreshToken } })
}



export const refreshTokenServices = async (req, res, next) => {
    const { refreshtoken } = req.headers
    // if (!refreshToken) return res.status(401).json({ message: 'No refresh token provided' })

    const decodedData = jwt.verify(refreshtoken, process.env.JWT_SECRET_REFRESH)
    const token = jwt.sign({ _id: decodedData._id, name: decodedData.name, email: decodedData.email }, process.env.JWT_SECRET_LOGIN, { expiresIn: process.env.ACCESS_TOKEN_EXPIRATION_TIME, jwtid: uuidv4() })
    res.status(201).json({ message: "Token Refreshed Success", token })
}

export const signOutServices = async (req, res, next) => {
    const { token, refreshtoken } = req.headers;

    const decodedData = jwt.verify(token, process.env.JWT_SECRET_LOGIN)
    const decodedRefreshToken = jwt.verify(refreshtoken, process.env.JWT_SECRET_REFRESH)


    const revokedToken = await BlackListTokens.insertMany([
        {
            tokenId: decodedData.jti,
            expierdAt: decodedData.exp
        },
        {
            tokenId: decodedRefreshToken.jti,
            expierdAt: decodedRefreshToken.exp
        }
    ])

    res.status(200).json({ message: "Logged Out Successfully" })

}

export const forgetPasswordService = async (req, res) => {
    const { email } = req.body
    const user = await User.findOne({ email })
    if (!user) return res.status(404).json({ message: 'This email not regitred' })


    const otp = Math.floor(1000 + Math.random() * 10000);
    emitter.emit("sendEmail", {
        to: user.email,
        subject: 'Reset Your Password',
        html: `<h1>OTP is ${otp}</h1>`,
    })

    const hashedOtp = hashSync(otp.toString(), +process.env.SALT)
    await User.findByIdAndUpdate(user._id, { otp: hashedOtp }, { new: true })

    res.status(200).json({ message: 'Check Your Email' })
}

export const resetPasswordService = async (req, res) => {

    const { email, otp, password, confirmPassword } = req.body

    if (password !== confirmPassword) return res.status(400).json({ message: 'Passwords do not match' })

    const user = await User.findOne({ email })
    if (!user) return res.status(404).json({ message: 'This email not regitred' })


    const isOtpMatch = compareSync(otp.toString(), user.otp)
    if (!isOtpMatch) return res.status(400).json({ message: 'Invalid OTP' })


    const hashedPassword = hashSync(password, +process.env.SALT)
    await User.updateOne({ email }, { password: hashedPassword, $unset: { otp } })

    res.status(200).json({ message: 'Password Reset Successfully' })
}


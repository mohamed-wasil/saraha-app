import asyncHandler from "express-async-handler"
import { User } from "../../../DB/Models/user.model.js"
import { emitter } from "../../../Services/send-email.service.js"
import { Decryption, Encryption } from "../../../utils/encryption.utils.js"
import jwt from "jsonwebtoken"


export const profileServices = async (req, res, next) => {

        const { _id } = req.loggedInUser
        console.log({ loggedInUser: req.loggedInUser });

        const user = await User.findById(_id)
        if (!user) return res.status(404).json({ message: 'User not found' })

        user.phone = await Decryption({ cipher: user.phone, secretKey: process.env.ENCRYPTED_KEY })
        res.status(200).json({ user })

   
}

export const updateProfileService = async (req, res, next) => {

        const { _id } = req.loggedInUser
        const { name, email, phone } = req.body;

        const user = await User.findById(_id)
        if (!user) return res.status(404).json({ message: 'User not found' })


        if (name) user.name = name
        if (phone) {
            const encryptedPhone = await Encryption({ value: phone, secretKey: process.env.ENCRYPTED_KEY })
            user.phone = encryptedPhone
        }
        if (email) {
            const isEmailExist = await User.findOne({ email })
            if (isEmailExist) return res.status(400).json({ message: 'Email already exists' })

                const emailToken = jwt.sign({email} , process.env.JWT_SECRET)
                //  const token = jwt.sign({ email }, process.env.JWT_SECRET)

            const confirmEmailLink = `${req.protocol}://${req.headers.host}/auth/verify/${emailToken}`
            // send verification email
            emitter.emit("sendEmail", {
                to: email,
                subject: 'Email Verification',
                html: `<a href= "${confirmEmailLink}">Click To Verify</a>`,

            })

            user.email = email
            user.isEmailVerified = false
        }

        await user.save()

        res.status(200).json({ message: "user Updated success", user })
}

export const updatePasswordSevice = async (req , res)=>{
        const {_id} = req.loggedInUser;
        const { oldPassword, newPassword, confirmPassword } = req.body

        const user = await User.findById(_id)
        if (!user) return res.status(404).json({ message: 'User not found' })


        const isPasswordMatch = compareSync(oldPassword, user.password)
        if (!isPasswordMatch) return res.status(400).json({ message: 'Invalid Old Password' })


        if (newPassword !== confirmPassword) return res.status(400).json({ message: 'Passwords do not match' })
            
        const hashedPassword = hashSync(newPassword, +process.env.SALT)
        await User.updateOne({_id}, { password: hashedPassword })

        //revoke token 
        await BlackListTokens.create({
            tokenId: req.loggedInUser.token.tokenId, 
            expierdAt: req.loggedInUser.token.expierdAt
        })


        res.status(200).json({ message: 'Password Updated Successfully' })
}

export const listUsersService =async (req, res) =>{
        const users = await User.find({} , '-password -__v')
        res.status(200).json({ users })
}


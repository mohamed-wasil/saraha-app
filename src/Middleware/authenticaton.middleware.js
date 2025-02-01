import BlackListTokens from "../DB/Models/blach-list-tokens.model.js";
import { User } from "../DB/Models/user.model.js";
import jwt from "jsonwebtoken"

export const authenticationMiddleWare = (roles) => {

    return async (req, res, next) => {
            const { token } = req.headers;
            const decodedData = jwt.verify(token, process.env.JWT_SECRET_LOGIN);
            if (!decodedData) return res.status(401).json({ message: 'Please login first' });

            const isTokenBlackListed = await BlackListTokens.findOne({ tokenId: decodedData.jti })
            if (isTokenBlackListed) return res.status(403).json({ message: 'Token blackklisted, please login again' });

            const user = await User.findById(decodedData._id, '-password -__v').lean();
            if (!user) return res.status(404).json({ message: 'Please SignUp' });

            req.loggedInUser = { ...user, token: { tokenId: decodedData.jti, expierdAt: decodedData.exp } };
            next()
    }
}

export const authorizationMiddleware = (roles) => {
    return async (req, res, next) => {
       
            const { role: loggedInUserRole } = req.loggedInUser
            const isAllowed = roles.includes(loggedInUserRole)
            console.log(roles, loggedInUserRole, isAllowed);

            if (!isAllowed)
                return res.status(403).json({ message: 'You do not have the required permissions' });
            next();
    }
}
import User from '../models/user.js'
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import errorHandler from '../middlewares/errors/errHandling.js'
import { JWT_SECRET, ADMIN_SECRET } from '../app.js'

export const register = async(req, res, next) => {
    const { userName, email, password, isAdmin, adminKey } = req.body;
    try {
        if (!userName || !email || !password) {
            return next(errorHandler(400, "Please fill in all fields"));
        }
        console.log(password)
        const existingUser = await User.findOne({email});
        if (existingUser) {
            return next(errorHandler(400, "Email already exists"));
        }
        if (password.length < 8) {
            return next(errorHandler(400, "Password must be at least 8 characters"))
        }

        let isAdminFlag = false;
        if (adminKey && adminKey === ADMIN_SECRET ) {
            isAdminFlag = true;
        } else if (isAdmin) {
            return next(errorHandler(403, "Invalid admin key"))
        }
            const hash = await bcrypt.hash(password, 10);
            const user = await User.create({
                userName, email, password: hash,
                isAdmin: isAdminFlag
            })

            let token = null;
            if (isAdminFlag) {
                token = jwt.sign({id: user._id, isAdmin: true }, ADMIN_SECRET, {
                    expiresIn: '30d'
                })
            }
            const { password: _, ...userData } = user._doc
            res.status(200).json({
                message: "User created successfully",
                token: token ? `Bearer ${token}` : null,
                user: userData
            })
    } catch (error) {
        next(error)
    }
}
export const userLogin = async(req, res, next) => {
    const { email, password } = req.body;
    try {
        const userCred = await User.findOne({email})
        if (!userCred) {
            return next(errorHandler(400,"User not found"))
        }
        const isPassword = await bcrypt.compare(password, userCred.password);
        if (!isPassword) {
            return next(errorHandler(400, "Invalid Credentials")) 
        }
        const genToken = jwt.sign({id: userCred._id}, JWT_SECRET, {
            expiresIn: '1h'
        })
        if (!genToken) {
            return next(errorHandler(400, "Token not generated")) 
        }
        // const { password: _, ...userLog } = user._doc
        return res.status(200).json({message: "User logged in successfully", token: `Bearer ${genToken}`})
    } catch (error) {
        console.error(error)
        next(error)
    }
} 

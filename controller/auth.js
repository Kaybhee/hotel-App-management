import User from '../models/user.js'
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import errorHandler from '../middlewares/errors/errHandling.js'
// import { JWT_SECRET } from '../const.js';
import {JWT_SECRET} from '../const.js';


export const register = async(req, res, next) => {
    const { userName, email, password } = req.body;
    try {
        if (!userName || !email || !password) {
            // return res.status(400).json({ message: "Please fill in all fields" });
            return next(errorHandler(400, "Please fill in all fields"));
        }
        const existingUser = await User.findOne({email});
        if (existingUser) {
            // return res.status(400).json({message: "Email already exists"});
            return next(errorHandler(400, "Email already exists"));
        }
        if (password.length < 8) {
            return next(errorHandler(400, "Password must be at least 8 characters"))
        }

        const user = await User.create({
            userName,
            email,
            password
        })

        console.log(user)
        res.status(200).json({message: 'User created successfully', user})

    } catch (error) {
        // Check if there are validation errors e.g length of password, special keys or uppercase in password
        // if (error.name === "ValidationError") {
        //   const firstError = Object.values(error.errors)[0].message;
        //   return res.status(400).json({ message: firstError });
        // }
        // console.error("Server Error:", error); 
        // res.status(500).json({ message: "Server Error" });
        next(error)
    }
}


export const userLogin = async(req, res) => {
    const { email, password } = req.body;
    try {
        const userCred = await User.findOne({email});
        const isPassword = await bcrypt.compare(password, userCred.password);
        if (!userCred) {
            return next(errorHandler(400,"User not found"))
        }

        if (!isPassword) {
            return next(errorHandler(400, "Invalid Credentials")) 
        }
        const genToken = jwt.sign({id: userCred._id}, JWT_SECRET, {
            expiresIn: '1h'
        })
        console.log(JWT_SECRET)
        if (!genToken) {
            return next(errorHandler(400, "Token not generated")) 
        }
        
        return res.status(200).json({mesage: "User logged in successfuly", genToken})
    } catch (error) {
        console.error(error)
        next(error)
    }
}

import { JWT_SECRET } from "../../const.js";
import User from "../../models/user.js";
import jwt from 'jsonwebtoken';
import errorHandler from "../errors/errHandling.js";


// const authHeader = async(req, res, next) => {
//     try {
//         const userId = req.params
//         const authHeader = req.headers.authorization;
//         if (!authHeader || !authHeader.startswith('Bearer')) {
//             return next(errorHandler(401, "NO token provided, authorization denied"))
//         }
//         const user = await User.findById(userId).select('-password')
//     }
// }
import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '../../const.js'
import User from '../../models/user.js'

export const protectAuth = async(req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer')) {
            return res.status(401).json({message: "No token provided, authorization denied"})
        }
        const token = authHeader.split(' ')[1];
        console.log(token)
        const decoded = jwt.verify(token, JWT_SECRET)
        req.user = await User.findById(decoded.id).select('-password')
        if (!req.user) {
            return res.status(401).json({message: 'User not found, authorization denied'})
        }
        next()
    }
    catch (e) {
        console.error(e)
        return res.status(401).json({message: 'Not authorized, token failed'})
    }
}
// export default protectAuth
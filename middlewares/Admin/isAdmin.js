import { JWT_SECRET, ADMIN_SECRET } from "../../const.js";
import User from "../../models/user.js";
import jwt from 'jsonwebtoken';
import errorHandler from "../errors/errHandling.js";

export const adminOnly = async (req, res, next) => {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith('Bearer')) {
        return res.status(401).json({message: "No token provided, authorization denied"})
    }
    const token = auth.split(' ')[1];
	if (!token) return res.status(401).json({ message: "Unauthorized" });
	try {
		const decoded = jwt.verify(token, ADMIN_SECRET);
        // console.log(JWT_SECRET)
		const user = await User.findById(decoded.id);
		if (!user || !user.isAdmin) {
			return next(errorHandler(403, "Access denied"));
		}
		req.user = user;
        console.log(req.user)
		next();
	} catch (error) {
		console.error("Admin check error:", error);
		return next(errorHandler(403,"Invalid token or admin access required"));
	}
};


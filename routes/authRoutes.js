import express from 'express';
import { register, userLogin } from '../controller/auth.js';
import { adminOnly } from '../middlewares/Admin/isAdmin.js';


// routes
const authRoutes = express.Router()

// post method for users
authRoutes.post('/create-user', register)
authRoutes.post('/login', userLogin) // Login user
// 
authRoutes.post('/login/admin', adminOnly, userLogin) // Login user


export default authRoutes
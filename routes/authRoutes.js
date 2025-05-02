import express from 'express';
import { register, userLogin, verifyUserRegistration, resendUserOtp, adminLogin } from '../controller/auth.js';
import { adminOnly } from '../middlewares/Admin/isAdmin.js';


// routes
const authRoutes = express.Router()

// post & patch method for users
authRoutes.post('/create-user', register)
authRoutes.post('/resend-user-otp', resendUserOtp)
authRoutes.patch('/verify-user-registration', verifyUserRegistration)
authRoutes.post('/login', userLogin) // Login user
// 
authRoutes.post('/login/admin', adminOnly, adminLogin) // Admin login


export default authRoutes
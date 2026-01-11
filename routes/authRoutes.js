import express from 'express';
import { register, userLogin, verifyUserRegistration, adminLogin, resendUserLink } from '../controller/auth.js';
import { adminOnly } from '../middlewares/Admin/isAdmin.js';


// routes
const authRoutes = express.Router()

// post & patch method for users
authRoutes.post('/create-user', register)
authRoutes.post('/resend-user-otp', resendUserLink)
// authRoutes.patch('/verify-user-registration', verifyUserRegistration)
authRoutes.get('/verify-email', verifyUserRegistration)
authRoutes.post('/login', userLogin) // Login user
// 
authRoutes.post('/login/admin', adminOnly, adminLogin) // Admin login


export default authRoutes
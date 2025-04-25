import express from 'express';
import { register, userLogin } from '../controller/auth.js';

// routes
const authRoutes = express.Router()

// post method for users
authRoutes.post('/create-user', register)
authRoutes.post('/login', userLogin) // Login user
// 

export default authRoutes
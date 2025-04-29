import express from 'express';
import { adminOnly } from '../middlewares/Admin/isAdmin.js';
import { delUser, getUser, getUsers, updateUser, } from '../controller/users.js';
import { protectAuth } from '../middlewares/auth/protectAuth.js';


// import
const userRoutes = express.Router()


userRoutes.get('/', adminOnly, getUsers);
userRoutes.get('/:userId', protectAuth, getUser);
userRoutes.put('/update-user/:userId', protectAuth, updateUser)
userRoutes.delete('/delete-user/:userId', adminOnly, delUser)


// userRoutes.get('/',adminOnly, getUsers)


export default userRoutes

// Put
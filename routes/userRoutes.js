import express from 'express';
import { adminOnly } from '../middlewares/Admin/isAdmin.js';
import { protectAuth } from './../middlewares/auth/protectAuth.js';
import { delUser, getUser, getUsers, updateUser, } from '../controller/users.js';
// import { protectAuth } from '../middlewares/auth/protectAuth.js';


// import
const userRoutes = express.Router()


userRoutes.get('/user/', adminOnly, getUsers);
userRoutes.get('/user/:userId', getUser);
userRoutes.put('/user/update-user/:userId', protectAuth, updateUser)
userRoutes.delete('/user/delete-user/:userId', adminOnly, delUser)
// userRoutes.get('/', (req, res, next) => {
//     console.log('GET /api/v1/users/ route hit');
//     next();
// }, getUsers)

// userRoutes.get('/',adminOnly, getUsers)


export default userRoutes

// Put
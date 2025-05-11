import express from 'express';
import { adminOnly } from '../middlewares/Admin/isAdmin.js';
import { delUser, getUser, getUsers, updateUser, } from '../controller/users.js';
import { bookRoom } from '../controller/booking.js';
import { protectAuth } from '../middlewares/auth/protectAuth.js';


// import
const userRoutes = express.Router()
const bookingRoutes = express.Router()


userRoutes.get('/', adminOnly, getUsers);
userRoutes.get('/:userId', protectAuth, getUser);
userRoutes.put('/update-user/:userId', protectAuth, updateUser)

// booking routes  
// bookingRoutes.post('/book-room', bookRoom)


userRoutes.delete('/delete-user/:userId', adminOnly, delUser)


// userRoutes.get('/',adminOnly, getUsers)

export { userRoutes, bookingRoutes }

// Put
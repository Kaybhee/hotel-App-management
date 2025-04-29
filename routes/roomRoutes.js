
import express from 'express';
import { adminOnly } from '../middlewares/Admin/isAdmin.js';
import { protectAuth } from './../middlewares/auth/protectAuth.js';
import { createRoom, getRoom, getRooms, updateRoom, delRoom, updateRoomAvailability } from '../controller/room.js';
// import { protectAuth } from '../middlewares/auth/protectAuth.js';


// import
const roomRoutes = express.Router()


roomRoutes.post('/create-room/:hotelId', adminOnly, createRoom);
roomRoutes.get('/', getRooms);
roomRoutes.get('/:roomId', getRoom);
roomRoutes.put('/availability/:roomNumberId', updateRoomAvailability)
roomRoutes.put('/update-room/:roomId', adminOnly, updateRoom)
roomRoutes.delete('/delete-room/:roomId/:hotelId', adminOnly, delRoom)


export default roomRoutes

// Put
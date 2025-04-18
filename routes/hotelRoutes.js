import express from 'express';
import mongoose from 'mongoose';
import { userLogin, getAvailableRooms, getRoom, getAllRooms, changePrices, changeStatus } from '../userRole/user.js';

// import

const hotelRoutes = express.Router()


hotelRoutes.post('/login', userLogin)
// get requests
hotelRoutes.get('/rooms-available', getAvailableRooms)
hotelRoutes.get('/rooms/:roomsId', getRoom) //after getting, purchase
hotelRoutes.get('/rooms', getAllRooms)
// Put
hotelRoutes.put('/change-prices', changePrices)
hotelRoutes.put('/change-status', changeStatus)
// Delete 
hotelRoutes.delete('/delete-room', deleteRoom)
// Create

export default hotelRoutes
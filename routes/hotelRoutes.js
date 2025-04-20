import express from 'express';
import { createUser, createHotels, getAvailableRooms, getRoom, getAllRooms, changePrices, changeStatus } from '../userRole/user.js';

// import

const hotelRoutes = express.Router()


hotelRoutes.post('/create-user', createUser)
hotelRoutes.post('/create-hotels', createHotels)
// get requests
hotelRoutes.get('/rooms-available', getAvailableRooms)
hotelRoutes.get('/rooms/:roomsId', getRoom) //after getting, purchase
hotelRoutes.get('/rooms', getAllRooms)
// Put
hotelRoutes.put('/change-prices', changePrices)
hotelRoutes.put('/change-status', changeStatus)
// Delete 
// hotelRoutes.delete('/delete-room', deleteRoom)
// Create

export default hotelRoutes
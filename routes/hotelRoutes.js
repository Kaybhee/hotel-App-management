import express from 'express';
import { createHotels, updateHotels, getHotels, getHotel, delHotels, getHotelRooms, getRoom, getAllRooms, changePrices, changeStatus } from '../controller/hotel.js';
import { adminOnly } from '../middlewares/Admin/isAdmin.js';

// import

const hotelRoutes = express.Router()


hotelRoutes.post('/create-hotels',  createHotels)
// get requests
hotelRoutes.get('/room/:hotelId', getHotelRooms)
hotelRoutes.get('/:hotelId', getHotel)
hotelRoutes.get('/', getHotels)

// Put
hotelRoutes.put('/update-hotels/:hotelId', adminOnly, updateHotels)
// hotelRoutes.put('/change-prices', changePrices)
// hotelRoutes.put('/change-status', changeStatus)
// Delete 
hotelRoutes.delete('/delete-hotel/:hotelId', adminOnly, delHotels)
// hotelRoutes.delete('/delete-room', deleteRoom)
// Create

export default hotelRoutes
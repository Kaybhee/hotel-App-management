import express from 'express';
import { createHotels, updateHotels, getHotels, getHotel, delHotels, getHotelRooms, } from '../controller/hotel.js';
import { adminOnly } from '../middlewares/Admin/isAdmin.js';

const hotelRoutes = express.Router()


hotelRoutes.post('/create-hotels',  adminOnly, createHotels)
// get requests
hotelRoutes.get('/room/:hotelId', getHotelRooms)
hotelRoutes.get('/:hotelId', getHotel)
hotelRoutes.get('/', getHotels)

// Put
hotelRoutes.put('/update-hotels/:hotelId', adminOnly, updateHotels)

hotelRoutes.delete('/delete-hotel/:hotelId', adminOnly, delHotels)


export default hotelRoutes
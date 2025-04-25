import express from 'express';
import { createHotels, updateHotels, getHotels, getHotel, delHotels, getAvailableRooms, getRoom, getAllRooms, changePrices, changeStatus } from '../controller/hotel.js';

// import

const hotelRoutes = express.Router()


hotelRoutes.post('/create-hotels', createHotels)
// get requests
hotelRoutes.get('/rooms-available', getAvailableRooms)
hotelRoutes.get('/rooms/:roomsId', getRoom) //after getting, purchase
hotelRoutes.get('/rooms', getAllRooms)
hotelRoutes.get('/:hotelId', getHotel)
hotelRoutes.get('/', getHotels)

// Put
hotelRoutes.put('/update-hotels/:hotelId', updateHotels)
hotelRoutes.put('/change-prices', changePrices)
hotelRoutes.put('/change-status', changeStatus)
// Delete 
hotelRoutes.delete('/delete-hotel/:hotelId', delHotels)
// hotelRoutes.delete('/delete-room', deleteRoom)
// Create

export default hotelRoutes
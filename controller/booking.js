import Booking from "../models/booking.js"
import User from "../models/user.js";
import Room from "../models/rooms.js";
import { sendEmail } from "../services/mail.js";
import errorHandler from "../middlewares/errors/errHandling.js";

export const bookRoom = async(req, res, next) => {
    const { userId, roomId, roomNumber, startDate, endDate } = req.body;
     // Helper function to get date range
     const getDateRange = (startDate, endDate) => {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const dateArray = [];

        while ( start <= end ) {
            dateArray.push(new Date(start));         
            start.setDate(start.getDate() + 1);
        }
        return dateArray;
    }
    try {
        const existingBooking = await Booking.findOne({user: userId});
        console.log(userId.email)
        if(existingBooking) {
            return next(errorHandler(400, 'You have booked already'));
        }
        const room = await Room.findById(roomId);
        if (!room) {
            return next(errorHandler(404, 'Room not found'));
        }
        // check for selected rooms
        const selectedRoom = room.roomNumbers.find((rnum) => rnum.number === roomNumber);
        if(!selectedRoom) {
            return next(errorHandler(404, 'Room number not found'));
        }
        // check for availability
        const isUnavailable = selectedRoom.unavailableDates.some((date) => date >= new Date(startDate) && date <= new Date(endDate));
        if(isUnavailable) {
            return next(errorHandler(400, 'Room is not available for this dates'))
        }
        selectedRoom.unavailableDates.push(...getDateRange(startDate, endDate));
        await room.save();
        const newBooking = await Booking.create({
            user: userId,
            room: roomId,
            bookingDate: new Date()
        })

        // To send an email for confirmation
        // const user = req.user;
        const user = await User.findById(userId)
        const emailSent = await sendEmail(user.email, {
            subject: 'Booking confirmation',
            message: `Dear ${user.userName}, \n\n You have successfully booked the room: ${room.title} (Room Number: ${roomNumber}).<br>Details:\n- <br>Price: ${room.price}\n<br>- Description: ${room.desc}\n<br>- Dates: ${startDate} to ${endDate}\n\n<br>Thank you for booking with us!`
        })
        if (!emailSent) {
            return next(errorHandler(500, 'Email not sent'));
        }

        res.status(201).json({
            message: 'Room booked successfully',
            data: newBooking
        }) 

    } catch (err) {
        next (err)
    }
}

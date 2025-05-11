import cron from 'node-cron';
import Room from '../models/rooms.js';

cron.schedule('0 0 * * *', async (next) => {
    try {
        const rooms = await Room.find();
        for ( const room of rooms) {
            room.roomNumbers.forEach((roomNumber) => {
                const originalDates = [...roomNumber.unavailableDates];
                roomNumber.unavailableDates = roomNumber.unavailableDates.filter((date) => new Date(date) >= new Date())
                console.log(`Room $room._id}, Room number ${roomNumber.number}:`) 
                console.log(`Original Dates: ${originalDates}`);
                console.log(`Updated Dates: ${roomNumber.unavailableDates}`);
            })
            await room.save();
            console.log(`Room ${room._id} updated successfully`);
        }
        console.log('Expired dates cleaned successfully');
        
    } catch (err) {
        console.error('Error cleaning expired dates:', err);
    }
})
import Room from '../models/rooms.js';
import Hotels from '../models/hotels.js';
import errorHandler from '../middlewares/errors/errHandling.js';

export const createRoom = async(req, res, next) => {
    const hotelId = req.params.hotelId
    try {
        const existingRoom = await Room.findOne({ title: req.body.title})  //Check existing rooms
        if (existingRoom) {
                return res.status(400).json({message: "Room already exists"})
            }
            const newRoom = new Room(req.body)
            const savedRooms = await newRoom.save()
        try {
            await Hotels.findByIdAndUpdate(hotelId, {$push: {rooms: savedRooms._id}
            })
        } catch (err) {
            next(err)
        } res.status(200).json({
            message: "Room created successfully",
            savedRooms
        })
    } 
    catch(err){
        return next(err)
    }
} 


export const updateRoom = async(req, res, next) => {
    const { roomId } = req.params
    console.log("Request Params:", req.params); // Log the entire req.params object
    console.log("roomId ID:", roomId); //Debugging
    try {
        const findRoom = await Room.findByIdAndUpdate(roomId, {$set: req.body}, {new: true} )
        if (!findRoom) {
            return next(errorHandler(400, "Room does not exist"))
        }
        return res.status(200).json({
            message: "Updated successfully",
            data: findRoom
        })
    } catch (err) {
        console.error({error: "Error", err}) 
        return next(err)
    }
}


export const getRooms = async(req, res, next) => {
    try {
        const rooms =await Room.find()
        if (!rooms) {
            return next(errorHandler(400,"No rooms found"))
        }
            return res.status(200).json({
                message: "Rooms successfully retrieved", rooms})
    } catch (err) {
        console.log({error: "Error", err}) 
        next(err)
}
}
export const getRoom = async(req, res, next) => {
    const { roomId } = req.params
    try {
        const getRoom = await Room.findById(roomId)
        if (!getRoom) {
            return res.status(400).json({message: "Room does not exist"})
        }
            return res.status(200).json({message: "Room successfully retrieved", getRoom})
    } catch (err) {
        next(err)
    }
}

export const delRoom = async(req, res) => {
    try {
        const deleteRoom = await Room.findByIdAndDelete(req.params.roomId)
        if (!deleteRoom) {
            return res.status(400).json({message: "Room does not exist"})
        }
        try {
            await Hotels.findByIdAndUpdate(req.params.hotelId, {$pull: {rooms: req.params.roomId}})  //Find and remove room from hotel
        } catch (err){
            next(err)
        }
            return res.status(200).json({message: "Room successfully deleted"})
    } catch (err) {
        return next(err)
    }
}

export const updateRoomAvailability = async(req, res, next) =>{
    try {
        await Room.updateOne(
            {"roomNumbers._id": req.params.roomNumberId},
        {
            // '$' sign used to catch the info in a nested list
            $push: {
            "roomNumbers.$.unavailableDate": req.body.dates
        }
        }
        ); return res.status(200).json({
            message: "Room status updated successfully"
        })      
    } catch (err) {
        next(err)
    }
    
}



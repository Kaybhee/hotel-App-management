import Hotels from '../models/hotels.js'
import Room from '../models/rooms.js'


export const createHotels = async(req, res) => {
    const newHotel = new Hotels(req.body) 
    try {
        const existingHotel = await Hotels.findOne({hotelType: newHotel.hotelType})
        // const savedHotel = await newHotel.save()
        if (existingHotel) {
            return res.status(400).json({message: "Hotel already exists"});
        }
        const savedHotel = await newHotel.save()
        console.log(savedHotel)                                                     
        return res.status(200).json({message: "Hotel saved successfully", savedHotel})

    } catch (e) {
        console.error("Server Error: ", e) //log all errors
        res.status(500).json({message: "Error saving hotel", e}) 
    }
}


export const updateHotels = async(req, res) => {
    const { hotelId } = req.params
    console.log("Request Params:", req.params); // Log the entire req.params object
    console.log("Hotel ID:", hotelId); // Log t
    try {
        console.log(hotelId)
        const findHotels = await Hotels.findById(hotelId)
        if (!findHotels) {
            return res.status(400).json({message: "Hotel does not exist"})
        }
        // findHotels.firstName = findHotels || findHotels.firstName
        /*
        if (req.body.hotelType && req.body.upHotels.hotelType !== findHotels.hotelType) {
            return res.status(400).json({message: "Hotel type cannot be updated"})}
        if (req.body.title && req.body.upHotels.title !== findHotels.title) {
            return res.status(400).json({message: "Title cannot be updated"})}
        */
        if (req.body.hotelType || req.body.title) {
            return res.status(400).json({message: "Hotel type and title cannot be updated"})
        }

        findHotels.city = req.body.city || findHotels.city
        findHotels.address = req.body.address || findHotels.address
        findHotels.distance = req.body.distance || findHotels.distance
        findHotels.desc = req.body.desc || findHotels.desc
        findHotels.rooms = req.body.rooms || findHotels.rooms
        findHotels.ratings = req.body.ratings || findHotels.ratings
        findHotels.available = req.body.available || findHotels.available
        findHotels.cheapestRooms = req.body.cheapestRooms || findHotels.cheapestRooms

        await findHotels.save()
        console.log(findHotels)
        return res.status(200).json({message: "Updated Successfully", findHotels})
    } catch (e) {
        console.error({error: "Error", e}) //Log errors
        return res.status(500).json("Server Error")
    }
}


export const getHotels = async(req, res) => {
    try {
        const getHotels =await Hotels.find()
        if (!getHotels) {
            return res.status(400).json({message: "No hotels found"})
        } else {
            return res.status(200).json({message: "Hotels successfully retrieved", getHotels})
        }
    } catch (e) {
        console.log({error: "Error", e}) // Log all errors
        return res.status(500).json({message: "Server error"})
    }
}
export const getHotel = async(req, res) => {
    const { hotelId } = req.params
    try {
        const getHotel = await Hotels.findById(hotelId)
        if (!getHotel) {
            return res.status(400).json({message: "Hotel does not exist"})
        } else {
            return res.status(200).json({message: "Hotel successfully retrieved", getHotel})
        }
    } catch (e) {
        console.error({error: "Error", e}) // Log errors
        return res.status(500).json({message: "Server error"})
    }
}

export const delHotels = async(req, res) => {
    const { hotelId } = req.params
    try {
        const deleteHot = await Hotels.findByIdAndDelete(hotelId)
        if (!deleteHot) {
            return res.status(400).json({message: "Hotel does not exist"})
        } else {
            return res.status(200).json({message: "Hotel successfully deleted", deleteHot})
        } 
    } catch (e) {
        console.log(e)
        return res.status(500).json({message: "Server Error"})
    }
}

export const getHotelRooms = async(req, res, next) =>{
    // const 
    try {
        const hotel = await Hotels.findById(req.params.hotelId)
        const data = await Promise.all(hotel.rooms.map((room) => {
            return Room.findById(room)
        })
    ); res.status(200).json({message: "Hotel rooms successfully retrieved", data})
    } catch (err) {
        next(err)
    }
}



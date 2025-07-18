import Hotels from '../models/hotels.js'
import Room from '../models/rooms.js'
import errorHandler from '../middlewares/errors/errHandling.js'


export const createHotels = async(req, res, next) => {
    const newHotel = new Hotels(req.body)
    try {
        const existingHotel = await Hotels.findOne({hotelName: newHotel.hotelName, title: newHotel.title})
        const hotelAddress = await Hotels.findOne({address: newHotel.address})
        if (existingHotel && hotelAddress) {
            return next(errorHandler(400, "Hotel already exists"));
        }
        const savedHotel = await newHotel.save()
        // console.log(savedHotel)                                                     
        return res.status(200).json({message: "Hotel saved successfully", savedHotel})

    } catch (err) {
        next(err)
    }
}


export const updateHotels = async(req, res) => {
    const { hotelId } = req.params
    // console.log("Request Params:", req.params); // Log the entire req.params object
    // console.log("Hotel ID:", hotelId); // Debugging
    try {
        console.log(hotelId)
        const findHotels = await Hotels.findById(hotelId)
        if (!findHotels) {
            return next(errorHandler(404, "Hotel does not exist"))
        }
        if (req.body.hotelName || req.body.title) {
            return next(errorHandler(400, "Hotel name and title cannot be updated"))
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
    } catch (err) {
        next(err)
    }
}


export const getHotels = async(req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const startIndex = (page - 1) * limit;
        const totalPages = await Hotels.countDocuments({isDelete: false});
        const returnHotels = await Hotels.find({ isDelete: false }).skip(startIndex).limit(limit)
        console.log(returnHotels)
        // const getHotels =await Hotels.find()
        if (!returnHotels) {
            return next(errorHandler(404, "No hotels found"))
        } else {
            return res.status(200).json({message: "Hotels successfully retrieved", data: {pages: Math.ceil(totalPages / limit), currentPage: page, hotels: returnHotels}})
        }
    } catch (err) {
        next(err)
    }
}
export const getHotel = async(req, res, next) => {
    const { hotelId } = req.params
    try {
        const getHotel = await Hotels.findById(hotelId)
        if (!getHotel) {
            return next(errorHandler(404,"Hotel does not exist"))
        } else {
            return res.status(200).json({message: "Hotel successfully retrieved", data: getHotel})
        }
    } catch (err) {
        next(err)
    }
}

export const delHotels = async(req, res, next) => {
    const { hotelId } = req.params
    try {
        const deleteHot = await Hotels.findByIdAndUpdate(hotelId, { isDelete: true }, {new: true})
        // await deleteHot.save()
        if (!deleteHot) {
            return next(errorHandler(404, "Hotel does not exist"))
        } else {
            return res.status(200).json({message: "Hotel successfully deleted", data: deleteHot})
        } 
    } catch (err) {
        next(err)
    }
}

export const getHotelRooms = async(req, res, next) =>{
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



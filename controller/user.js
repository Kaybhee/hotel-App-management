import User from '../models/user.js'
import Hotels from '../models/hotels.js'

export const createUser = async(req, res) => {
    const { firstName, lastName, email, password } = req.body;
    try {
        if (!firstName || !lastName || !email || !password) {
            return res.status(400).json({ message: "Please fill in all fields" });
        }
        const existingUser = await User.findOne({email});
        if (existingUser) {
            return res.status(400).json({message: "Email already exists"});
        }
        if (password.length < 8) {
            return res.status(400).json({message: "Password must be at least 8 characters"})
        }

        const user = await User.create({
            firstName,
            lastName,
            email,
            password
        })

        console.log(user)
        res.status(200).json({message: 'User created successfully', user})

    } catch (error) {
		// Check if there are validation errors e.g length of password, special keys or uppercase in password
		if (error.name === "ValidationError") {
		  const firstError = Object.values(error.errors)[0].message;
		  return res.status(400).json({ message: firstError });
		}
		console.error("Server Error:", error); 
		res.status(500).json({ message: "Server Error" });
	}
}

export const createHotels = async(req, res) => {
    const newHotel = new Hotels(req.body)
    try {
        const savedHotel = await newHotel.save()
        console.log(savedHotel)
        res.status(200).json({message: "Hotel saved successfully", savedHotel})

    } catch (e) {
        console.error("Server Error: ", e) //log all errors
        res.status(500).json({message: "Error saving hotel", e}) 
    }
}

export const getAvailableRooms = async(req, res) =>{

}

export const getRoom = async(req, res) => {

}

export const getAllRooms = async(req, res) => {

}

export const changePrices = async(req, res) => {

}
export const changeStatus = async(req, res) => {

}



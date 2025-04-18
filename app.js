import express from 'express';
import mongoose from 'mongoose';
import MONGODB_URI from './config/const.js';
import hotelRoutes from './routes/hotelRoutes.js'
const PORT = 5000

const app = express()

export const connectDB = async() => {
    try {
        const conn = await mongoose.connect(MONGODB_URI);
    console.log(`MONGODB CONNECTED: ${conn.connection.host}`)
    } catch (e) {
        console.error(`Error: ${e.message}`)
        Promise.exit(1)
    }
}

// middlewares
app.use(express.json())
app.use(morgan('dev'))
// routes 
app.use('api/v1/hotels', hotelRoutes)

// Connect to mongoDB
app.listen(PORT || MONGODB_URI, () => {
    console.log(`Server is running at http://localhost:${PORT}`)
})
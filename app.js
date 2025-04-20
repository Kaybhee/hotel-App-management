import express from 'express'
import { connectDB } from './config/db.js';
import hotelRoutes from './routes/hotelRoutes.js'
import morgan from 'morgan'
const PORT = 5000

// Connect to database
connectDB()

// express application
const app = express()
// middlewares
app.use(express.json())
app.use(morgan('dev'))
// routes 
app.use('/api/v1/hotels', hotelRoutes)

// Connect to mongoDB
app.listen(PORT || MONGODB_URI, () => {
    console.log(`Server is running at http://localhost:${PORT}`)
})
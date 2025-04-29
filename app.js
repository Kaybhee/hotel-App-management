import express from 'express'
import { connectDB } from './config/db.js';
import hotelRoutes from './routes/hotelRoutes.js'
import authRoutes from './routes/authRoutes.js'
import errCheck from './middlewares/errors/error.js';
import userRoutes from './routes/userRoutes.js';
import roomRoutes from './routes/roomRoutes.js';
import dotenv from 'dotenv'
import morgan from 'morgan'
dotenv.config()
export const MONGODB_URI = process.env.MONGODB_URI
export const JWT_SECRET = process.env.JWT_SECRET
export const ADMIN_SECRET = process.env.ADMIN_SECRET
const PORT = 5000

// Connect to database
connectDB()

// express application
const app = express()
app.get('/', (req, res) => {
    res.send('API is running...');
  });
// middlewares
app.use(express.json())
app.use(morgan('dev'))
// routes 
app.use('/api/v1/hotels', hotelRoutes)
app.use('/api/v1/auth', authRoutes)
app.use('/api/v1', userRoutes)
app.use('/api/v1/room', roomRoutes)
// app.use('/api/v1/users', (req, res, next) => {
//     console.log('Request reached /api/v1/users');
//     next();
//   }, userRoutes);
// console.log('user routes loaded')
// Error middleware
app.use(errCheck);
// Connect to mongoDB
app.listen(PORT || MONGODB_URI, () => {
    console.log(`Server is running at http://localhost:${PORT}`)
})
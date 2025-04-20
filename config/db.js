import express from 'express';
import mongoose from 'mongoose';
import morgan from 'morgan'
import MONGODB_URI from '../const.js';
import hotelRoutes from '../routes/hotelRoutes.js';
const PORT = 5000

const app = express()

export const connectDB = async() => {
    try {
        const conn = await mongoose.connect(MONGODB_URI);
        console.log(`MONGODB CONNECTED: ${conn.connection.host}`)
    } catch (e) {
        console.error(`Error: ${e.message}`)
        process.exit(1)
    }
}

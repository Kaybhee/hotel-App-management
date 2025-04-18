import express from 'express';
import mongoose from 'mongoose';
import MONGODB_URI from './config/const.js';
const PORT = 5000

const app = express()
app.use(express.json())
export const connectDB = async() => {
    try {
        const conn = await mongoose.connect(MONGODB_URI);
    console.log(`MONGODB CONNECTED: ${conn.connection.host}`)
    } catch (e) {
        console.error(`Error: ${e.message}`)
        Promise.exit(1)
    }
}


app.listen(PORT || MONGODB_URI, () => {
    console.log(`Server is running at http://localhost:${PORT}`)
})
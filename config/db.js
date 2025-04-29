import express from 'express';
import mongoose from 'mongoose';
import { MONGODB_URI } from '../app.js';

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

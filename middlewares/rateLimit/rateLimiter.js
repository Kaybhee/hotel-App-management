import express from 'express';
import rateLimit from 'express-rate-limit';

export const limiter = rateLimit({
    windowMs : 20 * 60 * 1000, //20 minutes
    max : 3,
    standardHeaders : true,
    legacyHeaders : false,
    
    message : {
        status : false,
        message : "Too many verification request. Please wait 20 minutes to make another request"
    }
})


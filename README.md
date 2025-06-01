# Hotel-App-Management

A comprehensive Node.js API for hotel and room management, user registration with OTP email verification, and reservation history. This project uses Express, MongoDB, Node Cron for scheduled tasks, and features robust authentication and role-based access.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Models](#models)
- [Getting Started](#getting-started)
- [Step-by-Step Usage](#step-by-step-usage)
  - [1. User Signup & OTP Verification](#1-user-signup--otp-verification)
  - [2. User Login](#2-user-login)
  - [3. Hotel & Room Management (Admin)](#3-hotel--room-management-admin)
  - [4. Room Booking (User)](#4-room-booking-user)
  - [5. Reservation History](#5-reservation-history)
  - [6. Node Cron Jobs](#6-node-cron-jobs)
  - [7. API Documentation (Swagger)](#7-api-documentation-swagger)
- [Deployment](#deployment)
- [Controllers Overview](#controllers-overview)
- [How to Use the API via Swagger](#how-to-use-the-api-via-swagger)

---

## Features

- User registration with OTP email verification
- JWT authentication
- Admin and user roles
- Hotel and room CRUD operations (admin only)
- Room booking with date availability checks
- Reservation history for users
- Email notifications for OTP and bookings
- Automated cleanup of expired room dates using Node Cron
- Swagger API documentation

---

## Tech Stack

- Node.js, Express.js
- MongoDB (Mongoose)
- Nodemailer (for emails)
- Node Cron (for scheduled jobs)
- Swagger (API docs)
- dotenv, morgan, cors

---

## Models

### User Model
- `userName`: String
- `email`: String (unique)
- `password`: String (hashed)
- `role`: String (`user` or `admin`)
- `isVerified`: Boolean
- `otp`: String (for email verification)
- `otpExpires`: Date

### Hotel Model
- `name`: String
- `location`: String
- `rooms`: [Room references]

### Room Model
- `hotel`: Hotel reference
- `roomNumber`: String
- `type`: String (e.g., single, double)
- `price`: Number
- `unavailableDates`: [Date ranges]

### Booking Model
- `user`: User reference
- `room`: Room reference
- `roomNumber`: String
- `startDate`: Date
- `endDate`: Date
- `status`: String (e.g., booked, cancelled)

---

## Getting Started

1. **Clone the repository:**
   ```sh
   git clone https://github.com/Kaybhee/hotel-App-management.git
   cd hotel-App-management
2. **Install dependencies:**
    ```sh 
    npm install
3. **Set up environment variables:**
    * Create a .env file with:
    ```sh 
    MONGODB_URI=your_mongodb_uri
    JWT_SECRET=your_jwt_secret
    ADMIN_SECRET=your_admin_secret
    EMAIL_USER=your_email
    EMAIL_PASS=your_email_password
4. **Start the server:**
    ```sh 
    npm start

## Step-by-Step Usage

### 1. User Signup & OTP Verification

**Signup:**  
- **Endpoint:** `POST /api/v1/auth/create-user`
- **Body:**  
  ```json
  {
    "userName": "yourName",
    "email": "your@email.com",
    "password": "yourPassword"
  }
* Description: An OTP is sent to your email for verification.
Verify OTP:

* Endpoint: PATCH /api/v1/auth/verify-user-registration
**Body:**
    ```sh
    {
    "email": "your@email.com",
    "otp": "123456"
    }
* Description: Provide your email and the OTP code to activate your account.
Resend OTP:

* Endpoint: POST /api/v1/auth/resend-user-otp
**Body:**
    ```sh
    {
    "email": "your@email.com"
    }
* Description: Use if the OTP expires or is lost.
2. User Login
Login:

* Endpoint: POST /api/v1/auth/login
**Body:**
    ```sh
    {
  "email": "your@email.com",
  "password": "yourPassword"
}
* Description: Receive a JWT token for authentication.
 Hotel & Room Management (Admin)
Create Hotel:

* Endpoint: POST /api/v1/hotels/create-hotels
* Headers: Authorization: Bearer <admin_token>
* Description: Create a new hotel (admin only).
Update Hotel:

* Endpoint: PUT /api/v1/hotels/update-hotels/:hotelId
* Headers: Authorization: Bearer <admin_token>
Delete Hotel:

* Endpoint: DELETE /api/v1/hotels/delete-hotel/:hotelId
* Headers: Authorization: Bearer <admin_token>
Create Room:

* Endpoint: POST /api/v1/room/create-room/:hotelId
* Headers: Authorization: Bearer <admin_token>
Update Room:

* Endpoint: PUT /api/v1/room/update-room/:roomId
* Headers: Authorization: Bearer <admin_token>
Delete Room:

* Endpoint: DELETE /api/v1/room/delete-room/:roomId/:hotelId
* Headers: Authorization: Bearer <admin_token>
4. Room Booking (User)
Book a Room:

* Endpoint: POST /api/v1/room/book-room
**Body:**
    ```sh
    {
  "userId": "user_id",
  "roomId": "room_id",
  "roomNumber": "101",
  "startDate": "YYYY-MM-DD",
  "endDate": "YYYY-MM-DD"
}
* Description: Checks for availability and sends a confirmation email.
5. Reservation History
View Bookings:

* Endpoint: GET /api/v1/booking/user-bookings/:userId
* Description: Returns all bookings for the user.

6. Node Cron Jobs
Automated Cleanup:
Node Cron is used to schedule a job that runs periodically (e.g., daily) to remove expired dates from each room's ```unavailableDates``` array.
This ensures that past bookings do not block future reservations.

**Example (```jobs/cleanDates.js```):**
    ```sh
    const cron = require('node-cron');
const Room = require('../models/Room');

cron.schedule('0 0 * * *', async () => {
  const today = new Date();
  await Room.updateMany(
    {},
    { $pull: { unavailableDates: { endDate: { $lt: today } } } }
  );
  console.log('Expired unavailable dates cleaned up');
});
7. API Documentation (Swagger)
* Access the full API docs:
https://hotel-app-management.onrender.com/api-docs


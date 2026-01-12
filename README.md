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
- `isDelete`: Boolean

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
   -- Brevo API [Click Here](https://app.brevo.com/settings/keys/api) is used for our mailing system due to the deployment on render not accepting sending free emails to available ports.
    * Create a .env file with:
    ```sh 
    MONGODB_URI=your_mongodb_uri
    JWT_SECRET=your_jwt_secret
    ADMIN_SECRET=your_admin_secret
    EMAIL_USER=your_email
    BREVO_API=yourapi
    APP_URL=oururl
    VERIFICATION_SECRET=yourverificationsecret

5. **During Development**
   ```sh
   npm install nodemon
   run the starting file using nodemon to watch file changes
    
5. **Start the server:**
    ```sh 
    npm start
    

## Step-by-Step Usage

### 1. User Signup & Link Verification

**Signup:**  
- **Endpoint:** `POST /api/v1/auth/create-user`
- **Body:**  
  ```json
  {
    "userName": "yourName",
    "email": "your@email.com",
    "password": "yourPassword"
  }
- **Description:** A verification link is sent to your email for verification and it expires in 10 minutes.

**Verify LINK:**
- **Endpoint:** `GET /api/v1/auth/verify-email`
- **Body:**
    ```sh
    {
    "token" : provide token
    }
- **Description:** Provide token to activate your account or skip this step if the email sent for verification has been clicked ON.

**Resend URL:**
- **Endpoint:**`GET /api/v1/auth/resend-link`
- **Body:**
    ```sh
    {
    "email": "your@email.com"
    }
- ** Rate Limiter:** The express-rate-limiter is used to prevent spam resending of emails. The rate limiter is set to 3 max verification emails per every 20 minutes for any user.
- **Description:** The verification link expires in 10 minutes
---
### 2. User Login
**Login:**
- **Endpoint:** `POST /api/v1/auth/login`
- **Body:**
    ```sh
    {
    "email": "your@email.com",
    "password": "yourPassword"
    }
- **Description:** Receive a JWT token for authentication.
---
### 3. Hotel & Room Management (Admin)
**Create Hotel:**

- **Endpoint:** `POST /api/v1/hotels/create-hotels`
- **Headers:** `Authorization: Bearer <admin_token>`
- **Description:** Create a new hotel (admin only).

**Update Hotel:**

- **Endpoint:** `PUT /api/v1/hotels/update-hotels/:hotelId`
- **Headers:** `Authorization: Bearer <admin_token>`

**Delete Hotel:**

- **Endpoint:** `DELETE /api/v1/hotels/delete-hotel/:hotelId`
- **Headers:** `Authorization: Bearer <admin_token>`

**Create Room:**

- **Endpoint:** `POST /api/v1/room/create-room/:hotelId`
- **Headers:** `Authorization: Bearer <admin_token>`

**Update Room:**

- **Endpoint:** `PUT /api/v1/room/update-room/:roomId`
- **Headers:** `Authorization: Bearer <admin_token>`

**Delete Room:**

- **Endpoint:** `DELETE /api/v1/room/delete-room/:roomId/:hotelId`
- **Headers:** `Authorization: Bearer <admin_token>`
---
### 4. Room Booking (User)
**Book a Room:**

- **Endpoint:**`POST /api/v1/room/book-room`
- **Body:**
    ```sh
    {
    "userId": "user_id",
    "roomId": "room_id",
    "roomNumber": "101",
    "startDate": "YYYY-MM-DD",
    "endDate": "YYYY-MM-DD"
    }
- **Description:** Checks for availability and sends a confirmation email.
---
### 5. Reservation History
**View Bookings:**

- **Endpoint:** `GET /api/v1/booking/user-bookings/:userId`
- **Description:** Returns all bookings for the user.
---
### 6. Node Cron Jobs
**Automated Cleanup:**<br>
Node Cron is used to schedule a job that runs periodically (e.g., daily) to remove expired dates from each room's ```unavailableDates``` array.<br>
This ensures that past bookings do not block future reservations.

**Example (```jobs/cleanDates.js```):**<br>

    ```sh        
    cron.schedule('0 0 * * *', async (next) => {
        try {
            const rooms = await Room.find();
            for ( const room of rooms) {
                room.roomNumbers = room.roomNumbers.filter((roomNumber) => {
                    if (!roomNumber.number) {
                        console.warn(`Skipping roomNumber in room ${room._id} due to missing number`)
                        return false;
                    }
                    return true;
                })
                room.roomNumbers.forEach((roomNumber) => {
                    const originalDates = [...roomNumber.unavailableDates];
                    roomNumber.unavailableDates = roomNumber.unavailableDates.filter((date) => new Date(date) >= new Date())
                
                })
                await room.save();
            }
            console.log('Expired dates cleaned successfully');
        } catch (err) {
            console.error('Error cleaning expired dates:', err);
        }
    })

---
### 7. API Documentation (Swagger)
- **Access the full API docs:**<br>
https://hotel-app-management.onrender.com/api-docs
---
### Deployment
- **Production:** <br>
https://hotel-app-management.onrender.com
- **Swagger Docs:**<br>
https://hotel-app-management.onrender.com/api-docs
---
### Controllers Overview
- **User/Auth:**<br>
Handles registration, OTP, login, and user CRUD (controller/users.js, controller/auth.js)
- **Hotel:**<br>
CRUD for hotels (controller/hotel.js)
- **Room:**<br>
CRUD for rooms, update availability (controller/room.js)
- **Booking:**<br>
Room booking logic, email confirmation (controller/booking.js)
---
### How to Use the API via Swagger
1. **Open Swagger UI:**<br>
Go to https://hotel-app-management.onrender.com/api-docs

2. **Register a User:**<br>
Use `/auth/create-user` and check your email for link.

3. **Verify Account:**<br>
The `/auth/verify-email` sends a verification link to your email.

4. **Login:**<br>
Use `/auth/login` to get your JWT token.

5. **Authorize:**<br>
Click "Authorize" in Swagger UI and paste your JWT token as `Bearer <token>`.

6. **Admin Access:**  
   - To perform admin operations (like creating hotels or rooms), you must log in as an admin.
   - Admin accounts are typically created by providing a special `ADMIN_SECRET` during registration or are seeded by the developer.
   - When registering an admin, include the `adminSecret` field in your request body:
     ```json
     {
       "userName": "adminName",
       "email": "admin@email.com",
       "password": "yourPassword",
       "adminSecret": "your_admin_secret"
     }
     ```
   - If the `adminSecret` matches the value in your [.env](http://_vscodecontentref_/0) file (`ADMIN_SECRET`), the user will be assigned the `admin` role.


7. **Explore Endpoints:**<br>

- **Admins:** <br>Manage hotels and rooms.
- **Users:** <br>Book rooms, view bookings, etc.
7. **Booking:**<br>
Use `/room/book-room` with required details.
---
**Reference:**
* Lama Dev

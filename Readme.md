# VideoTube-Backend-Service

The VideoTube-Backend-Service is a robust backend system designed to support a video-sharing platform. It provides the essential server-side functionalities required to manage user interactions with video content. This includes user authentication, profile management, video watch history, and handling user-generated content such as avatars and cover images.

## Features

- User Registration and Login system with secure password storage
- JSON Web Token (JWT) based authentication for securing endpoints
- User profile management including avatar and cover image upload with Cloudinary integration
- User watch history tracking to provide personalized content
- Channel profile information management for content creators
- Access and Refresh Token handling for maintaining user sessions

## Tech Stack

- **Node.js**: JavaScript runtime for building fast, scalable network applications
- **Express.js**: Web application framework for Node.js designed for building web applications and APIs
- **MongoDB**: NoSQL database for modern applications with a powerful query language
- **Mongoose**: Object Data Modeling (ODM) library for MongoDB and Node.js
- **jsonwebtoken**: Implementation of JSON Web Tokens for Node.js
- **bcrypt**: Library for hashing and salting user passwords
- **Cloudinary**: Cloud service for managing web and mobile media assets

## Getting Started

### Prerequisites

- Node.js
- MongoDB
- Cloudinary account

### Installation

1. Clone the repository
2. Install dependencies with `npm install`
3. Set up your environment variables in a `.env` file
4. Start the server with `npm start`

## API Endpoints

The service exposes several RESTful endpoints for user management:

- POST `/api/v1/users/register`
- POST `/api/v1/users/login`
- POST `/api/v1/users/logout`
- POST `/api/v1/users/refresh-token`
- POST `/api/v1/users/change-password`
- GET `/api/v1/users/current-user`
- PATCH `/api/v1/users/update-account`
- PATCH `/api/v1/users/avatar`
- PATCH `/api/v1/users/cover-image`
- GET `/api/v1/users/c/:username`
- GET `/api/v1/users/history`

## Contributing

Contributions are welcome. Please open an issue to discuss your ideas or submit a pull request.
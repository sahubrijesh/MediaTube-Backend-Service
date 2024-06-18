# MediaTube-Backend-Service

The MediaTube-Backend-Service is a robust backend system designed to support a video-sharing platform. It provides the essential server-side functionalities required to manage user interactions with video content. This includes user authentication, profile management, video watch history, and handling user-generated content such as avatars and cover images.

## Features

- Secure user registration and login system
- JWT-based authentication to secure endpoints
- Profile management with avatar and cover image uploads using Cloudinary
- Tracking of user watch history for personalized content suggestions
- Channel profile management for content creators
- Session management with Access and Refresh Tokens

## Tech Stack

- Node.js for the JavaScript runtime environment
- Express.js as the web application framework
- MongoDB as the NoSQL database
- Mongoose ODM for MongoDB interaction
- JSON Web Tokens for authentication
- Bcrypt for password hashing
- Cloudinary for media asset management

## Getting Started

### Prerequisites

- Node.js installed on your machine
- MongoDB installed and running
- A Cloudinary account for media uploads

### Installation

1. Clone the repository to your local machine
2. Navigate to the `backend` folder
3. Install dependencies with `npm install`
4. Set up your environment variables in a `.env` file

    ```env
    PORT=your_port
    MONGODB_URI=your_mongodb_uri
    CLOUDINARY_URL=your_cloudinary_url
    JWT_SECRET=your_jwt_secret
    ```

5. Run the server using `npm start`

## API Endpoints

### User Management
- `POST /users/register`: Register a new user.
- `POST /users/login`: User login.
- `POST /users/refresh-token`: Refresh auth tokens.
- `GET /users/current`: Get current user details.
- `PATCH /users/update`: Update user profile.

### Video Management
- `POST /videos`: Upload a video.
- `GET /videos`: List all videos.
- `GET /videos/{id}`: Retrieve a video.
- `DELETE /videos/{id}`: Delete a video.

### Channel Management
- `GET /channels/{id}`: Get channel details.
- `PATCH /channels/{id}`: Update channel info.

### Interactions
- `POST /videos/{id}/comments`: Comment on a video.
- `GET /videos/{id}/likes`: Like a video.
- `GET /videos/{id}/likes`: Unlike a video.

### History
- `GET /users/history`: Get watch history.
- `POST /users/history`: Add to watch history.

## Contributing

We welcome contributions to the MediaTube-Backend-Service. If you have ideas for improvements or notice any issues, please open an issue first to discuss what you would like to change. For direct contributions, you can fork the repository and submit a pull request.

## Acknowledgments

- Thanks to all the contributors who invest their time into improving this project.

## Contact Information

For any inquiries or further discussions, you can contact the project maintainer at:

- Email: thebrijeshsahu@gmail.com
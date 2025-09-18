<img width="1904" height="1022" alt="Screenshot 2025-09-18 125709" src="https://github.com/user-attachments/assets/08a2099e-4b17-4781-a644-e56691a00d8a" />
<img width="869" height="877" alt="Screenshot 2025-09-18 165106" src="https://github.com/user-attachments/assets/fa50e594-b309-4324-b072-962a284d0a1c" />
<img width="1200" height="877" alt="image" src="https://github.com/user-attachments/assets/64c0af1f-15cc-48f3-be03-a54d088ba9fa" />
# Chat App

A real-time chat application built with React, Node.js, Express, MongoDB, and Socket.io.

## Features

- User authentication (register/login)
- Real-time messaging
- Online/offline status
- User search
- Responsive design

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS, Vite
- **Backend**: Node.js, Express, Socket.io
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT tokens

## Quick Start

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or cloud)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory:
   ```
   PORT=5000
   MONGO_URL=mongodb://localhost:27017/chat-app
   JWT_SECRET=your-secret-key-here
   CLIENT_URL=http://localhost:5173
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

This will start both the backend server (port 5000) and frontend development server (port 5173).

### Using Docker

```bash
docker-compose up
```

## Project Structure

```
├── server/                 # Backend code
│   ├── controllers/        # Route controllers
│   ├── middleware/         # Custom middleware
│   ├── models/            # Database models
│   ├── routes/            # API routes
│   └── index.js           # Server entry point
├── src/                   # Frontend code
│   ├── components/        # React components
│   ├── context/          # React context providers
│   ├── pages/            # Page components
│   └── main.tsx          # Frontend entry point
├── package.json           # Dependencies and scripts
└── vite.config.ts         # Vite configuration
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/profile` - Update user profile
- `PUT /api/users/status` - Update user status

### Messages
- `POST /api/messages` - Send message
- `GET /api/messages/conversation/:userId` - Get conversation
- `GET /api/messages/conversations` - Get all conversations
- `PUT /api/messages/read` - Mark messages as read

## Socket Events

- `user_connected` - User connects
- `send_message` - Send message
- `receive_message` - Receive message
- `typing` - Typing indicator
- `user_status` - User online/offline status

## Development

- Frontend runs on `http://localhost:5173`
- Backend runs on `http://localhost:5000`
- MongoDB runs on `mongodb://localhost:27017`

## License

MIT

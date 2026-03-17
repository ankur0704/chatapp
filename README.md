<img width="1904" height="1022" alt="Screenshot 2025-09-18 125709" src="https://github.com/user-attachments/assets/08a2099e-4b17-4781-a644-e56691a00d8a" />
<img width="869" height="877" alt="Screenshot 2025-09-18 165106" src="https://github.com/user-attachments/assets/fa50e594-b309-4324-b072-962a284d0a1c" />
<img width="1200" height="877" alt="image" src="https://github.com/user-attachments/assets/64c0af1f-15cc-48f3-be03-a54d088ba9fa" />

# 💬 Chat App

A **full-stack real-time chat application** built with React, TypeScript, Node.js, Express, MongoDB, and Socket.io. It supports instant messaging, user authentication, online/offline status tracking, friend requests, and a responsive modern UI.

---

## 📖 Project Overview

This Chat App is designed to provide a seamless, real-time communication experience between users. It follows a classic **client-server architecture** where:

- The **frontend** (React + TypeScript) runs in the browser and communicates with the backend via REST APIs and WebSockets.
- The **backend** (Node.js + Express) handles authentication, data persistence, and real-time events through Socket.io.
- **MongoDB** serves as the primary database, storing users, messages, and friend requests.
- **Socket.io** powers the live bidirectional communication so messages appear instantly without page refresh.

The project also ships with full **Docker** support, making it easy to spin up locally or deploy to any cloud environment.

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT (Browser)                         │
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │  React Pages │  │  Components  │  │   Context Providers  │  │
│  │              │  │              │  │                      │  │
│  │  • Login     │  │  • Navbar    │  │  • AuthContext       │  │
│  │  • Register  │  │  • Sidebar   │  │    (JWT + user state)│  │
│  │  • Home      │  │  • UsersList │  │  • ChatContext       │  │
│  │  • Chat      │  │  • ChatMsg   │  │    (messages,        │  │
│  │  • Profile   │  │  • MsgInput  │  │     conversations)  │  │
│  └──────┬───────┘  └──────────────┘  └──────────────────────┘  │
│         │  React Router (Protected Routes)                       │
└─────────┼───────────────────────────────────────────────────────┘
          │
          │  HTTP REST API  ──────────────────┐
          │  (Axios / fetch)                  │
          │                                   │
          │  WebSocket (Socket.io)  ───────────┤
          │                                   │
┌─────────┼───────────────────────────────────┼──────────────────┐
│         │         SERVER (Node.js)           │                  │
│         │                                   │                  │
│  ┌──────▼────────────────────────────────┐  │                  │
│  │           Express REST API            │  │                  │
│  │                                       │  │                  │
│  │  /api/auth      → authController      │  │                  │
│  │  /api/users     → userController      │  │                  │
│  │  /api/messages  → messageController   │  │                  │
│  │  /api/friends   → friendController    │  │                  │
│  └──────────────────────────────────────┘  │                  │
│                                             │                  │
│  ┌──────────────────────────────────────┐   │                  │
│  │          Socket.io Server            │◄──┘                  │
│  │                                       │                     │
│  │  Events:                              │                     │
│  │  • user_connected   (register user)   │                     │
│  │  • send_message     (relay message)   │                     │
│  │  • receive_message  (deliver msg)     │                     │
│  │  • typing           (typing status)   │                     │
│  │  • user_status      (online/offline)  │                     │
│  │  • disconnect       (cleanup)         │                     │
│  └──────────────────────────────────────┘                     │
│                                                                 │
│  ┌──────────────────────────────────────┐                      │
│  │          JWT Middleware               │                      │
│  │  Validates Bearer token on protected  │                      │
│  │  routes before reaching controllers   │                      │
│  └──────────────────────────────────────┘                      │
└─────────────────────────────────┬───────────────────────────────┘
                                  │  Mongoose ODM
                                  │
┌─────────────────────────────────▼───────────────────────────────┐
│                        MongoDB Database                          │
│                                                                 │
│  ┌──────────────┐  ┌──────────────────┐  ┌──────────────────┐  │
│  │  users       │  │  messages        │  │  friendrequests  │  │
│  │              │  │                  │  │                  │  │
│  │  • username  │  │  • sender (ref)  │  │  • requester     │  │
│  │  • email     │  │  • recipient     │  │  • recipient     │  │
│  │  • password  │  │    (ref)         │  │  • status        │  │
│  │    (hashed)  │  │  • content       │  │    (pending/     │  │
│  │  • picture   │  │  • read          │  │     accepted/    │  │
│  │  • status    │  │  • readAt        │  │     rejected)    │  │
│  │  • lastSeen  │  │  • timestamps    │  │  • timestamps    │  │
│  └──────────────┘  └──────────────────┘  └──────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔐 **User Authentication** | Register, login, and logout with JWT-based secure sessions |
| 💬 **Real-time Messaging** | Instant message delivery powered by Socket.io WebSockets |
| 👤 **Online/Offline Status** | Live presence indicators — see who's currently online |
| ✍️ **Typing Indicator** | Shows when the other person is composing a message |
| 📬 **Unread Message Count** | Badge showing the number of unread messages per conversation |
| 🤝 **Friend Requests** | Send, receive, and manage friend requests between users |
| 🔎 **User Search** | Search and discover other registered users |
| 🖼️ **Profile Management** | Update username and profile picture |
| 🌙 **Dark Mode** | Full dark/light mode support |
| 📱 **Responsive Design** | Works on desktop and mobile screens |
| 🐳 **Docker Support** | Ready-to-run Docker and docker-compose configuration |

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| **React 18** | UI library with hooks and context |
| **TypeScript** | Static type safety across the frontend |
| **Vite** | Fast build tool and dev server |
| **Tailwind CSS** | Utility-first styling |
| **React Router v6** | Client-side routing and protected routes |
| **Socket.io Client** | Real-time WebSocket connection |
| **Axios / Fetch** | HTTP client for REST API calls |

### Backend
| Technology | Purpose |
|---|---|
| **Node.js** | JavaScript runtime environment |
| **Express.js** | REST API web framework |
| **Socket.io** | Bi-directional WebSocket server |
| **Mongoose** | MongoDB ODM for schema modeling |
| **JSON Web Tokens (JWT)** | Stateless user authentication |
| **bcryptjs** | Secure password hashing |
| **dotenv** | Environment variable management |

### Database
| Technology | Purpose |
|---|---|
| **MongoDB** | NoSQL document database |

### DevOps / Tooling
| Technology | Purpose |
|---|---|
| **Docker** | Containerization |
| **docker-compose** | Multi-container orchestration |
| **nodemon** | Auto-restart server on file changes |

---

## 📁 Project Structure

```
chatapp/
├── server/                         # Backend (Node.js + Express)
│   ├── controllers/
│   │   ├── authController.js       # Register, login, get current user
│   │   ├── userController.js       # Get users, update profile/status
│   │   ├── messageController.js    # Send, fetch, mark-read messages
│   │   └── friendController.js     # Friend request management
│   ├── middleware/
│   │   └── auth.js                 # JWT verification middleware
│   ├── models/
│   │   ├── User.js                 # User schema (with bcrypt hooks)
│   │   ├── Message.js              # Message schema (sender, recipient, read)
│   │   └── FriendRequest.js        # Friend request schema (status enum)
│   ├── routes/
│   │   ├── auth.js                 # POST /register, /login, GET /me
│   │   ├── users.js                # GET /users, PUT /profile, /status
│   │   ├── messages.js             # POST /send, GET /conversation/:id
│   │   └── friends.js              # POST /request
│   ├── package.json
│   └── index.js                    # Server entry: Express + Socket.io + MongoDB
│
├── src/                            # Frontend (React + TypeScript)
│   ├── components/
│   │   ├── Navbar.tsx              # Top navigation bar
│   │   ├── Sidebar.tsx             # Conversation list sidebar
│   │   ├── UsersList.tsx           # Searchable user directory
│   │   ├── UserListItem.tsx        # Individual user list item
│   │   ├── ChatMessage.tsx         # Single message bubble
│   │   ├── MessageInput.tsx        # Text input with typing events
│   │   ├── Layout.tsx              # Page layout wrapper
│   │   └── ProtectedRoute.tsx      # Auth guard for private routes
│   ├── context/
│   │   ├── AuthContext.tsx         # Auth state: user, login, logout, token
│   │   └── ChatContext.tsx         # Chat state: messages, conversations
│   ├── pages/
│   │   ├── Login.tsx               # Login page
│   │   ├── Register.tsx            # Registration page
│   │   ├── Home.tsx                # Dashboard / conversation list
│   │   ├── Chat.tsx                # Active chat window
│   │   └── Profile.tsx             # User profile editor
│   ├── lib/                        # Utilities and helpers
│   ├── config.ts                   # Global config (API base URL, etc.)
│   ├── App.tsx                     # Root component with routing
│   └── main.tsx                    # React entry point
│
├── Dockerfile                      # Docker image definition
├── docker-compose.yml              # Multi-service setup (app + MongoDB)
├── vite.config.ts                  # Vite build configuration
├── tailwind.config.js              # Tailwind CSS configuration
├── package.json                    # Root scripts (runs both client + server)
└── .env                            # Environment variables
```

---

## 🔄 Data Flow

### Authentication Flow
```
User fills Login Form
      │
      ▼
POST /api/auth/login
      │
      ▼
authController validates credentials (bcrypt compare)
      │
      ▼
JWT token generated & returned
      │
      ▼
Frontend stores token → AuthContext
      │
      ▼
Token sent as Bearer header on every subsequent API call
```

### Real-time Messaging Flow
```
User A types a message → MessageInput
      │
      ├──► POST /api/messages  (persist to MongoDB)
      │
      └──► socket.emit('send_message', data)
                  │
                  ▼
          Socket.io Server
          looks up User B's socket ID
                  │
                  ▼
          socket.to(userBSocketId).emit('receive_message', data)
                  │
                  ▼
          User B's browser receives live message → ChatContext updates UI
```

---

## ⚙️ Quick Start

### Prerequisites

- **Node.js** v18 or higher
- **MongoDB** (local installation or MongoDB Atlas cloud)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repo-url>
   cd chatapp
   ```

2. **Install all dependencies** (root + server + client)
   ```bash
   npm install
   ```

3. **Create a `.env` file** in the project root:
   ```env
   PORT=5000
   MONGO_URL=mongodb://localhost:27017/chat-app
   JWT_SECRET=your-super-secret-key-here
   CLIENT_URL=http://localhost:5173
   ```

4. **Start the development servers**
   ```bash
   npm run dev
   ```
   This concurrently starts:
   - 🖥️ Backend → `http://localhost:5000`
   - 🌐 Frontend → `http://localhost:5173`

### Using Docker

```bash
docker-compose up
```

Docker will spin up:
- The Node.js application
- A MongoDB instance  

All configured and networked automatically.

---

## 📡 API Reference

### Authentication — `/api/auth`

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register a new user | ❌ |
| `POST` | `/api/auth/login` | Login and receive JWT token | ❌ |
| `GET` | `/api/auth/me` | Get the currently logged-in user | ✅ |

### Users — `/api/users`

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/users` | List all users (except self) | ✅ |
| `GET` | `/api/users/:id` | Get a user by ID | ✅ |
| `PUT` | `/api/users/profile` | Update username / profile picture | ✅ |
| `PUT` | `/api/users/status` | Update online/offline status | ✅ |

### Messages — `/api/messages`

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/messages` | Send a new message | ✅ |
| `GET` | `/api/messages/conversation/:userId` | Fetch messages with a specific user | ✅ |
| `GET` | `/api/messages/conversations` | Get all conversations (with unread counts) | ✅ |
| `PUT` | `/api/messages/read` | Mark messages as read | ✅ |

### Friends — `/api/friends`

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/friends/request` | Send a friend request | ✅ |

---

## 🔌 Socket.io Events

| Event | Direction | Payload | Description |
|---|---|---|---|
| `user_connected` | Client → Server | `userId` | Register socket for a logged-in user |
| `send_message` | Client → Server | `{ receiverId, content, ... }` | Emit a new message to the server |
| `receive_message` | Server → Client | message object | Deliver message to the recipient |
| `typing` | Client ↔ Server | `{ receiverId, isTyping }` | Broadcast typing indicator |
| `user_status` | Server → All | `{ userId, status }` | Notify all clients of online/offline change |
| `disconnect` | Client → Server | — | Cleanup user from active socket map |

---

## 🗄️ Database Models

### User
```js
{
  username:       String  (unique, 3–20 chars),
  email:          String  (unique, lowercase),
  password:       String  (bcrypt hashed, min 6 chars),
  profilePicture: String  (URL, default: ''),
  status:         Enum    ['online', 'offline'],
  lastSeen:       Date,
  timestamps:     true
}
```

### Message
```js
{
  sender:    ObjectId → User,
  recipient: ObjectId → User,
  content:   String (required),
  read:      Boolean (default: false),
  readAt:    Date    (default: null),
  timestamps: true
  // Indexed on (sender, recipient) for performance
}
```

### FriendRequest
```js
{
  requester: ObjectId → User,
  recipient: ObjectId → User,
  status:    Enum ['pending', 'accepted', 'rejected'],
  timestamps: true
  // Unique compound index on (requester, recipient)
}
```

---

## 🌐 Development Servers

| Service | URL |
|---|---|
| Frontend (Vite) | `http://localhost:5173` |
| Backend (Express) | `http://localhost:5000` |
| MongoDB | `mongodb://localhost:27017/chat-app` |

---

## 📜 License

MIT

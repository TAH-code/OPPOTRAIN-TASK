# Discord Clone

A full-stack, real-time messaging application inspired by Discord. Built with a modern tech stack to demonstrate real-time communication, user authentication, and responsive UI design.

## 🚀 Features

- **User Authentication:** Secure registration and login using JWT (JSON Web Tokens) and bcrypt password hashing.
- **Real-Time Messaging:** Instant, bidirectional communication powered by Socket.io.
- **Channels:** Create custom channels or join existing ones to organize conversations.
- **Discord-Inspired UI:** A clean, dark-mode interface built entirely with pure CSS (no frameworks).
- **Persistent Storage:** MongoDB database to safely store users, channels, and message history.

## 🛠️ Tech Stack

- **Frontend:** ReactJS (Vite), Axios, Socket.io-client, Pure CSS
- **Backend:** Node.js, ExpressJS, Socket.io
- **Database:** MongoDB, Mongoose

## ⚙️ Prerequisites

- Node.js (v18 or higher)
- MongoDB (Running locally or via MongoDB Atlas)

## 💻 Installation & Setup

1. **Clone the repository** (if applicable)

2. **Backend Setup:**
   ```bash
   cd server
   npm install
   ```
   Create a `.env` file in the `server` directory:
   ```env
   MONGO_URI=mongodb://localhost:27017/discord-clone
   JWT_SECRET=your_super_secret_jwt_key
   PORT=5001
   ```
   Start the backend server:
   ```bash
   npm run dev
   ```

3. **Frontend Setup:**
   Open a new terminal window:
   ```bash
   cd client
   npm install
   npm run dev
   ```

4. **Access the Application:**
   Open your browser and navigate to `http://localhost:5173`

## 🧪 How to test real-time features
To test the real-time chat, open the application in two different browsers (or one normal window and one Incognito window). Register two different accounts, join the same channel, and watch the messages appear instantly across both screens!

# 🆘 SOS Game

The **Multiplayer SOS Game** is a digital adaptation of the classic "SOS" game designed for real-time, competitive play. Two players compete by taking turns placing **S** or **O** on a grid, aiming to form the sequence "SOS" horizontally, vertically, or diagonally. The system tracks scores, manages user sessions securely using JWT, and ranks players based on performance.

---

## 🎮 Game Rules

- Two players alternate turns.
- Each player chooses an empty grid cell and places either **"S"** or **"O"**.
- Forming "SOS" in any direction earns a point.
- The game ends when the board is full.
- The player with the highest score wins.

---

## 🚀 Features

- 🧑‍🤝‍🧑 Real-time multiplayer gameplay (via Socket.IO)
- 🎯 Scoring system for successful "SOS" formations
- 📊 Dynamic leaderboard and ranking
- 🔐 JWT-based authentication with refresh token handling
- 🧠 Performance-based ranking: `finalScore / numberOfContexts`
- 🗂️ Game history tracking and secure session management

---

## 🛠️ Tech Stack

- **Frontend**: React
- **Backend**: Node.js, Express.js
- **WebSocket**: Socket.IO
- **Database**: MongoDB (with Mongoose)
- **Authentication**: JWT + Refresh Tokens

---

## 📂 Project Structure

```bash
.
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   ├── guards/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── routes/
│   │   ├── styles/
│   │   ├── utils/
│   │   └── app.jsx
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   ├── .env.example
│   └── .gitignore
├── backend/
│   ├── models/         # Mongoose models (User, Game)
│   ├── controller/     # Game and Auth logic
│   ├── routes/         # API endpoints
│   ├── middleware/     # Auth, error handling, validation
│   ├── services/       # Game services and logic
│   ├── socket/         # Real-time game handlers
│   ├── validators/     # Input validation
│   ├── utils/          # Token helpers, ranking logic
│   ├── server.js
│   ├── package.json
│   ├── package-lock.json
│   ├── .env.example
│   └── .gitignore
└── README.md
````

---

## 📈 Ranking System

Player rankings are calculated based on performance using the formula:

```txt
performance = finalScore / numberOfContexts
```

Ranks are displayed using a zero-padded 3-digit format:

| Raw Rank | Displayed |
| -------- | --------- |
| 1        | 001       |
| 12       | 012       |
| 120      | 120       |

---

## 📦 Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/manojtharindu11/sos
cd sos
```

### 2. Install dependencies

```bash
# Frontend
cd frontend
npm install

# Backend
cd ../backend
npm install
```

### 3. Configure environment variables

#### `.env` (Backend)

```env
MONGODB_URI=mongodb://localhost:27017/sosGame
PORT=5000

FRONTEND_URL=http://localhost:5173

ACCESS_TOKEN_SECRET=yourAccessTokenSecret
ACCESS_TOKEN_EXPIRY=15m
REFRESH_TOKEN_SECRET=yourRefreshTokenSecret
REFRESH_TOKEN_EXPIRY=7d
```

#### `.env` (Frontend)

```env
VITE_API_URL=http://localhost:5000
VITE_SOCKET_URL=http://localhost:5000
```

### 4. Start the development servers

```bash
# Backend
cd backend
npm start

# Frontend
cd ../frontend
npm run dev
```

---

## 📸 Screenshots *(Optional)*

*Add gameplay or UI screenshots here.*

---

## 👨‍💻 Author

**Manoj Thilakarathna**
📧 [manojtharindu11@gmail.com](mailto:manojtharindu11@gmail.com)
🔗 [GitHub](https://github.com/manojtharindu11)

---

## 🛡️ License

This project is licensed under the MIT License.

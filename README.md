# 🆘 SOS Game

The **Multiplayer SOS Game** is a digital version of the classic "SOS" word game built for real-time competitive play. Two players compete on a grid by taking turns to place the letters **S** or **O**, aiming to form the sequence "SOS" horizontally, vertically, or diagonally to earn points. The game tracks performance, maintains user rankings, and handles secure session management using JWT tokens.

---

## 🎮 Game Rules

- Players alternate turns.
- A player selects an empty grid cell on each turn and places either **"S"** or **"O"**.
- Forming the sequence **"SOS"** in any direction awards a point.
- The game ends when the board is full. The player with the most points wins.

---

## 🚀 Features

- 🧑‍🤝‍🧑 Real-time multiplayer gameplay
- 🎯 Scoring based on successful "SOS" formations
- 📊 Dynamic player ranking based on performance
- 🔐 JWT authentication with refresh token support
- 🧠 Performance formula: `finalScore / numberOfContexts`
- 🗂️ Game history and leaderboard

---

## 🛠️ Tech Stack

- **Frontend**: React
- **Backend**: Node.js, Express.js
- **WebSocket**: Socket.IO
- **Database**: MongoDB (Mongoose)
- **Authentication**: JWT with refresh tokens

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
│   ├── routes/         # API routes
│   ├── middleware/     # Authentication, validation, etc.
│   ├── services/       # Business logic
│   ├── socket/         # Real-time communication logic
│   ├── validators/     # Request validation
│   ├── utils/          # Utility functions (token, ranking, etc.)
│   ├── server.js
│   ├── package.json
│   ├── package-lock.json
│   ├── .env.example
│   └── .gitignore
└── README.md

````

---

## 📈 Ranking System

Players are ranked based on:

```txt
performance = finalScore / numberOfContext
```

Ranks are calculated and displayed in zero-padded 3-digit format:

| Raw Rank | Displayed |
| -------- | --------- |
| 1        | `001`     |
| 12       | `012`     |
| 120      | `120`     |

---

## 📦 Installation & Setup

1. **Clone the repository**

```bash
git clone https://github.com/your-username/sos-game.git
cd sos-game
```

2. **Install server dependencies**

```bash
cd server
npm install
```

3. **Create `.env` file**

```env
PORT=5000
MONGO_URI=your-mongodb-uri
ACCESS_TOKEN_SECRET=your-secret
REFRESH_TOKEN_SECRET=your-refresh-secret
```

4. **Start the server**

```bash
npm start
```

5. **Install frontend dependencies & run (if applicable)**

```bash
cd ../client
npm install
npm run dev
```

---

## 📡 Sample API: Get Rank

```http
GET /api/v1/user/rank/:username
```

**Response:**

```json
{
  "username": "sos_master",
  "rank": 3,
  "formattedRank": "003",
  "totalUsers": 50
}
```

---

## 📸 Screenshots *(Optional)*

*Add screenshots or demo GIFs here to showcase UI and gameplay.*

---

## 👨‍💻 Author

**Your Name**
📧 [your.email@example.com](mailto:your.email@example.com)
🔗 [GitHub](https://github.com/your-username) | [LinkedIn](https://linkedin.com/in/your-profile)

---

## 🛡️ License

This project is licensed under the MIT License.

```

---

Let me know if you'd like to add WebSocket event documentation (like `joinRoom`, `playMove`, `gameOver`) or a visual diagram of game flow.
```

# OnGo

OnGo is a full-stack event discovery, ticketing, and event management platform. It connects attendees seeking memorable live experiences with event organizers looking to publish, market, manage, and verify tickets.

## Tech Stack

- **Frontend**: React (Vite), Tailwind CSS, React Router
- **Backend**: Node.js, Express.js
- **Database**: MongoDB, Mongoose
- **Authentication**: JWT (JSON Web Tokens), bcrypt

## Module 1 — Foundation & Authentication

Module 1 establishes the core engineering foundation for the OnGo platform:
- **Project Structure**: Clean separation of `client` and `server` applications
- **React UI Shell**: Responsive application shell with OnGo design system tokens (Electric Indigo `#4F46E5`, Sunset Coral `#FF5A36`, Mint Emerald `#10B981`) and Manrope typography
- **Reusable UI Primitives**: Modular `Button` and `Card` components, dynamic `Navbar`, and `RootLayout`
- **Express Backend**: REST API with modular routers, CORS configuration, and centralized error handling
- **Database Integration**: MongoDB connection management via Mongoose with connection pooling and graceful error handling
- **User Authentication**:
  - Secure registration with client and server input validation
  - Password hashing with bcrypt (10 salt rounds)
  - Duplicate account prevention with normalized email indexing
  - Stateless JWT authentication with signed tokens
  - Authentication middleware guarding protected endpoints (`GET /api/auth/me`)
  - Frontend auth state management (`AuthContext`) with persistent sessions and logout

## Project Structure

```text
OnGo/
├── client/                      # React frontend
│   ├── src/
│   │   ├── components/          # Reusable UI (Button, Card, Navbar, ProtectedRoute)
│   │   ├── context/             # AuthContext & useAuth hook
│   │   ├── layouts/             # RootLayout shell & footer
│   │   ├── pages/               # Home, Login, Register, Profile
│   │   ├── services/            # API client service layer
│   │   ├── App.jsx              # Application router & providers
│   │   ├── index.css            # Tailwind theme tokens & font imports
│   │   └── main.jsx             # React DOM entry point
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── server/                      # Express backend
│   ├── src/
│   │   ├── config/              # MongoDB connection (db.js)
│   │   ├── controllers/         # authController.js
│   │   ├── middleware/          # authMiddleware.js, errorHandler.js
│   │   ├── models/              # User.js Mongoose schema
│   │   ├── routes/              # authRoutes.js, healthRoutes.js
│   │   ├── utils/               # generateToken.js
│   │   └── server.js            # Express app & server startup
│   ├── .env.example             # Environment variable template
│   └── package.json
│
├── .gitignore                   # Ignores node_modules, .env, build dist
└── README.md
```

## Running Locally

### Prerequisites
- Node.js (v18+ recommended)
- npm (v9+)
- MongoDB Atlas cluster URI or local MongoDB Community Server

---

### 1. Backend Setup

```bash
cd server
npm install
```

#### Configure Environment Variables
Create a `.env` file in the `server/` directory (see `server/.env.example`):
```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/ongo?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_key_here
CLIENT_URL=http://localhost:5173
```

> **Security Note**: Never commit your `.env` file. It is ignored by Git.

#### Start the Backend Server
```bash
npm run dev
```
The server will connect to MongoDB and start on `http://localhost:5000`.

---

### 2. Frontend Setup

```bash
cd client
npm install
npm run dev
```
The Vite development server will start on `http://localhost:5173`.

---

## API Endpoints (Module 1)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/health` | Public | Backend health check & uptime status |
| `POST` | `/api/auth/register` | Public | Register new user with hashed password |
| `POST` | `/api/auth/login` | Public | Authenticate user & return signed JWT |
| `GET` | `/api/auth/me` | Protected | Get current user profile (requires Bearer token) |

---

## License & Internship Context

- **Internship ID**: ZYNVEX-CERT-1436
- **Repository**: [https://github.com/xEhtisham/OnGo](https://github.com/xEhtisham/OnGo)
- **Author**: Ehtisham Ul Hassan

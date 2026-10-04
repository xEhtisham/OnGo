# OnGo

OnGo is a full-stack event discovery, ticketing, and event management platform. It connects attendees seeking memorable live experiences with event organizers looking to publish, market, manage, and verify tickets.

## Tech Stack

- **Frontend**: React (Vite), Tailwind CSS, React Router
- **Backend**: Node.js, Express.js
- **Database**: MongoDB, Mongoose
- **Authentication**: JWT (JSON Web Tokens), bcrypt

---

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

---

## Module 2 — Event Management & Organizer System

Module 2 delivers complete event creation, inventory management, and organizer administrative control:
- **Event Data Model**:
  - Comprehensive Mongoose schema with multi-tier ticket subdocuments (`ticketTypes`)
  - Automated pre-validation hook calculating `totalCapacity` across all ticket tiers
  - Status support: `Draft`, `Published`, `Sold Out`, `Ended`
  - Booking controls: `bookingStatus` (`Open`/`Closed`), `maxTicketsPerBooking`
  - Compound indexing on `organizer`, `status`, `date`, and `city`
- **Organizer Dashboard**:
  - 4 live metric overview cards: **Total Events**, **Upcoming Events**, **Total Bookings**, **Tickets Sold**
  - Upcoming events list with poster thumbnails, schedule, venue, and tickets sold progress
  - Quick action toolbar (`+ Create Event`, `Manage Events`)
- **Structured Event Creation & Editing**:
  - Sectioned form: Event Information, 5MB Image Upload with Live Preview & Replace, Schedule & Duration, Physical Venue Location, Ticket Tiers, and Booking Limits
  - Dynamic ticket tier builder: Add/remove ticket tiers with custom PKR pricing and quantity
  - Live Total Capacity counter (strictly without revenue forecasting)
  - Dual submission actions: "Save Draft" vs "Publish Event"
- **"My Events" Management Hub**:
  - Status filter tabs: `All`, `Published`, `Drafts`, `Sold Out`, `Ended`
  - Instant text search across title, venue name, and city
  - Category filtering across 8 event categories
  - Inventory progress bars, starting prices, and contextual actions ("Continue Editing" for drafts, "Manage / Edit", "View Public Event", and "Delete" for published)
- **Public Event Details Page**:
  - Panoramic hero cover banner with category & status badges
  - Schedule, venue location, full experience description, and organizer card
  - Sticky interactive ticket selection widget with PKR pricing, remaining availability, subtotal calculation, and booking CTA
  - Organizer shortcut banner for rapid access to event editing

---

## Project Structure

```text
OnGo/
├── client/                      # React frontend
│   ├── src/
│   │   ├── components/          # Reusable UI (Button, Card, Navbar, ProtectedRoute, EventForm)
│   │   ├── context/             # AuthContext & useAuth hook
│   │   ├── layouts/             # RootLayout shell & footer
│   │   ├── pages/
│   │   │   ├── organizer/       # Dashboard, MyEvents, CreateEvent, EditEvent
│   │   │   ├── EventDetails.jsx # Public event details & ticket booking widget
│   │   │   ├── Home.jsx         # Marketplace discovery landing page
│   │   │   ├── Login.jsx        # Login page
│   │   │   ├── Profile.jsx      # Protected user profile & live API check
│   │   │   └── Register.jsx     # Registration page
│   │   ├── services/            # API client service layer (auth + events)
│   │   ├── App.jsx              # Router & route definitions
│   │   ├── index.css            # Tailwind theme tokens & font imports
│   │   └── main.jsx             # React DOM entry point
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── server/                      # Express backend
│   ├── src/
│   │   ├── config/              # MongoDB connection (db.js)
│   │   ├── controllers/         # authController.js, eventController.js
│   │   ├── middleware/          # authMiddleware.js, errorHandler.js
│   │   ├── models/              # User.js, Event.js Mongoose models
│   │   ├── routes/              # authRoutes.js, eventRoutes.js, healthRoutes.js
│   │   ├── utils/               # generateToken.js
│   │   └── server.js            # Express app & server startup
│   ├── .env.example             # Environment variable template
│   └── package.json
│
├── .gitignore                   # Ignores node_modules, .env, build dist
└── README.md
```

---

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

## API Endpoints Reference

### Authentication (`/api/auth`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/health` | Public | Backend health check & uptime status |
| `POST` | `/api/auth/register` | Public | Register new user with hashed password |
| `POST` | `/api/auth/login` | Public | Authenticate user & return signed JWT |
| `GET` | `/api/auth/me` | Protected | Get current user profile (requires Bearer token) |

### Events & Organizer Management (`/api/events`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/events` | Protected | Create draft or published event with ticket tiers |
| `GET` | `/api/events/organizer` | Protected | List organizer events with status filter & search |
| `GET` | `/api/events/organizer/stats` | Protected | Aggregated dashboard metrics (Events, Upcoming, Tickets Sold) |
| `GET` | `/api/events/:id` | Public | Get single event details with populated organizer |
| `PUT` | `/api/events/:id` | Protected | Update event (validated against organizer ownership) |
| `DELETE` | `/api/events/:id` | Protected | Delete event (validated against organizer ownership) |

---

## License & Internship Context

- **Internship ID**: ZYNVEX-CERT-1436
- **Repository**: [https://github.com/xEhtisham/OnGo](https://github.com/xEhtisham/OnGo)
- **Author**: Ehtisham Ul Hassan

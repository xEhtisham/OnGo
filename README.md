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

## Module 3 — Event Discovery, Ticketing & Booking System

Module 3 delivers a complete end-to-end event discovery marketplace and attendee reservation engine:
- **Public Event Discovery API (`GET /api/events`)**:
  - Visibility protection: Exclusively exposes `Published` and `Sold Out` events, preventing leaks of drafts or deleted events
  - Full-text multi-field search across `title`, `description`, `venueName`, and `city`
  - Multi-facet filtering: Category pills (8 categories), City selector (Pakistani metropolises), and timeframe (`today`, `this-weekend`, `this-month`, `upcoming`)
  - Sorting (`soonest`, `latest`, `newest`) and pagination with total count and page metadata
- **Explore Marketplace UI (`/explore` & Home page)**:
  - Reusable `EventCard` component with cover hover zoom, category chip, formatted dates, venue pin, minimum PKR pricing, and remaining seats counter
  - Interactive Search & Filter Hub with URL search parameter synchronization
  - Animated loading skeletons and contextual empty states with "Reset Filters" action
  - Living marketplace showcase on Home page with popular city quick links
- **Booking Data Model (`Booking.js`)**:
  - Unique booking reference generator producing human-readable codes (`OG-XXXX-XXXX`)
  - Multi-tier ticket subdocuments capturing tier ID, tier name, unit price, quantity, and subtotal
  - Pre-validation hook auto-calculating `totalTickets`, `totalAmount`, and generating references
  - Compound indexes on `{ user: 1, createdAt: -1 }`, `{ event: 1, createdAt: -1 }`, and unique reference code
- **Atomic Booking Engine API (`/api/bookings`)**:
  - `POST /api/bookings`: Enforces per-order limits (`maxTicketsPerBooking`), verifies remaining tier availability, atomically increments `sold` counts, marks events as `Sold Out` upon reaching capacity, and returns confirmed reservation
  - `GET /api/bookings/my-tickets`: Retrieves authenticated attendee's ticket history with populated event and organizer contacts
  - `GET /api/bookings/:id`: Protected single booking lookup with attendee and organizer authorization checks
  - `GET /api/bookings/event/:eventId`: Organizer endpoint to view complete attendee rosters for their events
  - `PUT /api/bookings/:id/cancel`: Cancellation flow releasing ticket capacity back to the event and re-opening `Published` status
- **Interactive Checkout Flow (`CheckoutModal.jsx`)**:
  - Integrated into `EventDetails.jsx` ticket widget
  - Pre-fills authenticated attendee contact information
  - Real-time reservation dispatch with instant post-booking celebration view
  - Copyable booking reference code and one-click transition to attendee tickets
- **Attendee Dashboard ("My Tickets" — `/my-tickets`)**:
  - Tabbed reservation management: `All`, `Upcoming`, `Past`, and `Cancelled`
  - Ticket cards with poster thumbnails, formatted dates, booked tiers, and total PKR paid
  - Digital Ticket Pass receipt modal displaying venue check-in details
  - Self-service cancellation with instant capacity release
- **Organizer Attendee Rosters & Live Dashboard Sync**:
  - Real-time `totalBookings` and `ticketsSold` synchronization in `Dashboard.jsx`
  - "Attendees" modal in `MyEvents.jsx` displaying full attendee rosters (names, emails, phones, booked tiers, and references)

---

## Project Structure

```text
OnGo/
├── client/                      # React frontend
│   ├── src/
│   │   ├── components/          # Button, Card, Navbar, ProtectedRoute, EventForm, EventCard, CheckoutModal
│   │   ├── context/             # AuthContext & useAuth hook
│   │   ├── layouts/             # RootLayout shell & footer
│   │   ├── pages/
│   │   │   ├── organizer/       # Dashboard, MyEvents (with Attendee Roster), CreateEvent, EditEvent
│   │   │   ├── EventDetails.jsx # Public event details & interactive checkout modal
│   │   │   ├── Explore.jsx      # Public event discovery marketplace with search & filters
│   │   │   ├── Home.jsx         # Marketplace discovery landing page with featured events
│   │   │   ├── Login.jsx        # Login page
│   │   │   ├── MyTickets.jsx    # Attendee dashboard & digital ticket pass hub
│   │   │   ├── Profile.jsx      # Protected user profile & live API check
│   │   │   └── Register.jsx     # Registration page
│   │   ├── services/            # API client service layer (auth + events + bookings)
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
│   │   ├── controllers/         # authController, eventController, bookingController
│   │   ├── middleware/          # authMiddleware.js, errorHandler.js
│   │   ├── models/              # User.js, Event.js, Booking.js Mongoose models
│   │   ├── routes/              # authRoutes, eventRoutes, bookingRoutes, healthRoutes
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

### Event Discovery & Organizer Management (`/api/events`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/events` | Public | Discover published events with search, category, city, date & pagination |
| `GET` | `/api/events/:id` | Public | Get single event details with populated organizer |
| `POST` | `/api/events` | Protected | Create draft or published event with ticket tiers |
| `GET` | `/api/events/organizer` | Protected | List organizer events with status filter & search |
| `GET` | `/api/events/organizer/stats` | Protected | Aggregated dashboard metrics (Events, Upcoming, Tickets Sold, Total Bookings) |
| `PUT` | `/api/events/:id` | Protected | Update event (validated against organizer ownership) |
| `DELETE` | `/api/events/:id` | Protected | Delete event (validated against organizer ownership) |

### Ticketing & Bookings (`/api/bookings`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/bookings` | Protected | Reserve tickets with atomic inventory deduction and reference generation |
| `GET` | `/api/bookings/my-tickets` | Protected | List attendee's booked tickets with event details |
| `GET` | `/api/bookings/:id` | Protected | Get single booking receipt (attendee or event organizer access) |
| `GET` | `/api/bookings/event/:eventId` | Protected | Get complete attendee roster for organizer's event |
| `PUT` | `/api/bookings/:id/cancel` | Protected | Cancel booking, release ticket capacity, and restore event availability |

---

## License & Internship Context

- **Internship ID**: ZYNVEX-CERT-1436
- **Repository**: [https://github.com/xEhtisham/OnGo](https://github.com/xEhtisham/OnGo)
- **Author**: Ehtisham Ul Hassan

# OnGo — Live Event Discovery & Ticketing Platform

OnGo is a modern full-stack event discovery, atomic ticketing, and event management platform. It connects attendees seeking memorable live experiences with event organizers looking to publish, manage, analyze, and verify live ticket reservations.

> ### 🎓 Zynvex Solutions Internship — Project Status (Batch 4)
> - **Student Name**: Ehtisham Ul Hassan (`xEhtisham`)
> - **Student Email**: `ehtishamkhan013@gmail.com`
> - **Internship ID**: `ZYNVEX-CERT-1436`
> - **Repository**: [https://github.com/xEhtisham/OnGo](https://github.com/xEhtisham/OnGo)
> - **Module 1**: Completed & Verified (`Sep 27, 2026`)
> - **Module 2**: Completed & Verified (`Oct 04, 2026`) — Release Tag: [`v2.0-module-2`](https://github.com/xEhtisham/OnGo/releases/tag/v2.0-module-2)
> - **Module 3**: **Completed & Fully Verified** (`Oct 12, 2026`)
> - **Stitch Kinetic Pulse UI Redesign**: **100% Implemented & Pushed** (`Oct 20, 2026`)

---

## 🎨 Stitch Design System ("Kinetic Pulse")

The entire OnGo user interface has been overhauled to match the official **Stitch UI Design System** (`stitch_ongo_event_discovery_platform/`):

- **Typography**: [Plus Jakarta Sans](https://fonts.google.com/specimen/Plus+Jakarta+Sans) (weights 400, 500, 600, 700, 800) with [Google Material Symbols Outlined](https://fonts.google.com/icons) iconography.
- **Color Palette Tokens**:
  - **Primary**: Electric Indigo (`#4F46E5` / `#3525CD`) — Core actions, focus rings, brand identity.
  - **Secondary (CTA)**: Sunset Coral (`#FF5A36` / `#FD5835` / `#B52603`) — Ticket booking, publish buttons, highlight pills.
  - **Tertiary**: Mint Emerald (`#10B981` / `#006E4B` / `#6FFBBE`) — Verified badges, capacity indicators, confirmed status.
  - **Surface & Containers**: Ultra-clean layered surfaces (`#FAF8FF`, `#F2F3FF`, `#EAEDFF`, `#FFFFFF`, `#131B2E`).
- **Official Brand Mark**: Dynamic vector OnGo logo (`Logo.jsx` and `favicon.svg`) with Electric Indigo and Sunset Coral energetic pill geometry.

---

## 📱 Implemented UI Screens & Components

| Screen / Component | Route | Stitch Specification Match |
|---|---|---|
| **Marketplace Discovery & Hero** | `/` (`Home.jsx`) | Editorial hero mosaic, ambient gradient glow, live counter pill, 4-field search capsule, category track, 3-step experience guide |
| **Explore Marketplace** | `/explore` (`Explore.jsx`) | Sticky category filter chips, price preset pills (`Free`, `Under 2K`, `2K-5K`, `5K+`), availability toggle, active filter badges, responsive grid, pagination |
| **Panoramic Event Details** | `/events/:id` (`EventDetails.jsx`) | 16:9 cinematic cover, metadata bar (time, venue, host, price), about section, guidelines, directions link, sticky ticket tier selector with counter, similar events discovery |
| **Checkout & Confirmation Modal** | Overlay (`CheckoutModal.jsx`) | Interactive order breakdown, attendee inputs, instant booking confirmation modal with copyable reference code (`OG-XXXX-XXXX`) |
| **Boarding Pass Digital Ticket** | Overlay (`TicketPass.jsx`) | Perforated cutouts, cover banner, verified status pill, entry details grid, vector QR code with OnGo center badge, `.ics` calendar download & PDF print |
| **My Tickets Wallet** | `/my-tickets` (`MyTickets.jsx`) | 3 live metric overview cards, status tabs (`Upcoming`, `Past`, `All`, `Cancelled`), wide responsive ticket cards with quick actions |
| **Organizer Analytics Studio** | `/organizer` (`Dashboard.jsx`) | 4 KPI metric cards (Events, Upcoming, Tickets Sold, Total Revenue), recent sales feed, upcoming event capacity progress bars |
| **Organizer Event Management** | `/organizer/events` (`MyEvents.jsx`) | Status filter tabs, search bar, category dropdown, desktop table / mobile cards, attendee roster modal with search, ticket filter & **one-click CSV export** |
| **Event Creation Studio** | `/organizer/events/new` (`CreateEvent.jsx`, `EventForm.jsx`) | Sectioned form (Info, 5MB Image Upload with drag-and-drop preview, Schedule, Venue, Ticket Tiers builder with live total capacity counter, Booking Limits) |
| **Event Edit Studio** | `/organizer/events/:id/edit` (`EditEvent.jsx`, `EventForm.jsx`) | Breadcrumb navigation, pre-filled tier management, status switcher, capacity preservation |
| **User Profile & Security** | `/profile` (`Profile.jsx`) | Initials avatar with photo action, verified badge, personal information form, password security, notification toggles, account danger zone & live `/api/auth/me` JWT verification |
| **Global Navigation & Footer** | All pages (`Navbar.jsx`, `RootLayout.jsx`) | Sticky glassmorphic navbar with logo, search capsule, role switchers, user menu dropdown, mobile sheet, and multi-column footer |

---

## 💻 Tech Stack

- **Frontend**: React (Vite), Tailwind CSS v4 with `@theme` token extensions, React Router v7, Material Symbols Outlined, Canvas-Confetti, File-Saver
- **Backend**: Node.js, Express.js (REST API, CORS, Centralized Error Handling)
- **Database**: MongoDB, Mongoose with **automatic graceful local failover** (`mongodb://127.0.0.1:27017/ongo`) when Atlas IP restrictions are detected
- **Authentication**: Stateless JWT (JSON Web Tokens), bcrypt password hashing (10 salt rounds)

---

## 🚀 Running Locally

### Prerequisites
- Node.js (v18+)
- npm (v9+)
- MongoDB Atlas cluster URI or local MongoDB Community Server

---

### 1. Backend Setup

```bash
cd server
npm install
```

#### Configure Environment Variables (`server/.env`):
```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/ongo?retryWrites=true&w=majority
JWT_SECRET=ongo_super_secret_jwt_key_2026
CLIENT_URL=http://localhost:5173
```

> **Note on Database Connection**: If your Atlas IP whitelist prevents remote connection, the server will **automatically fall back to local MongoDB** (`mongodb://127.0.0.1:27017/ongo`) with zero downtime!

#### Start Backend:
```bash
npm run dev
```
The server will start on `http://localhost:5000`.

---

### 2. Frontend Setup

```bash
cd client
npm install
npm run dev
```
The Vite development server will start on `http://localhost:5173`.

#### Verify Production Build:
```bash
npm run build
```
Builds in under ~800ms with zero errors.

---

## 📡 API Endpoints Reference

### Authentication (`/api/auth`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/health` | Public | Backend health check & uptime status |
| `POST` | `/api/auth/register` | Public | Register new user with hashed password |
| `POST` | `/api/auth/login` | Public | Authenticate user & return signed JWT |
| `GET` | `/api/auth/me` | Protected | Get current user profile (verified via Bearer token) |

### Event Discovery & Organizer Management (`/api/events`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/events` | Public | Discover published events with search, category, city, date, price ranges (`minPrice`, `maxPrice`), availability (`available`) & pagination |
| `GET` | `/api/events/:id` | Public | Get single event details with populated organizer |
| `POST` | `/api/events` | Protected | Create draft or published event with multi-tier tickets |
| `GET` | `/api/events/organizer` | Protected | List organizer events with status filter & search |
| `GET` | `/api/events/organizer/stats` | Protected | Aggregated dashboard metrics (Events, Upcoming, Tickets Sold, Total Revenue) |
| `PUT` | `/api/events/:id` | Protected | Update event (validated against organizer ownership) |
| `DELETE` | `/api/events/:id` | Protected | Delete event (validated against organizer ownership) |

### Ticketing & Bookings (`/api/bookings`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/bookings` | Protected | Reserve tickets with atomic inventory deduction and unique reference code (`OG-XXXX-XXXX`) |
| `GET` | `/api/bookings/my-tickets` | Protected | List attendee's booked tickets with event details |
| `GET` | `/api/bookings/:id` | Protected | Get single booking receipt (attendee or event organizer access) |
| `GET` | `/api/bookings/event/:eventId` | Protected | Get complete attendee roster for organizer's event |
| `PUT` | `/api/bookings/:id/cancel` | Protected | Cancel booking, release ticket capacity, and restore event availability |

---

## 👨‍💻 License & Author

- **Internship Program**: Zynvex Solutions Software Engineering Internship (Batch 4)
- **Internship ID**: `ZYNVEX-CERT-1436`
- **Developer**: Ehtisham Ul Hassan ([@xEhtisham](https://github.com/xEhtisham))
- **Repository**: [https://github.com/xEhtisham/OnGo](https://github.com/xEhtisham/OnGo)

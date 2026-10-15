# Buildwise — Modern Cloud Construction Operations Platform

Buildwise is an enterprise-grade construction operations management platform and leftover-material circular economy marketplace. It integrates multi-site monitoring, inventory buffer tracking, worker muster rolls & QR attendance, prerequisite-enforced task coordination, surplus value recovery, and downloadable operational reports.

---

## Architecture & Technology Stack

### Backend
- **Node.js + Express** (ES Modules, REST API architecture)
- **MongoDB Atlas & Mongoose** (Real cloud database persistence with robust schema validation)
- **CORS & Dotenv** (Configured environment isolation, zero hardcoded secrets)
- **Nodemon** (Developer hot-reloading)

### Frontend
- **React 19 & Vite 8**
- **Modern Dark-Dashboard UI**: Charcoal/navy top navigation header (`#0d131f`), pale sage-gray workspace background (`#f4f6f8`), dark executive telemetry hero panel, pure white cards with soft rounded corners, and construction-semantic amber (`#f59e0b`), emerald green (`#10b981`), blue (`#3b82f6`), and red (`#ef4444`) indicators.
- **React Context API Layer**: Connected to backend REST endpoints with optimistic UI updates and local telemetry fallback.
- **PDF & CSV Exporting**: Client-side document generation using `jspdf` and `jspdf-autotable` loaded directly from cloud data.
- **Lucide React & Canvas Confetti**: Crisp iconography and celebratory feedback.

---

## MongoDB Atlas Setup & Configuration

1. Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Under **Database Access**, create a database user (e.g., `buildwise_user`) with read/write privileges.
3. Under **Network Access**, add your current IP address (or `0.0.0.0/0` for development access).
4. Click **Connect -> Drivers -> Node.js** to copy your connection string.
5. In the `backend/` folder, create your `.env` file (or copy from `.env.example`):

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env` with your credentials:
```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/buildwise?retryWrites=true&w=majority
CLIENT_URL=http://localhost:5173
```

> **Security Rule:** Never commit `.env` containing sensitive credentials to Git. `backend/.env` is ignored in version control.

---

## Starting the Project

### 1. Backend Setup & Seeding

Open a terminal in the project root:

```bash
# Navigate to the backend folder
cd backend

# Install dependencies (Express, Mongoose, Dotenv, Cors, Nodemon)
npm install

# (Optional) Seed MongoDB with initial construction dataset
npm run seed

# Start the backend server in development mode (with nodemon)
npm run dev
```

The backend starts at `http://localhost:5000`. Test database connectivity anytime at:
`http://localhost:5000/api/health`

### 2. Frontend Setup

In a second terminal:

```bash
# In the project root (Buildwise2)
npm install
npm run dev
```

Visit the frontend at [http://localhost:5173/Buildwise/](http://localhost:5173/Buildwise/) (or `http://localhost:5173`).

---

## Backend REST API Reference & Smoke Tests

You can smoke-test backend endpoints using `curl` or Postman:

### 1. Health Check
```bash
curl http://localhost:5000/api/health
```

### 2. Sites API
- `GET /api/sites` — List all construction sites
- `POST /api/sites` — Create a new project site
```bash
curl -X POST http://localhost:5000/api/sites \
  -H "Content-Type: application/json" \
  -d '{"name": "Skyline Heights", "location": "Nashik", "supervisor": "R. Sharma", "totalBudget": "₹4.50 Cr"}'
```

### 3. Materials & Usage API
- `GET /api/materials` — Retrieve inventory SKUs
- `POST /api/materials` — Add a new material shipment
- `POST /api/materials/:id/usage` — Record consumption. Automatically recalculates remaining quantity, flags low-stock warnings, and triggers the Waste-to-Value Classifier rule if surplus is detected.
```bash
curl -X POST http://localhost:5000/api/materials/mat-1/usage \
  -H "Content-Type: application/json" \
  -d '{"usedQty": 10}'
```

### 4. Marketplace & Circular Economy Transaction Flow
- `GET /api/marketplace/profiles` — Browse dummy verified buyer/seller profiles
- `GET /api/marketplace/listings` — Browse & filter surplus materials (category, city, status, condition, search)
- `POST /api/marketplace/listings` — Create new surplus material listing with available quantity and condition
- `GET /api/marketplace/inquiries` — Fetch transaction inquiries filtered by buyer or seller
- `POST /api/marketplace/inquiries` — Submit inquiry with requested quantity, proposed price, and pickup date
- `POST /api/marketplace/inquiries/:id/respond` — Accept (reserves stock & generates order), Counter (counter-offer proposal), or Reject
- `GET /api/marketplace/inquiries/:id/messages` — Negotiation conversation timeline
- `POST /api/marketplace/inquiries/:id/messages` — Post message to negotiation thread
- `GET /api/marketplace/orders` — List marketplace orders with payment & delivery status
- `PATCH /api/marketplace/orders/:id/status` — Advance order timeline (`Ready for Pickup` -> `Picked Up` -> `Completed`)
- `GET /api/marketplace/dashboard-summary` — Role-aware executive summary metrics

> [!NOTE]
> **Marketplace Demo Simulation Disclaimer**: All marketplace buyer and seller profiles, transaction histories, verification badges, negotiation messages, and payment statuses (`Paid`, `Partial Advance Paid`, `Pending`) use realistic Indian construction dummy data for demonstration purposes. Real payment gateway integrations, live WebSockets, and real-identity KYC checks are simulated.

### 5. Workers & Attendance Muster
- `GET /api/workers` — Crew roster
- `POST /api/workers/:id/toggle-attendance` — 1-Click punch card check-in/out
- `POST /api/attendance/scan-qr` — Simulated entrance gate QR code verification

### 6. Prerequisite-Enforced Tasks (DAG)
- `GET /api/tasks` — List tasks
- `POST /api/tasks` — Create task with optional `prerequisiteId`
- `PATCH /api/tasks/:id/status` — Updates status (`To Do`, `In Progress`, `Review`, `Completed`). Enforces business validation preventing blocked tasks from starting until prerequisite is completed.

---

## Preserved Features & Workflows

1. **Dashboard**: Executive dark telemetry summary card, KPI metrics, dynamic progress bars, material consumption analytics, attendance donut chart, and live site activity feed.
2. **Sites**: Project tracking with supervisor contact, health condition tags, and progress tracking.
3. **Materials**: Multi-category filter, search, usage decrement, low-stock threshold alerts, and PDF inventory audit download.
4. **Marketplace Transaction Flow**: Complete B2B surplus material lifecycle across 4 interactive tabs (`Browse Listings`, `My Listings`, `Inquiries & Offers`, `Orders & Tracking`):
   - **Inquiry & Counter-Offers**: Custom requested quantities, counter-offer proposals, and message threads.
   - **Stock Reservation**: Accepting an inquiry decrements available stock, reserves quantity, and auto-generates an order.
   - **Order Lifecycle Stepper**: Tracks *Inquiry Submitted* → *Seller Responded* → *Quantity Reserved* → *Order Confirmed* → *Ready for Pickup* → *Picked Up* → *Completed*.
   - **Role-Aware Dashboard**: Tailored views for Builder (sales/stock), Engineer (procurement/savings), and Worker (read-only pickup log).
5. **Workers & Attendance**: Roster management, daily muster roll table, 1-click mobile punch, simulated QR scanning, and PDF/CSV export.
6. **Tasks**: Status cycle (`To Do` -> `In Progress` -> `Review` -> `Completed`), priority filters, and prerequisite blocking.
7. **Reports & Exports**: Comprehensive PDF muster roll, stock audit, and CSV reports generated from cloud data.
8. **Worker Portal & Landing Page**: Dedicated streamlined mobile mode for crew members and marketing landing page.


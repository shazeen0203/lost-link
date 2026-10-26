# Lost Link

Lost Link is a modern, responsive Lost and Found web app for college students. Users can report lost or found items with details like title, description, location, date, type, and contact info. Items are displayed on the homepage with search/filters (All/Lost/Found).

## Tech Stack
- Frontend: React + Vite
- Backend: Node.js + Express
- Storage: In-memory (no PostgreSQL/pgAdmin required)

## Project Structure
```
lost-link/
├── backend/   # Express API
└── frontend/  # React + Vite app
```

## Prerequisites
- Node.js (v18+ recommended)
- npm

## Setup

### 1) Install dependencies
```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2) Configure environment variables
Create `.env` files (examples provided):

**Backend (`backend/.env`)**
```bash
PORT=5001
```

**Frontend (`frontend/.env`)**
```bash
VITE_API_URL=http://localhost:5001
```

You can copy from the examples:
```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

### 3) Run the app
Open two terminals.

**Terminal 1 - Backend**
```bash
cd backend
npm run dev  # or npm start
```
Backend runs on http://localhost:5001

**Terminal 2 - Frontend**
```bash
cd frontend
npm run dev
```
Frontend runs on the URL shown by Vite (usually http://localhost:5173)

## API Endpoints
- `GET /` - Health check
- `GET /api/items` - Get all items
- `POST /api/items` - Create item (requires: title, description, location, type, contact; type must be "Lost" or "Found")
- `DELETE /api/items/:id` - Delete item

## Features
- Report lost/found items with form validation
- View all reports on homepage
- Filter by All/Lost/Found
- Loading, empty, and error states
- Responsive design

## Notes
- Data is stored in-memory in `backend/index.js` (resets when server restarts). This satisfies "no PostgreSQL/pgAdmin required".
- Never commit `.env` files.

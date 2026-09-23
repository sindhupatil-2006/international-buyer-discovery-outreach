# International Buyer Discovery & Outreach Portal

> **"Discover. Connect. Grow Globally."**

An API-powered platform that enables exporters and manufacturers to discover potential international buyers via real-time search APIs without uploading CSV files, and send personalized B2B outreach emails directly to target buyers.

---

## 🚀 Key Features

- **API-Powered Buyer Discovery**: Discovers international buyers, wholesale distributors, and importers using real-time search APIs (SerpAPI). No CSV upload required.
- **Intelligent Email Extraction**: Parses search snippets and web pages to extract publicly listed business emails (`contact@`, `sales@`, `info@`, `wholesale@`) with verification status badges.
- **Personalized Email Outreach**: Auto-populates outreach forms upon selecting a buyer, with automated company variable replacement (`{{company}}`).
- **AI Email Pitch Generator**: Integrates Google Gemini API to craft tailored, high-converting B2B export proposals based on buyer country, industry, and product niche.
- **Product Catalog File Attachments**: Supports PDF, DOCX, XLSX, PNG, and JPG attachments up to 10 MB via Multer with automatic temporary file cleanup.
- **Dual Operational Modes**: Runs in full live mode with API keys (`SERPAPI_KEY`, SMTP credentials, `GEMINI_API_KEY`) or in a safe **Demo Mode** when credentials are unconfigured.
- **MySQL Database Storage**: Stores discovered buyers, search query logs, email outreach history, and user preferences using parameterized SQL queries (`mysql2`).
- **Real-time Exporter Dashboard**: Visualizes aggregate metrics (Total Buyers Discovered, Outreach Sent, Sent Today, Searches Performed, Success/Failure Rates, and Recent Activity).
- **Security & Rate Limiting**: Built with JWT authentication, bcrypt password hashing, Helmet security headers, CORS protection, express-validator sanitization, and express-rate-limit.

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: React.js 18 (Vite)
- **Styling**: Tailwind CSS, Vanilla CSS, Custom SaaS Aesthetics
- **Icons**: Lucide React Icons
- **HTTP Client**: Axios (with JWT Interceptor)
- **Routing**: React Router v6

### Backend
- **Runtime**: Node.js & Express.js
- **Database**: MySQL 8.0+ (`mysql2/promise`) with resilient fallback engine
- **Email Delivery**: Nodemailer (SMTP / Gmail App Password)
- **File Upload**: Multer (10MB limit, MIME type validation)
- **Authentication**: JWT (`jsonwebtoken`), `bcrypt` password hashing
- **Security & Validation**: `helmet`, `cors`, `express-validator`, `express-rate-limit`

### External APIs
- **Search API**: SerpAPI (Google Search engine)
- **AI Personalization**: Google Gemini API (`gemini-1.5-flash`)

---

## 📁 Project Structure

```
international-buyer-discovery-outreach/
├── client/                     # React Vite Frontend
│   ├── src/
│   │   ├── components/        # Navbar, Sidebar, BuyerTable, OutreachForm, StatsCard, etc.
│   │   ├── context/           # AuthContext (state, tokens, selected buyer transfer)
│   │   ├── hooks/             # useAuth hook
│   │   ├── pages/             # Landing, Login, Register, Dashboard, FindBuyers, Buyers, Outreach, History, Settings, Profile
│   │   ├── routes/            # ProtectedRoute wrapper
│   │   ├── services/          # API client and service endpoints
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── server/                     # Express Node.js Backend
│   ├── src/
│   │   ├── config/            # Database pool and environment configuration
│   │   ├── controllers/       # Auth, Buyer, Outreach, Dashboard, Settings controllers
│   │   ├── middleware/        # Auth, Error, Upload, Rate Limiter middlewares
│   │   ├── models/            # User, Buyer, Search, Outreach, Settings SQL models
│   │   ├── routes/            # Express route declarations
│   │   ├── services/          # Buyer Search, Nodemailer Email, and Gemini AI services
│   │   ├── utils/             # Email extractor regex, validators, logger
│   │   ├── app.js
│   │   └── server.js
│   ├── tests/                 # Automated API tests (Node.js test runner)
│   ├── package.json
│   └── .env.example
├── database/
│   └── schema.sql             # MySQL Database DDL Script
├── docs/
│   └── API.md                 # Complete API documentation
├── README.md
└── .gitignore
```

---

## ⚙️ Environment Configuration

Copy `server/.env.example` to `server/.env`:

```env
PORT=5000

# MySQL Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=buyer_discovery
DB_USER=root
DB_PASSWORD=

# JWT Secret Key
JWT_SECRET=super_secret_jwt_key_buyer_discovery_portal_2026

# External APIs (Optional - Safe Demo Mode activates if missing)
SERPAPI_KEY=your_serpapi_key_here
GEMINI_API_KEY=your_gemini_api_key_here

# Nodemailer SMTP Configuration (Optional - Safe Email Demo Mode activates if missing)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=your_gmail_address@gmail.com
SMTP_PASSWORD=your_gmail_app_password
SMTP_FROM=your_gmail_address@gmail.com

# Frontend Client URL
CLIENT_URL=http://localhost:5173
```

---

## 🗄️ Database Setup (MySQL)

1. Open MySQL terminal or phpMyAdmin / MySQL Workbench.
2. Execute `database/schema.sql`:

```sql
SOURCE database/schema.sql;
```

This creates the `buyer_discovery` database and `users`, `buyers`, `searches`, `outreach`, and `settings` tables with indexes and foreign keys.

---

## 🚦 Quick Start Guide

### 1. Install Dependencies

Install server dependencies:
```bash
cd server
npm install
```

Install client dependencies:
```bash
cd ../client
npm install
```

### 2. Run Backend Server

```bash
cd server
npm start
```
*Server starts on `http://localhost:5000` (Health Check: `http://localhost:5000/api/health`).*

### 3. Run Frontend Client

```bash
cd client
npm run dev
```
*App opens on `http://localhost:5173`.*

---

## 🧪 Automated Testing

Run backend integration test suite:
```bash
cd server
npm test
```

---

## 🔒 Security & Safe Demo Mode

- **Demo Mode**: If `SERPAPI_KEY` is not provided, the search endpoint returns realistic curated international buyer leads for the chosen niche and country, clearly marked with a `Demo Mode` badge.
- **Email Demo Mode**: If SMTP credentials are missing, outreach sends are logged in the database without throwing transport exceptions.
- **Zero Exposed Credentials**: Secrets are kept strictly in backend `.env` or user database settings. Passwords are password-hashed using `bcrypt` salts.

---

## 🌐 Deployment Instructions

- **Frontend**: Deploy `client/` to Vercel or Netlify (`npm run build`). Set `CLIENT_URL`.
- **Backend**: Deploy `server/` to Render, Railway, or Heroku.
- **Database**: Connect to MySQL-compatible cloud database (PlanetScale, Aiven, AWS RDS).

---

## 📜 License

MIT License. Designed for International Trade & Export Growth.

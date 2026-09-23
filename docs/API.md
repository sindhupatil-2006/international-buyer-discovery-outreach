# International Buyer Discovery & Outreach API Documentation

Base URL: `http://localhost:5000/api`

## Authentication Header
Protected endpoints require standard JWT Bearer Authorization:
```http
Authorization: Bearer <your_jwt_token>
```

---

## Health Check Endpoint

### `GET /health`
Verify server and database execution mode status.
- **Auth Required**: No
- **Response**:
  ```json
  {
    "status": "ok",
    "timestamp": "2026-09-23T19:00:00.000Z",
    "service": "International Buyer Discovery & Outreach API",
    "version": "1.0.0",
    "dbMode": "mysql_connected"
  }
  ```

---

## Auth Endpoints

### `POST /auth/register`
Register a new exporter account.
- **Request Body**:
  ```json
  {
    "name": "John Exporter",
    "email": "exporter@company.com",
    "password": "password123",
    "companyName": "Global Export Corp"
  }
  ```
- **Response** (`201 Created`):
  ```json
  {
    "success": true,
    "message": "Account successfully created",
    "token": "eyJhbGciOiJIUzI1Ni...",
    "user": {
      "id": 1,
      "name": "John Exporter",
      "email": "exporter@company.com",
      "company_name": "Global Export Corp"
    }
  }
  ```

### `POST /auth/login`
Authenticate exporter user.
- **Request Body**:
  ```json
  {
    "email": "exporter@company.com",
    "password": "password123"
  }
  ```
- **Response** (`200 OK`):
  ```json
  {
    "success": true,
    "token": "eyJhbGciOiJIUzI1Ni...",
    "user": {
      "id": 1,
      "name": "John Exporter",
      "email": "exporter@company.com",
      "companyName": "Global Export Corp"
    }
  }
  ```

### `GET /auth/me`
Retrieve active user session profile.
- **Auth Required**: Yes

---

## Buyer Discovery Endpoints

### `POST /buyers/search`
Perform API buyer discovery query.
- **Auth Required**: Yes
- **Rate Limit**: 20 requests / 15 mins
- **Request Body**:
  ```json
  {
    "niche": "home decor wholesale distributors",
    "country": "United States",
    "limit": 10
  }
  ```
- **Response** (`200 OK`):
  ```json
  {
    "success": true,
    "isDemo": false,
    "count": 10,
    "buyers": [
      {
        "id": 1,
        "companyName": "Modern Home Decor Group",
        "email": "sales@modernhomedecor.com",
        "website": "https://modernhomedecor.com",
        "country": "United States",
        "description": "Wholesale distributor of handcrafted home decor products",
        "industry": "Home Decor & Trade",
        "emailVerified": true,
        "emailSource": "serpapi_snippet"
      }
    ]
  }
  ```

### `GET /buyers`
Get all discovered buyers for current user.
- **Auth Required**: Yes

### `GET /buyers/:id`
Get single buyer by ID.
- **Auth Required**: Yes

### `DELETE /buyers/:id`
Delete buyer record.
- **Auth Required**: Yes

---

## Email Outreach Endpoints

### `POST /outreach/send`
Dispatch personalized B2B outreach email with optional catalog attachment.
- **Auth Required**: Yes
- **Content-Type**: `multipart/form-data`
- **Fields**:
  - `buyerId`: string / number (optional)
  - `recipientEmail`: string (required)
  - `companyName`: string (required)
  - `subject`: string (required, supports `{{company}}`)
  - `body`: string (required, supports `{{company}}`)
  - `attachment`: file (optional, PDF/DOCX/XLSX/PNG/JPG max 10MB)
- **Response** (`200 OK`):
  ```json
  {
    "success": true,
    "isDemo": true,
    "message": "Outreach simulated successfully (Email Demo Mode)",
    "outreachId": 42
  }
  ```

### `POST /outreach/generate`
Generate AI-personalized outreach email proposal using Google Gemini API.
- **Auth Required**: Yes
- **Request Body**:
  ```json
  {
    "companyName": "Acme Home Furnishings",
    "country": "United States",
    "industry": "Home Decor",
    "product": "Handcrafted Artisanal Decor"
  }
  ```

### `GET /outreach`
Retrieve outreach audit history log.
- **Auth Required**: Yes

### `DELETE /outreach/:id`
Delete outreach history record.
- **Auth Required**: Yes

---

## Dashboard Endpoints

### `GET /dashboard/stats`
Retrieve real-time database aggregate metrics and recent activity feeds.
- **Auth Required**: Yes
- **Response**:
  ```json
  {
    "success": true,
    "stats": {
      "totalBuyers": 18,
      "totalOutreach": 12,
      "sentToday": 3,
      "totalSearches": 5,
      "successfulOutreach": 11,
      "failedOutreach": 1
    },
    "recentBuyers": [],
    "recentOutreach": []
  }
  ```

---

## Settings Endpoints

### `GET /settings`
Get user settings (secrets masked).
- **Auth Required**: Yes

### `PUT /settings`
Update user SMTP, SerpAPI, and Gemini API keys.
- **Auth Required**: Yes

# UReduce

A lightning-fast, containerized URL shortening service built with modern web technologies. Transform long URLs into short, shareable links using a clean React frontend, a robust Go backend, and a PostgreSQL database.

---

## 🚀 Features

* **Fast URL Shortening**: MD5-based hash generation for deterministic and repeatable short URLs
* **Clean UI**: Modern React interface styled with Tailwind CSS
* **Containerized Architecture**: Seamless deployment using Docker Compose
* **URL Validation**: Client-side validation ensures correct input before processing
* **One-Click Copy**: Instantly copy shortened links to your clipboard

---

##Architecture Overview

UReduce follows a modular three-tier architecture:

* **Frontend**: React 19 with Vite (Runs on port `3000`)
* **Backend**: Go HTTP server using PostgreSQL driver (Runs on port `8080`)
* **Database**: PostgreSQL with auto-initialized schema (Runs on port `5432` internally, `5433` externally)

---

## Quick Start

### Prerequisites

* Docker & Docker Compose installed
* `.env` file configured with PostgreSQL credentials

### Environment Setup

Create a `.env` file in the `/backend` directory:

```env
DB_HOST=localhost  
DB_PORT=5432  
DB_USER=<your-username>  
DB_PASSWORD=<your-password>  
DB_NAME=<your-db-name>  
FRONTEND_BASE_URL=http://localhost:3000
```

###  Running the Application

```bash
docker-compose up --build
```

**Access points:**

* Frontend: [http://localhost:3000](http://localhost:3000)
* Backend API: [http://localhost:8080](http://localhost:8080)
* Database: `localhost:5433` (if you need to connect manually)

---

## API Endpoints

| Endpoint   | Method | Description              |
| ---------- | ------ | ------------------------ |
| `/home`    | GET    | Health check             |
| `/shorten` | POST   | Generate a shortened URL |
| `/{id}`    | GET    | Redirect to original URL |

---

## Database Schema

```sql
CREATE TABLE urls (
    id TEXT PRIMARY KEY,           -- 8-character MD5 hash
    original_url TEXT NOT NULL,    -- Full source URL  
    short_url TEXT NOT NULL,       -- Generated short ID
    creation_date TIMESTAMP NOT NULL
);
```

---

## Technology Stack

* **Frontend**: React 19, Vite 6.2, Tailwind CSS 4.1
* **Backend**: Go 1.24, `github.com/lib/pq` PostgreSQL driver
* **Database**: PostgreSQL (latest version)
* **Infrastructure**: Docker Compose (bridge network)

---

## 🛠 Development Guide

### Backend Development

* URL hashing, validation, and redirection logic implemented in Go
* Includes automatic retry for database connectivity and CORS configuration

### Frontend Development

* Built with React and Tailwind CSS
* Handles client-side validation and API communication via environment variables

### Database Initialization

* PostgreSQL container auto-creates the necessary schema at runtime

---

## Design Considerations

* **Deterministic Hashing**: Uses MD5 for generating consistent short URLs from identical inputs
* **Collision Handling**: Managed with `ON CONFLICT DO NOTHING` to ignore duplicate hash insertions
* **User Experience**: Error boundaries and user feedback mechanisms ensure a smooth UX across devices
 
 ---
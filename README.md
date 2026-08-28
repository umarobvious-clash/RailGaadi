# RailGaadi

RailGaadi is a live train tracking application.

## Prerequisites

- Node.js (v18 or higher)
- Docker & Docker Compose (for database and redis)
- npm

## Getting Started

1. Clone the repository
2. Navigate to `backend` directory and install dependencies:
   ```bash
   cd backend
   npm install
   ```
3. Copy `.env.example` to `.env` in the `backend` directory and adjust values.
   ```bash
   cp backend/.env.example backend/.env
   ```
4. Start required services using Docker Compose from the root directory:
   ```bash
   docker-compose up -d
   ```
5. Start the backend development server:
   ```bash
   cd backend
   npm run dev
   ```

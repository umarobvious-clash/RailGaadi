




# 🚆 RailGaadi

RailGaadi is a full-stack live train tracking application designed to provide train information, journey progress, route visualization, weather information, and journey analytics through a single interface.

This project was built as a practical learning project to understand how a modern web application connects a frontend, backend, external APIs, databases, and interactive maps.

## ✨ Features

- 🚆 Live train tracking
- 🔎 Train number and name search
- 🗺️ Interactive route map
- 📍 Current train location and journey progress
- 🚉 Station-by-station journey timeline
- 🌦️ Weather information along the route
- 📊 Journey analytics
- ⏱️ Delay and ETA information
- 🗺️ Interactive map controls and route visualization
- 🔐 Environment-based API configuration

## 🖥️ Application Preview

### Home Page

![RailGaadi Home Page](screenshots/home.png)

### Live Journey & Route Map

![RailGaadi Journey Map](screenshots/journey-map.png)

### Journey Analytics

![RailGaadi Analytics](screenshots/analytics.png)

## 🛠️ Tech Stack

### Frontend

- React
- TypeScript
- JavaScript
- Vite
- Tailwind CSS

### Backend

- Node.js
- TypeScript
- REST APIs

### Database & Services

- PostgreSQL
- Redis
- Docker / Docker Compose

### APIs & Tools

- Train data APIs
- Weather API
- Map services
- Git & GitHub

## 🏗️ How the Application Works

The application follows a frontend–backend architecture.

1. The user searches for a train from the frontend.
2. The frontend sends a request to the backend.
3. The backend communicates with the required external APIs and services.
4. The received data is processed and returned to the frontend.
5. React displays the train information, journey details, weather, analytics, and map data.
6. Environment variables are used to store API keys and other configuration values securely.

## 🔐 Environment Variables

API keys and other sensitive configuration values are stored in `.env` files and are **not committed to GitHub**.

A `.env.example` file is provided to show the required configuration structure.

> Never commit real API keys or secrets to the repository.

## 🚀 Getting Started

### Prerequisites

Make sure you have:

- Node.js 18+
- npm
- Docker and Docker Compose

### 1. Clone the repository

```bash
git clone https://github.com/umarobvious-clash/RailGaadi.git
cd RailGaadi
````

### 2. Install backend dependencies

```bash
cd backend
npm install
```

### 3. Configure environment variables

Copy the example environment file:

```bash
cp .env.example .env
```

Add the required API keys and configuration values to `.env`.

### 4. Start required services

From the project root, start the required Docker services:

```bash
docker compose up -d
```

### 5. Start the frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

The frontend will normally be available at:

```text
http://localhost:5173
```

## 📚 What I Learned

This project helped me understand:

* How frontend and backend applications communicate
* How REST APIs are consumed
* How external API data is processed and displayed
* How environment variables are used for configuration
* How interactive maps can be integrated into web applications
* How databases and caching services fit into a full-stack application
* How Git and GitHub are used for version control
* How to structure and document a software project

## 🔮 Future Improvements

* Improve live location update frequency
* Add more detailed train statistics
* Improve error handling and loading states
* Add user authentication and saved journeys
* Improve mobile responsiveness
* Deploy the application for public access
* Add automated testing

## 👨‍💻 Author

**Umar Abdullah**

GitHub: [https://github.com/umarobvious-clash](https://github.com/umarobvious-clash)

## 📄 License

This project is intended for educational and portfolio purposes.

````

### One important thing: screenshots

Don't paste the screenshots directly into the README text.

Instead, we'll create a folder in your repository:

```text
RailGaadi/
├── backend/
├── frontend/
├── screenshots/
│   ├── home.png
│   ├── journey-map.png
│   └── analytics.png
└── README.md
````

Then GitHub will display them automatically because the README contains:

```markdown
![RailGaadi Home Page](screenshots/home.png)
```

**This is the next thing I'd do with you:** take the three screenshots you already showed me—home page, journey/map page, and analytics—and save them into a `screenshots` folder, then commit and push the README + screenshots together.

Also, one correction from earlier: **GitHub isn't intelligently rewriting your Markdown into emojis/headings.** GitHub renders Markdown syntax visually. The `#`, `##`, `-`, `![...]`, etc. are formatting instructions; GitHub displays the formatted result rather than the raw Markdown.

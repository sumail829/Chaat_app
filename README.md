# Chaat App 🍲

**Chaat App** is a modern full-stack web application for managing and ordering food in restaurants or street-food setups. It provides a seamless experience for both customers and admins with real-time order updates and menu management.

---

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Demo](#demo)
- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

---

## Features
### Customer Features
- Browse menu items with images and descriptions.
- Place orders with real-time updates.
- Track order status.

### Admin Features
- Add, update, and delete menu items.
- Manage orders efficiently.
- View analytics on popular items and sales.

---

## Tech Stack
- **Frontend:** React, Tailwind CSS  
- **Backend:** NestJS (Node.js)  
- **Database:** PostgreSQL  
- **Realtime Updates:** WebSockets  
- **Containerization & Deployment:** Docker  

---

## Demo
You can add a live demo link here:  
`https://your-demo-link.com`

Or include GIF/screenshots of the app in action:  
![App Screenshot](link-to-your-screenshot.png)

---

## Installation

### Prerequisites
- Node.js >= 18
- Docker & Docker Compose
- npm or yarn

### Steps
1. Clone the repository:
```bash
git clone https://github.com/your-username/chaat-app.git
cd chaat-app

cp .env.example .env
# Edit .env with your database credentials

#start backend with docker
docker compose up -d
#start frontend
cd frontend
npm install
npm run dev

#Project structure
chaat-app/
│
├─ backend/         # NestJS backend code
├─ frontend/        # React frontend code
├─ docker-compose.yml
├─ README.md
└─ .env

Contributing

Contributions are welcome!

Fork the repository.

Create a feature branch: git checkout -b feature/your-feature

Commit your changes: git commit -m "Add some feature"

Push to the branch: git push origin feature/your-feature

Open a Pull Request
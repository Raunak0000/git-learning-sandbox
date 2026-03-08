# 🧪 Git Learning Sandbox

> A web-based terminal simulator that lets you practice Git commands in a safe, visual environment — no real repo needed.

Built with **Spring Boot** + **React**, this app simulates an in-memory Git repository with a live commit graph so you can see exactly what your commands do.

---

## ✨ Highlights

| Feature | Description |
|---|---|
| **Interactive Terminal** | Custom terminal with command history, syntax highlighting, and error feedback |
| **Live Commit Graph** | Animated DAG visualization that updates in real-time as you work |
| **Full Git Workflow** | Init, stage, commit, branch, checkout, merge — all simulated in-memory |
| **Glassmorphism UI** | Modern dark theme with floating glass panels and smooth animations |
| **Nuclear Reset** | One-click wipe to reset everything back to a clean slate |
| **Containerized** | Full Docker Compose stack with frontend, backend, database, and monitoring |

---

## 🏗️ Architecture

```
┌──────────────────┐     REST API     ┌──────────────────┐     JDBC     ┌────────────┐
│  React + Vite    │ ───────────────► │  Spring Boot 3   │ ──────────► │ PostgreSQL │
│  (src/frontend)  │  /api/terminal   │  (Java 17)       │             │            │
└──────────────────┘                  └──────────────────┘             └────────────┘
```

**Frontend** — Single-page app with Terminal, Commit Graph, Sidebar, and Header components.
**Backend** — Parses commands, manages in-memory Git state, exposes REST endpoints.
**Infrastructure** — Docker, Jenkins CI/CD, Kubernetes manifests, Terraform configs, Nagios monitoring.

---

## 🚀 Quick Start

### Prerequisites

- Java 17+
- Maven 3.9+
- Node.js 20+

### Run Locally

```bash
# Backend
./mvnw spring-boot:run

# Frontend (in a new terminal)
cd src/frontend
npm install
npm run dev
```

Open the URL from Vite (usually `http://localhost:5173`).

### Run with Docker

```bash
docker-compose up --build
```

This starts the frontend (`localhost:3000`), backend (`localhost:8080`), PostgreSQL, and Nagios monitoring (`localhost:8081`).

---

## 💻 Supported Commands

```
git init                        # Initialize a new repo
git status                      # Show working tree status
touch <file>                    # Create a new file

git add <file>                  # Stage a specific file
git add .                       # Stage all files
git commit -m "message"         # Commit staged changes

git log                         # Show commit history
git log --oneline               # Compact commit log

git branch                      # List branches
git branch <name>               # Create a new branch
git checkout <branch>           # Switch branches
git checkout -b <branch>        # Create and switch
git merge <branch>              # Merge a branch

clear                           # Clear terminal
```

---

## 📂 Project Structure

```
├── src/
│   ├── main/            # Spring Boot backend (Java)
│   ├── frontend/        # React + Vite frontend
│   ├── test/            # Unit tests
│   └── resources/       # App configuration
├── infrastructure/
│   ├── docker/          # Docker configs
│   ├── kubernetes/      # K8s manifests
│   └── terraform/       # IaC definitions
├── monitoring/          # Nagios alerts & dashboards
├── pipelines/           # Jenkinsfile (CI/CD)
├── docs/                # Design doc, project plan, user guide
├── Dockerfile           # Multi-stage backend build
├── docker-compose.yml   # Full stack orchestration
└── pom.xml              # Maven config
```

---

## 📄 License

MIT — see [LICENSE](LICENSE) for details.

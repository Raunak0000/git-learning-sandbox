# Git Learning Sandbox

An interactive, web-based terminal simulator designed to help users learn Git commands in a safe, visual environment. 

The project features a sleek, dark-themed terminal UI with a modern glassmorphism aesthetic, coupled with a Spring Boot backend that simulates a complete Git repository state in-memory. It includes a real-time, animated Commit Graph visualization to help users understand the structure of their repository, staging areas, branches, and merges as they type commands.

## Features

- **Interactive Terminal UI:** A custom-built terminal emulator with command history (using <kbd>↑</kbd> and <kbd>↓</kbd> arrows), syntax-highlighted outputs, and error handling.
- **Git Simulation Backend:** A Spring Boot service that processes simulated Git commands and manages an in-memory repository state, including a staging area and branch tracking.
- **Commit Graph Visualization:** A dynamically rendered, DAG-style vertical graph that visualizes the commit history side-by-side with the terminal. Features smooth CSS animations and highlights `HEAD`, branches, and merge commits.
- **Advanced Git Operations:** Supports creating new files, staging (`git add`), branching (`git checkout -b`), and true merge commits (`git merge`).
- **Nuclear Reset:** A built-in quick action to completely wipe the backend memory and reset the frontend UI to factory settings.
- **Modern Tech Stack:** Built with Java 21, Spring Boot 3, React, and Vite.

## Architecture

The application is split into two main components:

1. **Backend (Spring Boot)**
   - Located in the root directory.
   - Exposes a REST API (`POST /api/terminal/execute` and `POST /api/terminal/reset`) that receives user commands, parses them, updates the in-memory Git state, and returns terminal-formatted string responses.

2. **Frontend (React + Vite)**
   - Located in `src/frontend/`.
   - A single-page application that renders the Terminal, Header, Sidebar, and Commit Graph as floating glassmorphism cards.
   - Proxies API requests to the backend during development to avoid CORS issues.

## Prerequisites

To run this project locally, you will need:
- **Java 17** or higher
- **Maven** (3.9+ recommended)
- **Node.js** (v20.19+ or v22.12+)
- **npm** (comes with Node.js)

## Getting Started

### 1. Start the Backend

Open your terminal in the root directory of the project and run the Spring Boot application:

```bash
# Using Maven
./mvnw spring-boot:run
```
The backend server will start on `http://localhost:8080`.

### 2. Start the Frontend

Open a new terminal window, navigate to the frontend directory, install dependencies, and start the development server:

```bash
cd src/frontend
npm install
npm run dev
```
The Vite development server will start (usually on `http://localhost:5173` or `5174`).

### 3. Open the App

Open your browser and navigate to the local URL provided by Vite. 

To get started, try typing the following sequence of commands in the terminal:
1. `git init`
2. `touch file.txt`
3. `git add .`
4. `git commit -m "Initial commit"`
5. `git checkout -b feature`
6. `git log`

Notice how the **Commit Graph** panel on the right smoothly updates to reflect your simulated repository!

## Supported Commands

Currently, the sandbox supports the following simulated commands:

### Basic Workflow
- `git init`
- `touch <file>`
- `git status`

### Staging & Committing
- `git add <file>`
- `git add .`
- `git commit -m "message"`
- `git log`
- `git log --oneline`
- `git log --graph-data`

### Branching & Merging
- `git branch`
- `git branch <name>`
- `git checkout <branch>`
- `git checkout -b <branch>`
- `git merge <branch>`

### Utilities
- `clear` (terminal utility)

## License

This project is open-source and available under the terms of the MIT License.

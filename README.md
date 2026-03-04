# Git Learning Sandbox

An interactive, web-based terminal simulator designed to help users learn Git commands in a safe, visual environment. 

The project features a sleek, dark-themed terminal UI that mimics real developer tools, coupled with a Spring Boot backend that simulates Git repository state. It also includes a real-time Commit Graph visualization to help users understand the structure of their repository as they make commits.

## Features

- **Interactive Terminal UI:** A custom-built terminal emulator with command history (using <kbd>↑</kbd> and <kbd>↓</kbd> arrows), colored outputs, and error handling.
- **Git Simulation Backend:** A Spring Boot service that processes simulated Git commands (`git init`, `git status`, `git commit`, `git log`) and manages an in-memory repository state.
- **Commit Graph Visualization:** A dynamically rendered, DAG-style vertical graph that visualizes the commit history (`git log`), highlighting `HEAD` and showing parent-child relationships.
- **Quick-Reference Sidebar:** A handy cheat-sheet of supported commands that can be clicked to auto-fill the terminal prompt.
- **Modern Tech Stack:** Built with Java 21, Spring Boot 3, React, and Vite.

## Architecture

The application is split into two main components:

1. **Backend (Spring Boot)**
   - Located in the root directory.
   - Exposes a REST API (`POST /api/terminal/execute`) that receives user commands, parses them, updates the in-memory Git state, and returns terminal-formatted string responses.

2. **Frontend (React + Vite)**
   - Located in `src/frontend/`.
   - A single-page application that renders the Terminal, Header, Sidebar, and Commit Graph.
   - Proxies API requests to the backend during development to avoid CORS issues.

## Prerequisites

To run this project locally, you will need:
- **Java 21** or higher
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
2. `git status`
3. `git commit -m "Initial commit"`
4. `git commit -m "Add feature X"`
5. `git log`

Notice how the **Commit Graph** panel at the bottom updates to reflect your simulated repository!

## Supported Commands

Currently, the sandbox supports basic simulation of the following commands:
- `git init`
- `git status`
- `git commit -m "message"`
- `git log`
- `clear` (terminal utility)

## License

This project is open-source and available under the terms of the MIT License.

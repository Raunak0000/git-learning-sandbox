# 🏗️ Technical Design Document: Git Learning Sandbox

## 1. System Architecture Overview
The Git Learning Sandbox utilizes a modern 3-tier architecture to provide a seamless, interactive terminal experience. [cite_start]The system is fully containerized using Docker and deployed via an automated CI/CD pipeline [cite: 8, 15-18].



### 1.1 Components
* **Presentation Layer (Frontend):** A React.js single-page application built with Vite. It simulates a command-line interface and renders dynamic commit graphs.
* **Application Layer (Backend):** A Spring Boot Java application exposing a REST API. It houses the core business logic (`GitService`) that simulates Git version control operations in-memory.
* [cite_start]**Data Layer (Database):** A PostgreSQL 13 database is provisioned within the Docker network (`jdbc:postgresql://db:5432/gitsandbox`) to support future data persistence of user sessions and sandbox states[cite: 8].

## 2. Core Modules & Data Flow

### 2.1 The Terminal UI (`Terminal.jsx` & `App.jsx`)
The React frontend captures user keystrokes in a simulated terminal window. When a user presses 'Enter', the input is parsed and sent as a JSON payload to the backend via the native `fetch` API.

### 2.2 The REST Controller (`TerminalController.java`)
[cite_start]The Spring Boot application exposes a single, centralized endpoint to process incoming commands [cite: 173-176]:
* **Endpoint:** `POST /api/terminal/execute`
* **Request Payload:** `{ "command": "<git command string>" }`
* **Response:** Returns a standard `String` containing the simulated terminal output or standard error message.



### 2.3 The Git Engine (`GitService.java`)
This service acts as the brain of the sandbox. Instead of writing actual files to the host operating system, it uses an advanced Tree structure stored in server memory:
* `Map<String, Commit> commits`: A dictionary storing every commit object by its unique hash.
* `Map<String, String> branches`: A dictionary linking branch names (e.g., `main`, `feature`) to specific commit hashes.
* `String currentBranch`: Acts as the `HEAD` pointer to track the user's active context.

## 3. DevOps & Infrastructure

### 3.1 Containerization strategy
The application uses Docker multi-stage builds to ensure lightweight, production-ready images:
* **Backend Image:** Uses `maven:3.9.6-eclipse-temurin-17` for compilation and `eclipse-temurin:17-jre` for runtime execution.
* **Frontend Image:** Uses `node:18-alpine` for the build process and `nginx:alpine` to serve static assets efficiently.

### 3.2 Continuous Integration & Continuous Deployment (CI/CD)
[cite_start]The project utilizes Jenkins for automated pipeline execution [cite: 15-18]:
1. [cite_start]**Build:** Compiles the Java application via Maven[cite: 15].
2. [cite_start]**Test:** Executes JUnit test suites ensuring >80% coverage[cite: 16].
3. [cite_start]**Security Scan:** Uses `trivy fs .` to scan the codebase and dependencies for known vulnerabilities[cite: 17, 18].
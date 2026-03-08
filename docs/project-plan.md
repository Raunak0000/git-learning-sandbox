# 📅 Project Plan: Git Learning Sandbox

**Developer:** Raunak Warrier
**Project Timeline:** 4 Weeks

## Phase 1: Planning and Architecture (Week 1)
* Define the core problem statement: creating a safe, simulated environment for beginners to learn Git.
* Select the technology stack: React (Frontend), Spring Boot (Backend), PostgreSQL (Database).
* Design the in-memory Git tree data structure using Java `Map` objects to support branching.

## Phase 2: Application Development (Week 2)
* Develop REST API endpoints via `TerminalController.java`.
* Implement core `GitService` logic supporting `init`, `commit`, `branch`, `checkout`, `log`, and `status`.
* Build the React frontend terminal UI and wire it to the Spring Boot backend using the `fetch` API.

## Phase 3: Containerization & Infrastructure (Week 3)
* Write a multi-stage `Dockerfile` for the Spring Boot backend using Maven and Eclipse Temurin.
* Write a multi-stage `Dockerfile` for the React frontend to serve static files via Nginx.
* Orchestrate all services (Frontend, Backend, Database, and Nagios) using `docker-compose.yml`.

## Phase 4: Continuous Integration & Security (Week 4)
* Implement a comprehensive JUnit test suite for `GitService` to achieve >80% code coverage.
* Configure a declarative `Jenkinsfile` for automated build and testing stages.
* Integrate Trivy for automated filesystem vulnerability scanning during the CI/CD pipeline.
* Finalize required documentation, including the technical design, user guide, and project plan.
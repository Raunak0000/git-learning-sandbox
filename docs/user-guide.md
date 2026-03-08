# 📘 User Guide: Git Learning Sandbox

Welcome to the Git Learning Sandbox! This tool provides a safe, browser-based terminal to practice Git commands and visualize branching without risking your local file system.

## Getting Started
1. Ensure the Docker containers are running (`docker-compose up -d`).
2. Open your web browser and navigate to `http://localhost:3000`.
3. Click anywhere in the black terminal window to focus the input prompt.

## Supported Git Commands

### 1. Repository Initialization
* `git init`: Initializes an empty Git repository. **Note:** You must run this command before any others will work.

### 2. Making Changes
* `git status`: Checks the current state of your working tree and displays your active branch.
* `git commit -m "your message"`: Creates a new commit in the timeline with your specified message.

### 3. Branching and Navigation
* `git branch`: Lists all available branches in the sandbox. The active branch is marked with an asterisk (*).
* `git branch <branch-name>`: Creates a new branch pointing to your current commit, but keeps you on your active branch.
* `git checkout <branch-name>`: Switches your terminal context to the specified branch.
* `git checkout -b <branch-name>`: A shortcut that creates a new branch and immediately switches you to it.

### 4. Viewing History
* `git log`: Displays a detailed, multi-line history of commits for your current branch.
* `git log --oneline`: Displays a condensed, single-line version of your commit history.

### 5. Sandbox Utilities
* `clear`: Wipes the terminal screen clean if the interface becomes too cluttered.

## Interactive UI Features
* **Command Auto-fill:** Click any command in the left sidebar to instantly insert it into your terminal prompt.
* **Visual Commit Graph:** The right-hand panel dynamically updates to show your commit history as you type commands, helping you visualize the Git tree structure.
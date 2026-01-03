# Limousine

A project for UIT SE214 Advanced Software Engineering

Build a Learning Management System with a Layered architecture and a Domain-Driven Design system. This project also practices Extreme Programming during development.

# Tech Stack

- Front-End: React, Bootstrap, React Bootstrap, React Router
- Back-End: Express, Passport.JS, Prisma ORM
- Database: PostgreSQL
- Hosting Services
  - Front-End: [Netlify](https://uit-limousine.netlify.app/)
  - Back-End: [Render](https://uit-limousine.onrender.com/)
  - Database: Neon
- Architecture: Serverless
- DevOps, CI: GitHub Actions
- Progress Tracking, Backlog: GitHub Project

# How to Run the Application

- Download the [source code](https://github.com/Huangphoux/uit-limousine/archive/refs/heads/main.zip) of the project.

## Without Docker

- Navigate to the `scripts` folder.
- Double-click to run the following scripts:
  - `0_download_node.bat`: Download NVM, Node Version Manager, a version manager for Node on Windows.
  - `1_install_node.bat`: Download Node version 22.18.0 (LTS).
  - `2_install_dependencies.bat`: Install the dependencies required for the client, server, and system to operate.
  - `4_dev.bat`: Run both the client and server simultaneously.

## Using Docker

- Ensure Docker is installed and running on your system.
- Navigate to the root directory of the project using Terminal
- Run the following command to build and start the application:
  ```bash
  docker-compose up --build
  ```
- Access the application:
  - Front-End: `http://localhost:3000`
  - Back-End: `http://localhost:5173`

# Contribution Guidelines

- All function names, comments, and variable names must be written in English.
- Generate Prisma to use Prisma Client.
- Create a `.env` file in `server` to store `DATABASE_URL`. Check the Discord server.
- Make a new Pull Request to check for all tests before merging into main.

# Notes

- `.env` needs to be outside of `/src`

# Figma

- https://www.figma.com/design/qIlNoB09y2bOvsum4brE8C/M%C3%A0n-h%C3%ACnh-t%C3%ACm-kho%C3%A1-h%E1%BB%8Dc?m=auto&t=GhhCqiywoQLyVyI5-1

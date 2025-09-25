# uit-SE357_Requirement_Engineering

## Quickstart for those using Windows

- Clone the repository
- Open the `scripts` folder
- If you don't already have Node, run `download_node.bat` first, then `install_node.bat` to install Node
- Run `install_dependencies.bat` file to install the dependencies
- Use `dev.bat` to start developing
- Access the client at [http://localhost:5173](http://localhost:5173)
### !!! IMPORTANT !!!
- Shut down the client and server properly by `Ctrl-C` instead of clicking the close button. You won't be able to start again due to the port being already in use.
- In case that happened, open the Task Manager and kill all Node processes.

## Getting Started with Docker

- Install Docker
- Clone the repository
- Start Docker Desktop
- Open Terminal in the repository's folder
- Run `docker compose up` to start all services (Only run this after `docker compose down`).
- Check the "Container" tab in Docker Desktop.
- Access the client at [http://localhost:5173](http://localhost:5173)
- Use `docker compose up --build` rebuild the containers.
- After developing, run `docker compose down` to stop and remove the containers.
- Use `docker system prune -a --volumes` to remove all Docker-related data (containers, images, volumes).

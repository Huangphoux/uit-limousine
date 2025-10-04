# How to use Docker (outdated)

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

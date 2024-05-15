# README.md

```markdown
# Create Hima App Backend

This is the backend for the Create Hima App. It is built with Python, using FastAPI, SQLAlchemy, Alembic, and other dependencies as listed in `pyproject.toml`.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- Docker
- Docker Compose

### Installation

1. Clone the repository
```bash
git clone https://github.com/vichannnnn/create-hima-app-backend.git
```

2. Navigate to the project directory

```bash
cd create-hima-app-backend
```

3. Build and run the Docker containers

```bash
docker-compose up -d --build
```

4. Run database migrations

```bash
make migrate
```

## Usage

Once the application is running, you can access the Swagger UI for API documentation and testing
at `http://localhost:8000/docs`.

## Contributing

Please read `CONTRIBUTING.md` for details on our code of conduct, and the process for submitting pull requests to us.

## License

This project is licensed under the MIT License - see the `LICENSE.md` file for details

```

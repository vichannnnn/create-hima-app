# README.md

```markdown
# Create Hima App Backend

This is the backend for the Create Hima App. It is built with Python, using FastAPI, SQLAlchemy, Alembic, and other dependencies as listed in `pyproject.toml`.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- Docker
- Docker Compose

## PyCharm Setup

If you're using PyCharm as your IDE, follow these steps to set up the project:

### Marking Sources Root

To prevent linting issues with external packages, you need to mark the `__pypackages__/<version>/lib` directory as the Sources Root. Here's how to do it:

1. In the Project tool window, select the `__pypackages__/<version>/lib` directory.
2. Right-click the directory.
3. In the context menu, navigate to `Mark Directory as`.
4. Click `Sources Root`.

### Setting Up PDM for Local Server

To set up PDM for your local server, follow these steps:

1. Install PDM using pip: `pip install pdm`.
2. Navigate to the project directory: `cd backend`.
3. Install the project dependencies: `pdm install`.

Note: There's no need to initialize PDM as this has already been done for this project.

After following these steps, you should be able to run the local server and start developing using PyCharm.

### Installation

1. Clone the repository
```bash
git clone https://github.com/vichannnnn/create-hima-app-backend.git
```

2. Navigate to the project directory

```bash
cd backend
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

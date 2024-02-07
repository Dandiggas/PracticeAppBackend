
# Practice Session Recording App - Backend

## Overview

This repository contains the backend implementation of a practice session recording application, built with Django and Django REST framework. The application is designed for musicians to record, manage, and track their practice sessions. This project highlights my backend development skills, demonstrating proficiency in RESTful API design, data modeling, and system integration.

## Features

- **RESTful API**: Implements REST principles for intuitive interaction with client applications.
- **Model Serialization**: Uses Django REST framework's serializers for efficient data handling.
- **Generic API Views**: Leverages Django REST framework's generic views for code efficiency.
- **Database Integration**: Utilizes Django's ORM for database operations.
- **User-Friendly Duration and Date Input**: Custom handling of duration and date fields for ease of use.
- **Testing**: Includes tests to ensure functionality and reliability.

## Technical Specifications

- **Framework**: Django and Django REST Framework
- **Database**: Postgres
- **Deployment**: Dockerized application

## API Endpoints

- `GET /sessions/`: List all practice sessions.
- `POST /sessions/`: Create a new practice session.
- `GET /sessions/{id}/`: Retrieve a specific practice session.
- `PUT /sessions/{id}/`: Update a specific practice session.
- `DELETE /sessions/{id}/`: Delete a specific practice session.

## Installation and Setup

### Prerequisites

- Docker installed on your machine. Download from [Docker's official website](https://www.docker.com/get-started).

### Clone the Repository

1. Clone the repository and navigate into it:
   ```bash
   git clone https://github.com/Dandiggas/PracticeAppBackend
   cd PracticeAppBackend
   ```

### Running the Application

2. Start the application with Docker Compose:
   ```bash
   docker-compose up
   ```

### Database Migration

3. Run database migrations:
   ```bash
   docker-compose exec web python manage.py migrate
   ```

### Accessing the Application

4. Access the API at [http://127.0.0.1:8000/api/v1/](http://127.0.0.1:8000/api/v1/).

## Future Enhancements

- Token-based authentication
- Permissions



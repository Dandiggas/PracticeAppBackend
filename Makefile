# Makefile for MusiciansPracticeApp

# Default command: runs both backend and new Next.js frontend
all: backend frontend

start: all

# Backend commands (Docker Compose)
backend:
	@echo "Starting backend services..."
	docker-compose up -d --build

stop-backend:
	@echo "Stopping backend services..."
	docker-compose down

logs-backend:
	@echo "Showing backend logs..."
	docker-compose logs -f

build-backend:
	@echo "Building backend Docker images..."
	docker-compose build

# Frontend commands
# Default frontend is now Next.js
frontend: frontend-next

frontend-cra:
	@echo "Starting CRA frontend development server (old)..."
	cd frontend/my-app && npm start

frontend-next:
	@echo "Starting Next.js frontend development server (new)..."
	cd frontend/next-app && npm run dev

# Combined stop command (stops backend, frontend needs manual stop or separate command)
stop: stop-backend
	@echo "Backend services stopped. Frontend (if running) needs to be stopped manually (Ctrl+C)."

.PHONY: all start backend frontend frontend-cra frontend-next stop-backend logs-backend build-backend stop

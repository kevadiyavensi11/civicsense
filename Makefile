# ============================================================
#  CivicSense — Makefile
#  Usage: make <target>
#  Requires: make (via Git Bash / WSL / Chocolatey)
#            Node.js >= 18, Angular CLI installed globally
# ============================================================

.PHONY: help install backend citizen authority admin all stop clean logs

# Default target
help:
	@echo ""
	@echo "  CivicSense — Available Commands"
	@echo "  ================================"
	@echo "  make install     Install all npm dependencies (backend + all panels)"
	@echo "  make backend     Start backend API server (port 5000)"
	@echo "  make citizen     Start Citizen Panel  (port 4202)"
	@echo "  make authority   Start Authority Panel (port 4201)"
	@echo "  make admin       Start Admin Panel    (port 4200)"
	@echo "  make all         Start ALL (backend + all 3 panels)"
	@echo "  make stop        Kill all Node.js processes"
	@echo "  make clean       Remove all node_modules folders"
	@echo "  make logs        Tail backend log file"
	@echo ""

# -----------------------------------------------
# INSTALL — runs npm install in all 4 directories
# -----------------------------------------------
install:
	@echo "[1/4] Installing backend dependencies..."
	cd backend && npm install
	@echo "[2/4] Installing citizen-panel dependencies..."
	cd citizen-panel && npm install
	@echo "[3/4] Installing authority-panel dependencies..."
	cd authority-panel && npm install
	@echo "[4/4] Installing admin-panel dependencies..."
	cd admin-panel && npm install
	@echo ""
	@echo "All dependencies installed successfully."

# -----------------------------------------------
# BACKEND — starts Node.js Express server
# -----------------------------------------------
backend:
	@echo "Starting CivicSense Backend on port 5000..."
	cd backend && npm run dev

# -----------------------------------------------
# CITIZEN PANEL
# -----------------------------------------------
citizen:
	@echo "Starting Citizen Panel on http://localhost:4202 ..."
	cd citizen-panel && ng serve --port 4202 --open

# -----------------------------------------------
# AUTHORITY PANEL
# -----------------------------------------------
authority:
	@echo "Starting Authority Panel on http://localhost:4201 ..."
	cd authority-panel && ng serve --port 4201 --open

# -----------------------------------------------
# ADMIN PANEL
# -----------------------------------------------
admin:
	@echo "Starting Admin Panel on http://localhost:4200 ..."
	cd admin-panel && ng serve --port 4200 --open

# -----------------------------------------------
# ALL — Start everything in parallel (background)
# NOTE: On Windows Git Bash, use: make all
# -----------------------------------------------
all:
	@echo "Starting all CivicSense services..."
	@echo ""
	@echo "  Backend  → http://localhost:5000"
	@echo "  Citizen  → http://localhost:4202"
	@echo "  Authority → http://localhost:4201"
	@echo "  Admin    → http://localhost:4200"
	@echo ""
	cd backend && npm run dev &
	sleep 3
	cd citizen-panel && ng serve --port 4202 &
	cd authority-panel && ng serve --port 4201 &
	cd admin-panel && ng serve --port 4200 &
	@echo "All services started. Use 'make stop' to kill them."

# -----------------------------------------------
# STOP — Kill all node processes
# -----------------------------------------------
stop:
	@echo "Stopping all Node.js processes..."
	-pkill -f node || taskkill /F /IM node.exe
	@echo "Done."

# -----------------------------------------------
# CLEAN — Remove all node_modules
# -----------------------------------------------
clean:
	@echo "Removing node_modules from all projects..."
	rm -rf backend/node_modules
	rm -rf citizen-panel/node_modules
	rm -rf authority-panel/node_modules
	rm -rf admin-panel/node_modules
	@echo "Clean complete. Run 'make install' to reinstall."

# -----------------------------------------------
# LOGS — Tail backend stderr/stdout
# -----------------------------------------------
logs:
	tail -f backend/server.log 2>/dev/null || echo "No log file found. Use 'npm run dev' output directly."

#!/usr/bin/env bash
# Demo launch helper for BREAD
# Usage: ./scripts/demo_launch.sh [--install]
set -euo pipefail

ROOT_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)
cd "$ROOT_DIR"

echo "Starting BREAD demo environment..."

# Optional install step
if [ "${1:-}" = "--install" ]; then
  echo "Installing frontend dependencies..."
  npm install

  echo "Installing backend dependencies..."
  cd backend
  python -m venv .venv
  source .venv/bin/activate
  pip install -r requirements.txt
  cd "$ROOT_DIR"
fi

# Source backend .env if available
if [ -f backend/.env ]; then
  echo "Loading backend environment variables from backend/.env"
  set -a
  source backend/.env
  set +a
fi

# Start backend in background
cd backend
if [ -d .venv ]; then
  source .venv/bin/activate
fi
nohup python main.py > backend.log 2>&1 &
BACKEND_PID=$!
echo "Backend started (PID $BACKEND_PID), logging to backend/backend.log"

# Return to root and start frontend
cd "$ROOT_DIR"
npm run dev

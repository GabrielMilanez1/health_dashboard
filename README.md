# 🏥 Health Dashboard

Full-stack application with **React Native** (Expo + TypeScript) frontend and **Laravel 10+** (PHP) backend, powered by **MySQL** and ready for **Google Gemini API** integration.

## 🚀 Quick Start

### Prerequisites

- [Docker](https://www.docker.com/get-started) and Docker Compose installed
- (Optional) [Expo Go](https://expo.dev/go) app on your phone for mobile testing

### 1. Configure Environment

```bash
# Copy and edit the environment file
# Update DB passwords and add your Gemini API key when ready
cp .env.example .env   # or just edit the existing .env
```

### 2. Start Everything

```bash
docker compose up --build
```

> ⏳ **First run takes a few minutes** — Docker will scaffold both the Laravel and Expo projects automatically.

### 3. Access the Application

| Service   | URL                                  | Description              |
|-----------|--------------------------------------|--------------------------|
| Backend   | http://localhost:9000                | Laravel API              |
| Health    | http://localhost:9000/api/health     | API health check         |
| Mobile    | http://localhost:8081                | Expo dev server          |
| Database  | localhost:3306                       | MySQL (dev only)         |

## 📁 Project Structure

```
├── docker-compose.yml          # Orchestrates all services
├── .env                        # Environment variables (secrets)
├── docker/
│   ├── backend/                # Docker config for Laravel
│   │   ├── Dockerfile
│   │   ├── entrypoint.sh       # Auto-scaffolds Laravel on first run
│   │   └── overlay/            # Custom files applied after scaffold
│   └── mobile/                 # Docker config for Expo
│       ├── Dockerfile
│       ├── entrypoint.sh       # Auto-scaffolds Expo on first run
│       └── overlay/            # Custom files applied after scaffold
├── backend/                    # Laravel source code (auto-generated)
└── mobile/                     # Expo source code (auto-generated)
```

## 🛠️ Development

### Backend (Laravel)

```bash
# Run artisan commands
docker compose exec backend php artisan migrate
docker compose exec backend php artisan tinker
docker compose exec backend php artisan route:list
```

### Mobile (Expo)

For the best mobile development experience, run Expo locally:

```bash
cd mobile
npm install
npx expo start
```

> 📱 **Tip**: Scan the QR code with Expo Go on your phone.

### Database

```bash
# Access MySQL CLI
docker compose exec db mysql -u app_user -p health_dashboard
```

## 🔒 Security Notes

- All secrets are stored in environment variables (never hardcoded)
- Security headers middleware is applied to all API responses
- CSRF protection is enabled (Laravel default)
- Database uses a non-root user for the application
- TODO(security): Implement OAuth provider authentication
- TODO(security): Implement MFA for sensitive operations
- TODO(security): Add mTLS for database connections in production
- TODO(security): Implement rate limiting on API endpoints

## 🤖 Gemini AI Integration

The project is prepared for Google Gemini API integration:

1. Get your API key at [Google AI Studio](https://aistudio.google.com/apikey)
2. Add it to `.env`: `GEMINI_API_KEY=your-key-here`
3. Implement the service in `backend/app/Services/LlmService.php`

## 📋 Commands Reference

```bash
docker compose up --build       # Start all services (first time)
docker compose up               # Start all services
docker compose down             # Stop all services
docker compose down -v          # Stop and delete all data
docker compose logs backend     # View backend logs
docker compose logs mobile      # View mobile logs
docker compose restart backend  # Restart backend only
```

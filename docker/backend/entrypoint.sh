#!/bin/bash
set -e

cd /var/www/html

# =============================================================================
# First Run: Scaffold Laravel Project
# =============================================================================
if [ ! -f "artisan" ]; then
    echo ""
    echo "========================================="
    echo "  Scaffolding Laravel project..."
    echo "========================================="
    echo ""

    # Create Laravel project in temp directory, then copy to mounted volume
    composer create-project laravel/laravel /tmp/laravel --prefer-dist --no-interaction
    cp -rT /tmp/laravel .
    rm -rf /tmp/laravel

    # Apply custom overlay files (controllers, middleware, routes, services)
    echo "Applying custom configurations..."
    cp -rT /overlay .

    # Generate application key
    php artisan key:generate --force

    # Register API routes in bootstrap/app.php (Laravel 12 doesn't include api.php by default)
    if ! grep -q "api:" bootstrap/app.php 2>/dev/null; then
        sed -i "s|web: __DIR__.'/../routes/web.php',|web: __DIR__.'/../routes/web.php',\n        api: __DIR__.'/../routes/api.php',|" bootstrap/app.php 2>/dev/null || true
    fi

    # Register SecurityHeaders middleware in bootstrap/app.php
    if ! grep -q "SecurityHeaders" bootstrap/app.php 2>/dev/null; then
        sed -i 's|->withMiddleware(function (Middleware $middleware): void {|->withMiddleware(function (Middleware $middleware): void {\n        $middleware->append(\\App\\Http\\Middleware\\SecurityHeaders::class);|' bootstrap/app.php 2>/dev/null || true
    fi

    # Add Groq config to config/services.php
    if ! grep -q "groq" config/services.php 2>/dev/null; then
        sed -i "/^];/i\\
    /*\\
    |--------------------------------------------------------------------------\\
    | Groq (LLM)\\
    |--------------------------------------------------------------------------\\
    |\\
    | Configuration for Groq API integration.\\
    | Get your API key at: https://console.groq.com/keys\\
    |\\
    */\\
    'groq' => [\\
        'api_key' => env('GROQ_API_KEY'),\\
        'modelo'  => env('GROQ_MODEL', 'llama-3.3-70b-versatile'),\\
    ],\\
" config/services.php 2>/dev/null || true
    fi

    echo ""
    echo "Laravel project scaffolded successfully!"
    echo ""
fi

# =============================================================================
# Install / Update Dependencies
# =============================================================================
composer install --no-interaction --optimize-autoloader 2>/dev/null || true

# =============================================================================
# Configure Environment
# =============================================================================
if [ ! -f ".env" ]; then
    cp .env.example .env
    php artisan key:generate --force
fi

# Update .env with Docker environment variables
# First, uncomment any commented-out DB lines so the sed replacements below can match
sed -i "s|^# *DB_CONNECTION=|DB_CONNECTION=|" .env
sed -i "s|^# *DB_HOST=|DB_HOST=|" .env
sed -i "s|^# *DB_PORT=|DB_PORT=|" .env
sed -i "s|^# *DB_DATABASE=|DB_DATABASE=|" .env
sed -i "s|^# *DB_USERNAME=|DB_USERNAME=|" .env
sed -i "s|^# *DB_PASSWORD=|DB_PASSWORD=|" .env

# Now replace with Docker environment values
sed -i "s|DB_CONNECTION=.*|DB_CONNECTION=${DB_CONNECTION:-mysql}|" .env
sed -i "s|DB_HOST=.*|DB_HOST=${DB_HOST:-db}|" .env
sed -i "s|DB_PORT=.*|DB_PORT=${DB_PORT:-3306}|" .env
sed -i "s|DB_DATABASE=.*|DB_DATABASE=${DB_DATABASE:-health_dashboard}|" .env
sed -i "s|DB_USERNAME=.*|DB_USERNAME=${DB_USERNAME:-app_user}|" .env
sed -i "s|DB_PASSWORD=.*|DB_PASSWORD=${DB_PASSWORD:-change_me}|" .env
sed -i "s|APP_ENV=.*|APP_ENV=${APP_ENV:-local}|" .env
sed -i "s|APP_DEBUG=.*|APP_DEBUG=${APP_DEBUG:-true}|" .env
sed -i "s|APP_URL=.*|APP_URL=http://localhost:9000|" .env

# Add Groq config to .env if not present
if ! grep -q "GROQ_API_KEY" .env; then
    echo "" >> .env
    echo "# Groq API (LLM)" >> .env
    echo "GROQ_API_KEY=${GROQ_API_KEY:-}" >> .env
    echo "GROQ_MODEL=${GROQ_MODEL:-llama-3.3-70b-versatile}" >> .env
fi

# Add JWT secret to .env if not present
if ! grep -q "JWT_SECRET" .env; then
    echo "" >> .env
    echo "# JWT Authentication" >> .env
    echo "JWT_SECRET=${JWT_SECRET:-}" >> .env
else
    # Update existing JWT_SECRET with Docker environment value
    if [ -n "${JWT_SECRET}" ]; then
        sed -i "s|JWT_SECRET=.*|JWT_SECRET=${JWT_SECRET}|" .env
    fi
fi

# Generate APP_KEY if not set
if grep -q "^APP_KEY=$" .env 2>/dev/null; then
    echo "Generating application key..."
    php artisan key:generate --force
fi

# =============================================================================
# File Permissions (Apache needs write access to storage and cache)
# =============================================================================
chown -R www-data:www-data storage bootstrap/cache 2>/dev/null || true
chmod -R 775 storage bootstrap/cache 2>/dev/null || true

# =============================================================================
# Database Migrations
# =============================================================================
echo "Running database migrations..."
php artisan migrate --force 2>/dev/null || {
    echo "Migrations failed. Retrying in 5 seconds..."
    sleep 5
    php artisan migrate --force 2>/dev/null || echo "WARNING: Migrations still failing. Check database connection."
}

# =============================================================================
# Clear Caches
# =============================================================================
php artisan config:clear
php artisan route:clear
php artisan cache:clear

# =============================================================================
# Start Apache
# =============================================================================
echo ""
echo "================================================"
echo "  Health Dashboard API (Apache)"
echo "  Running on: http://localhost:9000"
echo "  Health check: http://localhost:9000/api/health"
echo "================================================"
echo ""

exec apache2-foreground

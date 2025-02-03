# Laravel + Next.js Project Setup

This repository contains a full-stack application with a Laravel backend and Next.js frontend. Follow the instructions below to set up and run both parts of the project.

## Project Structure

```
laravel_test/
├── backend/
│   ├── adaa/           # Laravel application
│   ├── compose.yml     # Docker configuration
│   └── ...
├── frontend/           # Next.js application
└── README.md
```

## Prerequisites

### With Docker (Recommended)
- Docker
- Docker Compose
- Node.js (v16 or higher)
- npm or yarn

### Without Docker (Backend Alternative)
- PHP 8.2 or higher
- Composer
- MySQL 8.0
- Node.js (v16 or higher)
- npm or yarn

## Backend Setup

### Option 1: With Docker (Recommended)

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Start the Docker containers:
   ```bash
   docker-compose up -d
   ```

3. The following services will be available:
   - Laravel Application: http://localhost:8000
   - PHPMyAdmin: http://localhost:8080

4. Database credentials:
   ```
   Host: localhost
   Port: 3306
   Database: laravel
   Username: laravel
   Password: secret
   Root Password: root
   ```

### Option 2: Without Docker

1. Navigate to the backend directory:
   ```bash
   cd backend/adaa
   ```

2. Install PHP dependencies:
   ```bash
   composer install
   ```

3. Create and configure your `.env` file:
   ```bash
   cp .env.example .env
   ```

4. Configure your database settings in `.env`:
   ```
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=laravel
   DB_USERNAME=your_username
   DB_PASSWORD=your_password
   ```

5. Generate application key:
   ```bash
   php artisan key:generate
   ```

6. Run database migrations:
   ```bash
   php artisan migrate
   ```

7. Start the development server:
   ```bash
   php artisan serve
   ```
   The application will be available at http://localhost:8000

## Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a `.env.local` file and configure your backend API URL:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```

4. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

   The frontend will be available at http://localhost:3000

## Accessing PHPMyAdmin

- URL: http://localhost:8080
- Server: db
- Username: root
- Password: root

## Common Issues and Troubleshooting

### Docker Setup
1. If ports 8000 or 8080 are already in use:
   - Stop any running services on these ports
   - Or modify the port mappings in `compose.yml`

2. If containers fail to start:
   ```bash
   # View container logs
   docker-compose logs

   # Rebuild containers
   docker-compose down
   docker-compose build --no-cache
   docker-compose up -d
   ```

### Non-Docker Setup
1. If you encounter permission issues:
   ```bash
   # Fix storage permissions
   chmod -R 775 storage
   chmod -R 775 bootstrap/cache
   ```

2. If the database connection fails:
   - Ensure MySQL service is running
   - Verify database credentials in `.env`
   - Create the database if it doesn't exist:
     ```sql
     CREATE DATABASE laravel;
     ```

## Additional Commands

### Backend (Laravel)
```bash
# Run migrations
docker-compose exec app php artisan migrate

# Clear cache
docker-compose exec app php artisan cache:clear

# Create a new controller
docker-compose exec app php artisan make:controller NameController
```

### Frontend (Next.js)
```bash
# Build for production
npm run build
# or
yarn build

# Start production server
npm run start
# or
yarn start

# Run linter
npm run lint
# or
yarn lint
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
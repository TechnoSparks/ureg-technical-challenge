# UREG Technical Assessment - Forex Exchange Rates

A full-stack web application that displays foreign exchange rates with a React frontend and Laravel backend. Users can view current and historical exchange rates with an intuitive date picker interface.

## 🛠 Technology Stack

### Frontend
- **React 19** with Vite
- **Ant Design** for UI components
- **Tailwind CSS** for styling
- **Day.js** for date handling

### Backend
- **Laravel 12** (PHP 8.4)
- **MySQL 8.0** database
- **RESTful API** architecture

### DevOps
- **Docker** & Docker Compose
- **nginx** for production frontend serving
- **Apache** for Laravel backend

## 🚀 Quick Start with Docker (Recommended)

### Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running

### 1. Clone and Setup
```bash
git clone <repository-url>
cd ureg-technical
```

### 2. Start the Application
```bash
docker-compose up --build
```

### 3. Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **Database**: localhost:3306

The database will be automatically populated with sample data on first run.

### 4. Stop the Application
```bash
docker-compose down
```

## 💻 Local Development Setup

### Prerequisites
- **PHP 8.2+** with extensions: pdo_mysql, mbstring, exif, pcntl, bcmath, gd
- **Composer** for PHP dependencies
- **Node.js 18+** and npm
- **MySQL 8.0+**

### Backend Setup (Laravel)

1. **Navigate to backend directory**
   ```bash
   cd ureg-task-backend
   ```

2. **Install PHP dependencies**
   ```bash
   composer install
   ```

3. **Copy environment file**
   ```bash
   cp .env.example .env
   ```

4. **Configure database in `.env`**
   ```env
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=ureg_task_backend
   DB_USERNAME=root
   DB_PASSWORD=your_password
   ```

5. **Generate application key**
   ```bash
   php artisan key:generate
   ```

6. **Run database migrations**
   ```bash
   php artisan migrate
   ```

7. **Import the database dump (recommended)**
   ```bash
   mysql -u root -p ureg_task_backend < database_dump.sql
   ```

8. **Build frontend assets**
   ```bash
   npm install
   npm run build
   ```

9. **Start the Laravel server**
   ```bash
   php artisan serve
   ```
   Backend will be available at: http://localhost:8000

### Frontend Setup (React)

1. **Navigate to frontend directory**
   ```bash
   cd ureg-task-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```
   Frontend will be available at: http://localhost:5173

## 📚 API Documentation

### Endpoints

#### Get Latest Rates
```http
GET /api/rates/latest
```

#### Get Rates by Date
```http
GET /api/rates/{YYYYMMDD}?page=1&limit=12
```

#### Get Available Dates
```http
GET /api/rates/availableDates
```

### Example Response
```json
{
  "effective_date": "2025-09-01",
  "rates": [
    {
      "currency": "USD",
      "rate": "1.0000"
    },
    {
      "currency": "EUR",
      "rate": "0.9205"
    }
  ],
  "pagination": {
    "current_page": 1,
    "has_more": true
  }
}
```

## 🗂 Project Structure

```
ureg-technical/
├── docker-compose.yml          # Docker services configuration
├── README.md                   # This file
├── ureg-task-frontend/         # React application
│   ├── src/
│   │   ├── App.jsx            # Main application component
│   │   ├── components/        # Reusable components
│   │   └── assets/           # Static assets
│   ├── package.json          # Frontend dependencies
│   ├── Dockerfile            # Frontend container config
│   └── .env                  # Frontend environment variables
└── ureg-task-backend/         # Laravel application
    ├── app/
    │   ├── Http/Controllers/  # API controllers
    │   └── Models/           # Database models
    ├── database/
    │   ├── migrations/       # Database schema
    │   └── seeders/         # Sample data
    ├── routes/
    │   └── api.php          # API route definitions
    ├── composer.json        # Backend dependencies
    ├── Dockerfile          # Backend container config
    ├── .env               # Backend environment variables
    └── database_dump.sql  # Sample database data
```

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
```env
APP_URL=http://localhost:8000
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=ureg_task_backend
DB_USERNAME=root
DB_PASSWORD=
```

## 📝 Development Notes

- The application uses pagination to handle large datasets efficiently
- Exchange rates are stored with 4 decimal precision
- The frontend automatically adapts the API URL based on environment
- CORS is configured to allow frontend-backend communication

## 📄 License

This project is created for technical assessment purposes.
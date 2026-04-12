# OrderFlow

OrderFlow is a food ordering platform built for both web and mobile users, powered by one shared backend API.

It is designed around two core roles:
- Buyer: signs in, browses available food items, and places orders.
- Seller: signs in and manages food listings through create, update, and delete actions.

## What The App Does

OrderFlow solves a common restaurant workflow problem: managing menus and customer ordering in one connected system.

The app provides:
- Authentication for account registration and login
- Role-based usage flow for buyers and sellers
- Food item management for sellers
- A shared API consumed by both web and Android clients

## User Experience Flow

### Buyer Journey

1. Register or log in.
2. Browse available food items.
3. Select items and proceed with ordering flow.

### Seller Journey

1. Register or log in.
2. Open dashboard.
3. Add new food items.
4. Edit or delete existing listings.

## App Surfaces

- Web client in [frontend](frontend): Browser-based experience using React.
- Android client in [mobile](mobile): Native mobile experience using Kotlin.
- Backend service in [backend](backend): Central API, authentication, and data layer.

## Core Features

- User registration and login
- JWT-based authentication for protected requests
- Food item CRUD operations
- Unified backend consumed by web and mobile

## Tech Stack

- Backend: Java 17, Spring Boot 3, Spring Security, Spring Data JPA, Maven
- Database: PostgreSQL
- Frontend: React 19, Vite, Axios, React Router
- Mobile: Android (Kotlin), Retrofit, Coroutines

## Project Structure

```text
IT342-Ycoy-OrderFlow/
|-- backend/    # Spring Boot REST API
|-- frontend/   # React web app
`-- mobile/     # Android app
```

## Quick Start

### Prerequisites

- Java 17+
- Node.js 20+ and npm
- Android Studio (for mobile)
- PostgreSQL

### 1. Run Backend

```powershell
cd backend
./mvnw spring-boot:run
```

Backend runs on http://localhost:8080

### 2. Run Frontend

```powershell
cd frontend
npm install
npm run dev
```

Frontend runs on http://localhost:5173

The frontend API base is set to http://localhost:8080/api in [frontend/src/services/api.js](frontend/src/services/api.js).

### 3. Run Mobile

1. Open [mobile](mobile) in Android Studio.
2. Sync Gradle.
3. Build and run on emulator/device.

For Android emulator local API calls, use 10.0.2.2 instead of localhost.

## Environment Configuration

Configure database credentials in [backend/src/main/resources/application.properties](backend/src/main/resources/application.properties).

Recommended pattern:

```properties
server.port=8080

spring.datasource.url=${DB_URL}
spring.datasource.username=${DB_USERNAME}
spring.datasource.password=${DB_PASSWORD}

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect
```

Windows PowerShell example:

```powershell
$env:DB_URL="jdbc:postgresql://localhost:5432/orderflow"
$env:DB_USERNAME="postgres"
$env:DB_PASSWORD="your_password"
```

## API Endpoints Used By Clients

- POST /api/auth/register
- POST /api/auth/login
- GET /api/food
- POST /api/food
- PUT /api/food/{id}
- DELETE /api/food/{id}

## Build Commands

### Backend

```powershell
cd backend
./mvnw clean package
./mvnw test
```

### Frontend

```powershell
cd frontend
npm run build
npm run preview
npm run lint
```

### Mobile

```powershell
cd mobile
./gradlew assembleDebug
```

## Troubleshooting

- If backend cannot connect to DB, verify DB_URL, DB_USERNAME, and DB_PASSWORD.
- If frontend cannot reach API, make sure backend is running on port 8080.
- If dev command fails, use npm run dev (not npm rundev).

## Security Note

Do not commit real passwords, tokens, or production credentials.

## Contributors

Developed for the IT342 OrderFlow project.
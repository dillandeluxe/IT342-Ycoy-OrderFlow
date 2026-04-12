# OrderFlow

OrderFlow is a multi-platform food ordering system with a shared backend and two client applications.

This README is refactored to follow the SDD structure in [docs/SDD_OrderFlow_Ycoy.docx.pdf](docs/SDD_OrderFlow_Ycoy.docx.pdf).

## 1.0 Introduction

### 1.1 Stakeholders

- Buyer (Customer): Browses available food items and places orders.
- Seller (Restaurant Administrator): Manages food items and availability.

### 1.2 System Overview

OrderFlow consists of:
- Backend API: Spring Boot REST service with authentication, authorization, and persistence.
- Web App: React + Vite client for browser-based access.
- Android App: Kotlin client for mobile access.

## Included Features

- User registration and login
- JWT-based authentication for secured requests
- Food item CRUD operations for sellers
- Shared API consumption across web and mobile clients

## Excluded Features

- Online payment gateway integration
- Real-time delivery tracking
- Production-grade cloud deployment automation

## 2.0 Functional Requirements Specification

- Account Management
  - Register new users
  - Authenticate existing users
- Food Management
  - Create food items
  - View food items
  - Update food items
  - Delete food items
- API Access Control
  - Attach and validate JWT for protected endpoints

## 3.0 Non-Functional Requirements

- Performance: Responsive API and UI interactions for common user actions.
- Security: Token-based authentication and protected backend routes.
- Reliability: Stable CRUD operations with persistent database storage.
- Maintainability: Layered backend structure and separated frontend/mobile clients.

## 4.0 System Architecture

### Major Components

- frontend/: React web application
- backend/: Spring Boot REST API
- mobile/: Android Kotlin application
- PostgreSQL: Primary relational database

### Component Interaction

- Web and mobile clients send HTTP requests to backend endpoints.
- Backend validates auth, processes business logic, and persists data.
- Backend returns JSON responses to both clients.

### Technology Stack

- Backend: Java 17, Spring Boot 3, Spring Security, Spring Data JPA, Maven
- Database: PostgreSQL (primary), H2 dependency available
- Frontend: React 19, Vite, Axios, React Router
- Mobile: Android (Kotlin), Retrofit, Coroutines

## 5.0 API Contract and Communication

Base URL (local): `http://localhost:8080/api`

### Authentication Endpoints

- `POST /auth/register` - User Registration
- `POST /auth/login` - User Login

### Food Endpoints

- `GET /food`
- `POST /food`
- `PUT /food/{id}`
- `DELETE /food/{id}`

### HTTP Status Codes

- `200` / `201` for successful operations
- `400` for invalid request data
- `401` / `403` for authentication or authorization failures
- `404` for not found resources
- `500` for server errors

### Common Error Codes

- `INVALID_CREDENTIALS`
- `UNAUTHORIZED`
- `VALIDATION_ERROR`
- `RESOURCE_NOT_FOUND`

## 6.0 Database Design

Current persistence uses PostgreSQL via Spring Data JPA.

Core entities implemented in code include:
- User/account data
- Food item data

For schema details, refer to backend entity classes under [backend/src/main/java](backend/src/main/java).

## 7.0 UI/UX Design

- Web UI is implemented with React components in [frontend/src](frontend/src).
- Mobile UI is implemented in Android modules under [mobile/app/src/main](mobile/app/src/main).
- UX goal: simple role-based flows for authentication and food management.

## 8.0 Plan

The SDD plan outlines phased delivery:
- Phase 1: Planning and Design (Week 1-2)
- Phase 2: Backend Development (Week 3-4)
- Phase 3: Web Application (Week 5-6)
- Phase 4: Mobile Application (Week 7-8)
- Phase 5: Integration and Deployment (Week 9-10)

## Setup and Run Guide

## Prerequisites

- Java 17+
- Maven 3.9+ (or Maven Wrapper)
- Node.js 20+ and npm
- Android Studio
- PostgreSQL database

## Environment Setup

Update backend configuration to use environment variables instead of hardcoded secrets in [backend/src/main/resources/application.properties](backend/src/main/resources/application.properties).

Suggested properties:

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

## Run Locally

### Backend

```powershell
cd backend
./mvnw spring-boot:run
```

Backend URL: `http://localhost:8080`

### Frontend

```powershell
cd frontend
npm install
npm run dev
```

Frontend URL: `http://localhost:5173`

### Mobile

1. Open [mobile](mobile) in Android Studio.
2. Sync Gradle.
3. Run on emulator or physical device.

If testing against local backend from Android emulator, use `10.0.2.2` instead of `localhost`.

## Build and Test Commands

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

- Backend DB connection failure:
  - Verify `DB_URL`, `DB_USERNAME`, `DB_PASSWORD`.
  - Ensure PostgreSQL is running and reachable.
- Frontend cannot call backend:
  - Verify backend is active on port `8080`.
- Invalid npm command:
  - Use `npm run dev` (not `npm rundev`).

## Security Reminder

Do not commit real passwords, tokens, or production secrets to source control.

## Contributors

Developed for IT342 OrderFlow project.
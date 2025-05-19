# 🌦️ Weather Forecast Subscription API

A service that provides a RESTful API to subscribe users to regular weather forecast updates for selected cities.

## 📋 Table of Contents

- [Project Description](#-project-description-)
- [Tasks (Requirements)](#-tasks-requirements)
  - [Core Requirements](#-core-requirements)
  - [Extra Points (Optional)](#-extra-points-optional)
- [Features](#-features)
- [How it works](#-how-it-works)
- [API Documentation](#-api-documentation)
- [Database Migrations](#-database-migrations)
- [Setup](#-setup)
  - [Local Development](#local-development)
  - [Docker](#-docker)
- [Testing](#-testing)

---

## 📖 Project Description 

This service allows users to subscribe to weather forecast updates (either daily or hourly) for a specific city. Forecasts are delivered via email, and the service includes confirmation and unsubscription mechanisms. There is endpoint for current weather in city.

---

## 📌 Tasks (Requirements)

> 🔽 **Below are the core tasks for the implementation:**

### 📦 Core Requirements
1. ✅ **Implement a service with an API** to allow users to subscribe to regular weather forecast updates for a selected city. [click](#-how-it-works)
   - ✅ **The service must strictly follow the described API**, as outlined in the Swagger documentation. [click](#-api-documentation)
3. ✅ **All data must be stored in a database**.
    - ✅ Migrations should be automatically applied when the service starts. [click](#auto-migration)
4. ✅ **A Dockerfile and docker-compose file must be included** in the repository.
    - ✅ The system should be runnable in Docker. [click](#-docker)
5. ✅ **Contracts must not be changed.**
6. ✅ **Relevant frameworks are allowed.**
7. ✅ Include **tests** to cover business logic. [click](#-testing)
8. ✅ **Readme project description**.

---

### 🎁 Extra Points (Optional)

- ✅ Deploy the API to a public host. [click](http://35.156.105.229/)
- ✅ Create an **HTML page for subscriptions** (centered form with email input, type selection: DAILY / HOURLY, and submit button). [click](http://35.156.105.229/)

---

## ✨ Features

- Subscribe to daily or hourly weather updates via email
- Confirm subscriptions using email links
- Unsubscribe from updates
- Cached weather data for optimized performance
- Dockerized for easy deployment
- Current weather endpoint for cities

---

## 🛠 How It Works

This service allows users to subscribe to regular weather updates for a selected city. Here's an overview of how the system functions:

1. **User Subscription**
    - A user visits the frontend form and enters their email.
    - They choose the update frequency: `DAILY` or `HOURLY`.
    - A `POST /subscribe` API request is sent with the provided data.

2. **Email Confirmation**
    - The service generates a unique token and stores the subscription in the database with `isConfirmed = false`.
    - An email with a confirmation link (`/confirm/:token`) is sent to the user.

3. **Subscription Confirmation**
    - When the user clicks the link, a `GET /confirm/:token` request is triggered.
    - The service validates the token and marks the subscription as confirmed.

4. **Unsubscribe Option**
    - The user can unsubscribe using a unique tokenized link (`/unsubscribe/:token`), which removes their subscription.

5. **Weather Updates**
    - A background job (e.g. cron task) periodically (each hour and each day) fetches weather data from a third-party API.
    - It sends updates via email to all confirmed subscribers based on their selected frequency.
    - A cache logic is used here to avoid making unnecessary requests for the same data.

6. **Current Weather with Caching**
    - The service provides current weather data for cities.
    - To reduce API load and response time, the current weather is cached for a short duration (e.g. 10 minutes).
    - If a cached version is available, it's returned instead of making a new external API call.

7. **Data Persistence**
    - All subscription and weather data is stored in a relational database.
    - Database schema migrations are run automatically when the service starts (using Prisma).

8. **Deployment**
    - The app is containerized using Docker.
    - A `docker-compose.yml` file allows easy setup of the app and database locally or on a cloud provider.

---

📦 **Technology Stack**:
- **NestJS** – Backend framework
- **Prisma** – ORM for database access
- **PostgreSQL** – Database
- **Docker** – Containerization
- **Node.js** – Runtime environment

---


## 📑 API Documentation

The API follows the specification provided in the [Swagger file](https://github.com/mykhailo-hrynko/se-school-5/blob/c05946703852b277e9d6dcb63ffd06fd1e06da5f/swagger.yaml).  
To view the interactive documentation:

1. Open [https://editor.swagger.io](https://editor.swagger.io)
2. Upload or paste the content of `swagger.yaml`

**Note:** Contracts must not be modified.

---


## 🛠️ Database Migrations

**Note:** If you use `docker compose up` for starting app you can skip this chapter. 


If running manually:

```bash
npx prisma migrate deploy
```

Inside Docker (if needed):

```bash
docker exec -it <container_name> npx prisma migrate deploy
```

---

## ⚙ Setup

**Note:** Be sure to check [previous chapter](#-database-migrations).

### Local Development

```bash
npm install
npx prisma generate
npm run start:dev
```

Ensure you have a `.env` file with proper database and email configuration. 

You can create a `.env` file from [.ens.example](.env.example)

---

### 🐳 Docker

Run the system using Docker Compose:

```bash
docker-compose up
```

This will spin up the full application and its dependencies.

#### Auto-migration
Here is used [entrypoint script](./entrypoint.sh) for applying migrations to DB and run the app.

---

## ✅ Testing

To run tests:

```bash
npm run test
```

Include unit tests for key services:
- [WeatherNotificationService](./src/jobs/weather-notification.job.spec.ts)
- [MailServiceImpl](./src/modules/mail/mail.service.spec.ts)
- [SubscriptionsService](./src/modules/subscriptions/subscriptions.service.spec.ts)
- [WeatherService](./src/modules/weather/weather.service.spec.ts)
- [WeatherAPIImplService](./src/modules/weather/external-providers/weatherAPIImpl.service.spec.ts)

---

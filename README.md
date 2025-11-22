# AgroSoS Project

AgroSoS is a full-stack web application designed for agricultural monitoring. It allows users to manage and monitor data from various sensors. The project is divided into two main components: a Spring Boot backend for the API and a React frontend for the user interface.

## Table of Contents

- [Project Overview](#project-overview)
- [Technologies Used](#technologies-used)
- [Features](#features)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Project Structure](#project-structure)
  - [Backend Structure](#backend-structure)
  - [Frontend Structure](#frontend-structure)

## Project Overview

The AgroSoS application provides a platform for:
- User registration and management.
- Registration and management of agricultural sensors.
- Viewing and monitoring data collected by the sensors.

The backend is built with Java and Spring Boot, providing a RESTful API for all the application's functionalities. The frontend is a single-page application (SPA) built with React, which consumes the backend API to provide a dynamic and responsive user experience.

## Technologies Used

### Backend
- **Java 25**
- **Spring Boot 3.5.7**
- **Spring Data JPA**
- **MySQL**
- **Maven**

### Frontend
- **React 19.1.1**
- **Vite**
- **React Router**
- **CoreUI** & **Bootstrap** for styling and components.
- **Chart.js** for data visualization.
- **ESLint** for code linting.

## Features

- **User Management**: Create, view, and manage user accounts.
- **Sensor Management**: Add new sensors and manage existing ones.
- **Data Visualization**: View sensor data displayed in charts.
- **RESTful API**: A well-defined API for interacting with the application's data.

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

- **Java Development Kit (JDK)**: Version 21 or later.
- **Node.js**: Version 18 or later.
- **npm**: Version 9 or later (usually comes with Node.js).
- **MySQL**: A running instance of MySQL database.

### Backend Setup

1. **Clone the repository:**
   ```sh
   git clone https://github.com/IsaacRamosDaw/AgroSoS.git
   cd agroSoS
   ```

2. **Configure the database:**
   - Open the `agroSoSController/src/main/resources/application.properties` file.
   - Update the `spring.datasource.url`, `spring.datasource.username`, and `spring.datasource.password` properties to match your MySQL configuration.
   - Example:
     ```properties
     spring.datasource.url=jdbc:mysql://localhost:3306/your_database_name
     spring.datasource.username=your_username
     spring.datasource.password=your_password
     spring.jpa.hibernate.ddl-auto=update
     ```

3. **Build and run the backend:**
   - Navigate to the backend directory:
     ```sh
     cd agroSoSController
     ```
   - Run the application using Maven:
     ```sh
     ./mvnw spring-boot:run
     ```
   - The backend server will start on `http://localhost:8080`.

### Frontend Setup

1. **Navigate to the frontend directory:**
   ```sh
   cd agroSoSFrontend
   ```

2. **Install dependencies:**
   ```sh
   npm install
   ```

3. **Run the development server:**
   ```sh
   npm run dev
   ```
   - The frontend development server will start on `http://localhost:5173` (or another port if 5173 is in use).

4. **Access the application:**
   - Open your web browser and go to `http://localhost:5173`.

## Project Structure

### Backend Structure (`agroSoSController`)

The backend follows a standard Spring Boot project structure:

```
.
└── src
    └── main
        └── java
            └── com
                └── agroSoSProyect
                    ├── AgroSoSControllerApplication.java  # Main application entry point
                    ├── Controllers/      # REST API controllers
                    ├── Models/           # JPA entity classes
                    ├── Repository/       # Spring Data JPA repositories
                    └── Exception/        # Custom exception handlers
```

- **`Controllers`**: Handle incoming HTTP requests and define API endpoints.
- **`Models`**: Define the data model (entities) of the application.
- **`Repository`**: Interfaces for data access using Spring Data JPA.
- **`Exception`**: Custom exceptions and advice for handling errors.

### Frontend Structure (`agroSoSFrontend`)

The frontend is a standard Vite-powered React application:

```
.
└── src
    ├── App.jsx             # Main application component
    ├── main.jsx            # Application entry point
    ├── assets/             # Static assets (images, icons)
    ├── components/         # Reusable React components
    ├── views/              # Page-level components (routed)
    ├── services/           # Modules for making API calls
    ├── hook/               # Custom React hooks (e.g., for authentication)
    └── data/               # Mock data or data helpers
```

- **`components`**: Contains reusable UI components used throughout the application.
- **`views`**: Represents the different pages of the application (e.g., Home, Login, Admin).
- **`services`**: Manages API calls to the backend.
- **`hook`**: Contains custom hooks, for example `AuthContext` to manage authentication state.

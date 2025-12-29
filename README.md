# Library Management System

A full-stack library management application built with Spring Boot and React.

## 🚀 Tech Stack

### Backend
- **Framework**: Spring Boot 2.7.18
- **Language**: Java 11
- **Databases**:
    - **MongoDB**: Stores Book Catalog (Unstructured/Flexible schema for book metadata).
    - **PostgreSQL**: Stores User and Borrowing Transaction data (Relational/ACID compliance).
- **Testing**: JUnit 5, Mockito

### Frontend
- **Framework**: React + Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Framer Motion
- **State Management**:
    - **Redux Toolkit**: For UI state (Tabs, User Sessions).
    - **TanStack React Query**: For Server state (Caching, Synchronization).
    - **Axios**: HTTP Client.

## 🏗 Architectural Decisions

1.  **Hybrid Database Approach**:
    - We used **MongoDB** for Books because catalog data can often vary (different attributes for different genres) and read-heavy workloads benefit from document stores.
    - We used **PostgreSQL** for Borrowing Records because these are critical transactions requiring strict consistency and relational integrity between Users and Books.

2.  **Hexagonal/Clean Architecture (Backend)**:
    - Domain entities are isolated.
    - Service layer handles all business logic (rules validation).
    - Controllers are thin adapters for REST.

3.  **Modern React Patterns (Frontend)**:
    - **React Query** handles data fetching, caching, and invalidation, significantly reducing boilerplate compared to storing API data in Redux.
    - **Redux** is reserved for global UI preferences.
    - **Tailwind CSS** allows for rapid, consistent UI development.

## 🛠 How to Run

1.  **Start Databases**:
    ```bash
    docker-compose up -d
    ```

2.  **Run Backend**:
    ```bash
    cd library-backend
    mvn spring-boot:run
    ```

3.  **Run Frontend**:
    ```bash
    cd library-frontend
    npm install
    npm run dev
    ```

## ✅ Testing
- **Backend**: `mvn test` (Unit tests for Services and Controllers)
- **Frontend**: `npm run type-check` (TypeScript validation)

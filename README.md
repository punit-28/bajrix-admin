# BajriX Admin

A full-stack product catalogue management dashboard for BajriX, built with **React + Vite** on the frontend and **Spring Boot + JPA** on the backend.

The application provides an admin-friendly interface for managing products with **CRUD operations, search, filtering, sorting, pagination, validation, stock visibility, and catalogue statistics**.

## ✨ Features

- 📦 **Product Management** — Create, view, update, and delete products.
- 🔎 **Search** — Search products by name or brand with debounced input.
- 🏷️ **Filtering** — Filter products by category and active/inactive status.
- ↕️ **Sorting** — Sort by product name, price, stock, or creation date in ascending/descending order.
- 📄 **Pagination** — Server-side pagination for efficient catalogue browsing.
- 📊 **Dashboard Statistics** — View total products, active products, out-of-stock products, and category count.
- ✅ **Validation** — Client-side and server-side validation for product data.
- 🚫 **Duplicate Protection** — Prevents duplicate products with the same name and brand.
- ⚠️ **Error Handling** — Structured API errors for validation, not-found, conflict, and server failures.
- 🗃️ **H2 Database by Default** — Runs locally without requiring a PostgreSQL installation.
- 🐘 **PostgreSQL Ready** — Can be switched to PostgreSQL through the application configuration.
- 📱 **Responsive Admin UI** — Clean catalogue table with product actions and status indicators.

## 🛠️ Tech Stack

### Frontend
- React 18
- Vite 5
- JavaScript (ES Modules)
- Fetch API
- CSS

### Backend
- Java 17
- Spring Boot 3.3.4
- Spring Web
- Spring Data JPA / Hibernate
- Spring Validation
- Lombok
- Maven

### Database
- H2 Database (default, file-based)
- PostgreSQL (supported)

## 🏗️ Architecture

The project is organized as a separate frontend and backend application:

```
bajrix-admin/
├── frontend/                    # React + Vite application
│   ├── src/
│   │   ├── App.jsx             # Catalogue UI, filters, pagination & actions
│   │   ├── ProductForm.jsx      # Add/Edit product form
│   │   ├── api.js               # API communication layer
│   │   ├── main.jsx             # React entry point
│   │   └── styles.css           # Application styles
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── backend/                     # Spring Boot REST API
│   ├── src/main/java/com/bajrix/admin/
│   │   ├── AdminApplication.java
│   │   ├── product/
│   │   │   ├── Product.java
│   │   │   ├── ProductRequest.java
│   │   │   ├── ProductController.java
│   │   │   ├── ProductService.java
│   │   │   ├── ProductRepository.java
│   │   │   └── DataSeeder.java
│   │   └── common/
│   │       ├── ApiException.java
│   │       └── GlobalExceptionHandler.java
│   ├── src/main/resources/
│   │   └── application.properties
│   └── pom.xml
│
└── README.md
```

### Backend flow

```
React Frontend
      │
      ▼
REST API (/api/products)
      │
      ▼
ProductController
      │
      ▼
ProductService
      │
      ▼
ProductRepository
      │
      ▼
H2 / PostgreSQL
```

The backend follows a simple **Controller → Service → Repository** structure, keeping API handling, business rules, and data access separated.

## 🔌 REST API

Base URL:

```
http://localhost:8080/api/products
```

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/products` | List products with search, filter, sort & pagination |
| GET | `/api/products/{id}` | Get a single product |
| POST | `/api/products` | Create a new product |
| PUT | `/api/products/{id}` | Update an existing product |
| DELETE | `/api/products/{id}` | Delete a product |
| GET | `/api/products/stats` | Get catalogue statistics |
| GET | `/api/products/categories` | Get available categories |

### Product list query parameters

```text
q
category
status
page
size
sortBy
dir
```

Example:

```text
GET /api/products?q=cement&category=Construction&status=ACTIVE&page=0&size=8&sortBy=price&dir=asc
```

## ✅ Business Rules & Validation

The application enforces validation at both frontend and backend levels:

- Product name, category, brand, and unit are required.
- Price must be greater than `0`.
- Stock cannot be negative.
- Minimum order quantity must be at least `1`.
- A product with the same **name + brand** cannot be created twice.
- Missing product IDs return **404 Not Found**.
- Duplicate products return **409 Conflict**.
- Invalid request data returns **400 Bad Request** with field-level error details.

## 💾 Database

By default, the backend uses a **file-based H2 database in PostgreSQL compatibility mode**, so the application can run locally without installing PostgreSQL.

Configuration is located in:

```
backend/src/main/resources/application.properties
```

### Default H2 configuration

```properties
spring.datasource.url=jdbc:h2:file:./data/bajrix;MODE=PostgreSQL
spring.datasource.username=sa
spring.datasource.password=
spring.jpa.hibernate.ddl-auto=update
```

### PostgreSQL configuration

The project also includes PostgreSQL support. Replace the H2 datasource settings with your PostgreSQL connection details when needed.

## 🚀 Getting Started

### Prerequisites

Make sure you have installed:

- **Java 17+**
- **Maven**
- **Node.js 18+**
- npm

### 1. Clone the repository

```bash
git clone https://github.com/punit-28/bajrix-admin.git
cd bajrix-admin
```

### 2. Start the backend

```bash
cd backend
mvn spring-boot:run
```

The backend runs on:

```text
http://localhost:8080
```

A sample dataset is seeded automatically on first startup.

### 3. Start the frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at:

```text
http://localhost:5173
```

## 🧪 Production Build

Build the frontend:

```bash
cd frontend
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

Build the Spring Boot backend:

```bash
cd backend
mvn clean package
```

## 📁 Key Components

### Frontend

**App.jsx**
- Loads products, statistics, and categories.
- Handles search, filters, sorting, pagination, add/edit/delete actions.
- Displays loading and API error states.
- Provides status and stock indicators.

**ProductForm.jsx**
- Handles product creation and editing.
- Performs client-side validation.
- Displays field-level validation errors.
- Supports keyboard-friendly modal interactions.

**api.js**
- Centralizes REST API requests.
- Handles HTTP errors and structured backend validation responses.

### Backend

**ProductController**
- Exposes REST endpoints for catalogue operations.

**ProductService**
- Contains business logic.
- Handles filtering, sorting, pagination, duplicate checks, statistics, and CRUD operations.

**ProductRepository**
- Handles persistence using Spring Data JPA.

**Product**
- JPA entity representing a catalogue product.

**GlobalExceptionHandler**
- Converts validation and application exceptions into consistent API responses.

**DataSeeder**
- Provides initial sample products for local development.

## 🔄 Example Product Object

```json
{
  "name": "PPC Cement 50 kg",
  "category": "Cement",
  "brand": "Example Brand",
  "unit": "bag",
  "price": 420.00,
  "stock": 250,
  "minOrderQty": 1,
  "status": "ACTIVE"
}
```

## 🎯 Project Goals

BajriX Admin is designed to demonstrate a practical full-stack architecture where a modern React dashboard communicates with a Java Spring Boot REST API and a relational-style persistence layer.

The project focuses on:
- clean separation of frontend and backend responsibilities,
- reusable API communication,
- server-side catalogue operations,
- robust validation and error handling,
- and an admin experience that is simple to operate.

## 👨‍💻 Author

**Punit Mundotiya**

GitHub: https://github.com/punit-28

---

⭐ If you find the project useful, consider giving the repository a star.

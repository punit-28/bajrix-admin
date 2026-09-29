# BajriX Admin - Product CRUD

React (Vite) frontend + Spring Boot backend. Admin products ko **Create / Read / Update / Delete** kar sakta hai,
search, filter, sort aur pagination ke saath.

## Run kaise kare

**Backend** (Java 17+, Maven chahiye)
```bash
cd backend
mvn spring-boot:run        # http://localhost:8080
```
Default me H2 file database use hota hai (Postgres ki zaroorat nahi). 12 sample products pehli baar apne aap add ho jate hain.
PostgreSQL chahiye to `backend/src/main/resources/application.properties` me instructions hain.

**Frontend** (Node 18+)
```bash
cd frontend
npm install
npm run dev                # http://localhost:5173
```

## API
| Method | URL | Kaam |
|---|---|---|
| GET | `/api/products?q=&category=&status=&sortBy=&dir=&page=&size=` | list + search/filter/sort/pagination |
| GET | `/api/products/{id}` | ek product |
| POST | `/api/products` | naya product |
| PUT | `/api/products/{id}` | update |
| DELETE | `/api/products/{id}` | delete |
| GET | `/api/products/stats` | dashboard counts |
| GET | `/api/products/categories` | category list |

## Business rules
- Price > 0, stock >= 0, minimum order >= 1 (backend aur frontend dono validate karte hain)
- Same **name + brand** dobara add nahi ho sakta (409 Conflict)
- Invalid ID par 404, validation error par 400 with field-wise messages

## Structure
```
backend/.../product/   Controller -> Service -> Repository, Product entity, ProductRequest (validation)
backend/.../common/    global error handler, CORS
frontend/src/          App.jsx (list + filters), ProductForm.jsx (add/edit), api.js
```

# PracticeApi Endpoints

**Base URL:** `http://10.120.22.165:5178`

---

## Auth (`/api/auth`)

| Method | Endpoint | Body |
|--------|----------|------|
| POST | `/api/auth/login` | `{"username": "admin", "password": "admin123"}` |
| POST | `/api/auth/register` | `{"username": "newuser", "password": "pass123"}` |

**Test Users:** `admin/admin123`, `user/user123`, `demo/demo`

---

## Products (`/api/products`)

| Method | Endpoint | Body |
|--------|----------|------|
| GET | `/api/products` | - |
| GET | `/api/products/1` | - |
| GET | `/api/products/category/Electronics` | - |
| GET | `/api/products/search?name=lap` | - |
| POST | `/api/products` | `{"name": "Item", "price": 99.99, "category": "Electronics", "stock": 10}` |
| PUT | `/api/products/1` | `{"name": "Updated", "price": 199.99, "category": "Electronics", "stock": 20}` |
| PATCH | `/api/products/1/stock` | `50` |
| DELETE | `/api/products/1` | - |

---

## Utility (`/api/utility`)

| Method | Endpoint | Body |
|--------|----------|------|
| GET | `/api/utility/health` | - |
| GET | `/api/utility/time` | - |
| GET | `/api/utility/random?min=1&max=100` | - |
| POST | `/api/utility/echo` | `{"any": "data"}` |
| POST | `/api/utility/calculate` | `{"a": 10, "b": 5, "operation": "add"}` |

**Operations:** `add`, `subtract`, `multiply`, `divide`

# 🚗 CarVantage Rental System

**CarVantage** is a robust Backend API designed for a modern vehicle rental management system. Built with **Node.js**, **TypeScript**, and **PostgreSQL**, it provides a secure and automated environment for users to book vehicles and for admins to manage the fleet effectively.

**🌐 Live Link:** [https://b6a2-one.vercel.app](https://b6a2-one.vercel.app)

---

## 🛠️ Technology Stack

- **Backend:** Node.js + Express.js
- **Language:** TypeScript
- **Database:** PostgreSQL (Relational)
- **Security:** - `bcrypt`: Password hashing for secure storage.
  - `jsonwebtoken` (JWT): Role-based Authentication & Authorization.
- **Task Scheduling:** `node-cron` for automated system tasks.

---

## 🔐 Roles & Functionalities

### 🛠 Admin
- **User Management:** View all users, update roles, or delete accounts (if no active bookings).
- **Fleet Management:** Full CRUD operations on vehicles.
- **Booking Oversight:** View every booking in the system and mark vehicles as "Returned."

### 👤 Customer
- **Profile:** Manage and update personal profile details.
- **Rentals:** Browse, create, and view personal bookings.
- **Smart Cancellation:** Cancel a booking if the rental period hasn't started yet.

### 🌐 Public
- Access to browse the vehicle catalog and view detailed specifications.

### 🤖 System (Automated)
- **Auto-Return:** Automatically marks bookings as "Returned" and updates vehicle availability once the rental period expires.

---

## 📊 Database Schema

### 1. Users
| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | SERIAL | Primary Key |
| `name` | VARCHAR | User's full name |
| `email` | VARCHAR | Unique email (Unique constraint) |
| `role` | ENUM | `'admin'` or `'customer'` |

### 2. Vehicles
| Field | Type | Description |
| :--- | :--- | :--- |
| `vehicle_name` | VARCHAR | Name/Model of the vehicle |
| `type` | ENUM | `'car'`, `'bike'`, `'van'`, `'SUV'` |
| `status` | ENUM | `'available'`, `'booked'` |

### 3. Bookings
| Field | Type | Description |
| :--- | :--- | :--- |
| `total_price` | NUMERIC | Calculated based on rental duration |
| `status` | ENUM | `'active'`, `'cancelled'`, `'returned'` |

---

## 🌐 API Endpoints

### Authentication
| Method | Endpoint | Access |
| :--- | :--- | :--- |
| `POST` | `/api/v1/auth/signup` | Public |
| `POST` | `/api/v1/auth/signin` | Public |

### Vehicles
| Method | Endpoint | Access |
| :--- | :--- | :--- |
| `GET` | `/api/v1/vehicles` | Public |
| `GET` | `/api/v1/vehicles/:id` | Public |
| `POST` | `/api/v1/vehicles` | Admin |
| `PUT` | `/api/v1/vehicles/:id` | Admin |
| `DELETE` | `/api/v1/vehicles/:id` | Admin |

### Users & Bookings
| Method | Endpoint | Access |
| :--- | :--- | :--- |
| `GET` | `/api/v1/users` | Admin |
| `POST` | `/api/v1/bookings` | Admin/Customer |
| `GET` | `/api/v1/bookings` | Role-based |
| `PUT` | `/api/v1/bookings/:id` | Role-based |

---

## 🚀 Installation & Local Setup

1. **Clone the Repo:**
   ```bash
   git clone [https://github.com/IamFreak10/b6a2.git](https://github.com/IamFreak10/b6a2.git)
   cd b6a2

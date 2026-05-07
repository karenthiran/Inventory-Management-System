# 📦 Inventrax — Inventory Management System (IMS)

> A web-based Inventory Management System developed for the Faculty of Engineering, University of Jaffna. Built to replace manual inventory tracking with a structured, automated, and role-based solution.

**Live URL:** [https://inventory-management-system-sigma-seven.vercel.app/](https://inventory-management-system-sigma-seven.vercel.app/)  
**API Base URL:** [https://inventory-backend-5fd3.onrender.com/](https://inventory-backend-5fd3.onrender.com/)  
**GitHub Repository:** [https://github.com/karenthiran/Inventory-Management-System](https://github.com/karenthiran/Inventory-Management-System)

---

## 👥 Team

| Role                          | Member               | ID         |
| ----------------------------- | -------------------- | ---------- |
| Project Manager               | T. Shakiththiyan     | 2021/E/191 |
| Frontend Developer            | J. Shapthana         | 2022/E/062 |
| Backend Developer             | K. Karenthiran       | 2020/E/068 |
| QA & Design                   | K. Kiruthikan        | 2020/E/073 |
| Requirements Analyst & Design | A.R Nivethanan Croos | 2020/E/001 |

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [System Architecture](#system-architecture)
- [User Roles & Access Control](#user-roles--access-control)
- [Database Design](#database-design)
- [API Documentation](#api-documentation)
- [Installation & Deployment](#installation--deployment)
- [User Guide](#user-guide)
- [Testing](#testing)
- [Known Limitations & Future Enhancements](#known-limitations--future-enhancements)

---

## Overview

The IMS is designed to manage laboratory inventory in an academic environment. It replaces manual logbooks and spreadsheets with a centralized web platform, providing real-time tracking, role-based access, and automated reporting.

**Problem Statement:**

- No real-time inventory tracking
- Manual entry errors and poor record keeping
- No proper tracking of damaged or lost items
- Limited visibility for staff and management
- Difficulty generating reports for decision-making

---

## Features

- 🔐 **Secure Authentication** — BCrypt password hashing and OTP-based password reset
- 👤 **Role-Based Access Control (RBAC)** — Three roles: Admin, Staff, HOD
- 📦 **Inventory Management** — Full CRUD for inventory items with category, location, and type support
- 🔄 **Issue & Return Tracking** — Transactional issue/return flows with atomic DB operations and email notifications
- 🔧 **Maintenance Management** — Track items under maintenance with guard table to block re-issuing
- 📊 **Reporting** — Filterable reports by date, location, and category; exportable as PDF
- 📧 **Email Notifications** — Automated emails for registration, item issuance, returns, and OTP resets
- 🏷️ **Multi-Location Support** — Manage inventory across multiple laboratory locations

---

## Tech Stack

### Frontend

| Technology        | Purpose                       |
| ----------------- | ----------------------------- |
| React 19 + Vite 7 | UI framework                  |
| Tailwind CSS      | Styling and responsive layout |
| JavaScript        | Frontend logic                |

### Backend

| Technology                  | Purpose                         |
| --------------------------- | ------------------------------- |
| Java 21 (LTS)               | Backend language                |
| Spring Boot 4.0.3           | Application framework           |
| Spring Data JPA / Hibernate | ORM and persistence             |
| PostgreSQL 17.6             | Relational database             |
| HikariCP                    | Connection pooling              |
| BCryptPasswordEncoder       | Password hashing                |
| JavaMailSender + Gmail SMTP | Email notifications             |
| Maven                       | Build and dependency management |

### Infrastructure (AWS)

| Service          | Role                                         |
| ---------------- | -------------------------------------------- |
| EC2              | Hosts the Spring Boot JAR                    |
| RDS (ap-south-1) | Managed PostgreSQL database                  |
| S3               | Artifact storage for deployment and rollback |
| Nginx            | Reverse proxy for HTTP traffic               |

---

## System Architecture

The IMS follows a **three-tier architecture**:

```
User (Browser)
      ↓
Frontend — React 19 (Client Layer)
      ↓
Backend API — Spring Boot (Application Layer)
      ↓
Database — PostgreSQL on AWS RDS (Data Layer)
      ↑
Response returned to User
```

**Key architectural features:**

- Modular, layered design separating frontend, backend, and database
- Role-Based Access Control enforced at both frontend and backend
- Scalable — supports growth in users, items, and features
- Web-based — accessible from any modern browser without installation

---

## User Roles & Access Control

| Function              | Admin | Staff | HOD |
| --------------------- | :---: | :---: | :-: |
| Login / Logout        |  ✅   |  ✅   | ✅  |
| View Inventory        |  ✅   |  ✅   | ✅  |
| Search / Filter Items |  ✅   |  ✅   | ✅  |
| Add Inventory Item    |  ✅   |  ❌   | ❌  |
| Update Inventory Item |  ✅   |  ❌   | ❌  |
| Delete Inventory Item |  ✅   |  ❌   | ❌  |
| Issue Items           |  ✅   |  ❌   | ❌  |
| Return Items          |  ✅   |  ❌   | ❌  |
| Update Item Condition |  ✅   |  ❌   | ❌  |
| Manage Users          |  ✅   |  ❌   | ❌  |
| View Reports          |  ✅   |  ❌   | ✅  |
| Export Reports        |  ✅   |  ❌   | ✅  |

---

## Database Design

The database contains **10 tables** managed by Hibernate (`ddl-auto: update`) on AWS RDS PostgreSQL 17.6.

### Table Overview

| Table                      | Primary Key           | Purpose                                                       |
| -------------------------- | --------------------- | ------------------------------------------------------------- |
| `users`                    | email (VARCHAR)       | User accounts — stores roles, BCrypt passwords, auth metadata |
| `inventory_items`          | item_code (VARCHAR)   | Physical items with quantity, type, category, location FKs    |
| `issued_items`             | id (BIGINT auto)      | Permanent record of every issuing event — never deleted       |
| `returned_items`           | id (BIGINT auto)      | One-to-one record of every return — linked to issued_items    |
| `current_issued_inventory` | item_code (VARCHAR)   | Guard table — item_code present = currently out on loan       |
| `maintenance_requests`     | request_id (BIGINT)   | Maintenance job records with status tracking                  |
| `active_maintenance`       | item_code (VARCHAR)   | Guard table — item_code present = under maintenance           |
| `categories`               | category_id (VARCHAR) | Lookup table for item categories                              |
| `locations`                | location_id (VARCHAR) | Lookup table for storage/lab locations                        |
| `itemtype`                 | type_id (VARCHAR)     | Lookup table for item types (e.g. Laptop, Projector)          |

> **Note:** `current_issued_inventory` and `active_maintenance` are concurrency guard tables that prevent duplicate issuing and block maintenance items from being re-issued.

### Key Relationships

| Relationship                    | Description                                                |
| ------------------------------- | ---------------------------------------------------------- |
| `categories → inventory_items`  | @ManyToOne via category_id FK                              |
| `itemtype → inventory_items`    | @ManyToOne via type_id FK                                  |
| `locations → inventory_items`   | @ManyToOne via location_id FK                              |
| `issued_items → returned_items` | @OneToOne via issue_id FK (unique constraint)              |
| `users → issued_items`          | issued_by as plain string — intentional, preserves history |

---

## API Documentation

The REST API exposes **37+ endpoints** across 9 controller groups. All endpoints are prefixed with `/api/`.

### Authentication — `/api/users`

| Method | Path                            | Description                         |
| ------ | ------------------------------- | ----------------------------------- |
| POST   | `/api/users/login`              | Login with email + password         |
| POST   | `/api/users/register`           | Register new user (Admin only)      |
| GET    | `/api/users/all`                | List all users                      |
| GET    | `/api/users/profile/{username}` | Get user profile                    |
| DELETE | `/api/users/{username}`         | Delete user (self-deletion blocked) |
| POST   | `/api/users/forgot-password`    | Request OTP for password reset      |
| POST   | `/api/users/verify-otp-reset`   | Verify OTP and reset password       |
| POST   | `/api/users/change-password`    | Change password on first login      |

### Inventory — `/api/inventory`

| Method | Path                               | Description                                                  |
| ------ | ---------------------------------- | ------------------------------------------------------------ |
| GET    | `/api/inventory/all`               | List all items with computed live status                     |
| POST   | `/api/inventory/add`               | Add new inventory item                                       |
| PUT    | `/api/inventory/update/{itemCode}` | Update item details                                          |
| DELETE | `/api/inventory/delete/{itemCode}` | Remove item                                                  |
| GET    | `/api/inventory/status/all`        | Items with live status (Available / Issued / In Maintenance) |

### Issue — `/api/issues`

| Method | Path                                     | Description                                      |
| ------ | ---------------------------------------- | ------------------------------------------------ |
| POST   | `/api/issues/create`                     | Issue items (transactional + email notification) |
| GET    | `/api/issues/all`                        | List all issued records                          |
| GET    | `/api/issues/{id}`                       | Get issued record by ID                          |
| GET    | `/api/issues/unique-items`               | Distinct item names for dropdowns                |
| GET    | `/api/issues/available-codes/{itemName}` | Available item codes for issuing                 |
| PUT    | `/api/issues/{id}/update-date`           | Edit expected return date                        |

### Return — `/api/inventory/issue`

| Method | Path                           | Description                                 |
| ------ | ------------------------------ | ------------------------------------------- |
| POST   | `/api/inventory/issue/return`  | Process item return (transactional + email) |
| GET    | `/api/inventory/issue/returns` | Return history                              |

### Maintenance — `/api/maintenance`

| Method | Path                                  | Description                            |
| ------ | ------------------------------------- | -------------------------------------- |
| GET    | `/api/maintenance/all`                | List all maintenance requests          |
| GET    | `/api/maintenance/active-codes`       | Item codes currently under maintenance |
| POST   | `/api/maintenance/add`                | Log new maintenance request            |
| PUT    | `/api/maintenance/update-status/{id}` | Resolve or cancel a request            |
| PUT    | `/api/maintenance/edit/{id}`          | Edit maintenance record                |

### Lookup Tables

| Controller         | Endpoints                                  |
| ------------------ | ------------------------------------------ |
| CategoryController | `/api/categories` — GET, POST, PUT, DELETE |
| LocationController | `/api/locations` — GET, POST, PUT, DELETE  |
| ItemTypeController | `/api/itemtypes` — GET, POST, DELETE       |

### Email — `/api/email`

| Method | Path              | Description                                             |
| ------ | ----------------- | ------------------------------------------------------- |
| POST   | `/api/email/send` | Manual email with optional file attachment (up to 10MB) |

**Automated emails** (non-blocking, wrapped in try/catch):

| Type                | Trigger                            |
| ------------------- | ---------------------------------- |
| Welcome Email       | POST `/api/users/register`         |
| Issue Notification  | POST `/api/issues/create`          |
| Return Confirmation | POST `/api/inventory/issue/return` |
| OTP Reset           | POST `/api/users/forgot-password`  |

---

## Installation & Deployment

### Prerequisites

- Java 21
- Node.js + npm
- Maven
- PostgreSQL (or AWS RDS)
- AWS CLI (for cloud deployment)

### Local Backend Setup

```bash
# Clone the repository
git clone https://github.com/karenthiran/Inventory-Management-System.git
cd Inventory-Management-System

# Configure database in src/main/resources/application.properties
spring.datasource.url=jdbc:postgresql://<HOST>:5432/imsdb
spring.datasource.username=postgres
spring.datasource.password=<password>
spring.jpa.hibernate.ddl-auto=update

# Build and run
mvn clean package -DskipTests
java -jar target/ims-0.0.1-SNAPSHOT.jar
```

### Local Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

### AWS Deployment Flow

```bash
# 1. Build JAR locally
mvn clean package -DskipTests

# 2. Upload to S3
aws s3 cp target/ims-0.0.1-SNAPSHOT.jar s3://your-bucket/

# 3. SSH into EC2
ssh -i key.pem ec2-user@<EC2-IP>

# 4. Pull JAR from S3
aws s3 cp s3://your-bucket/ims-0.0.1-SNAPSHOT.jar .

# 5. Stop existing process
pkill -f 'java -jar'

# 6. Start application
nohup java -jar ims-0.0.1-SNAPSHOT.jar &

# 7. Verify
curl http://localhost:8080/api/inventory/all
```

### EC2 Security Group Ports

| Port     | Purpose                                                  |
| -------- | -------------------------------------------------------- |
| 22       | SSH access (restrict to your IP)                         |
| 8080     | Spring Boot application                                  |
| 80 / 443 | Nginx HTTP/HTTPS                                         |
| 5432     | PostgreSQL — allow EC2 security group only, never public |

### SMTP Configuration

```properties
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=<your-email>
spring.mail.password=<app-password>
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
spring.servlet.multipart.max-file-size=10MB
spring.servlet.multipart.max-request-size=10MB
```

---

## User Guide

### Logging In

1. Open [https://inventrax.sytes.net/](https://inventrax.sytes.net/) in a browser
2. Enter your registered email and password
3. Click **Sign In**
4. You will be redirected to a dashboard tailored to your role

### Admin — Managing Inventory

- Navigate to **Inventory Item** from the sidebar
- Use **+ Add Item** to create a new item (name, code, category, location, type, quantity)
- Use the edit icon to update item details
- Use the delete icon to remove an item

### Admin — Issuing Items

1. Go to **Issue** from the sidebar
2. Click **+ Issue a New Item**
3. Select item name → available codes → recipient user → location → due date
4. Click **Confirm Issue** — stock is decremented and an email is sent automatically

### Admin — Returning Items

1. Go to **Return** from the sidebar
2. Find the issued record and click the return icon
3. Enter return date, returned-by name, condition status, and any remarks
4. Click **Confirm Return** — stock is restored and a confirmation email is sent

### Viewing Reports

1. Go to **Report** from the sidebar
2. Select report type (Issued Records, Return Records, etc.)
3. Apply filters: location, date range
4. Click **Export Full PDF** to download

### Logging Out

Click the logout icon from the top navigation bar to end your session securely.

---

## Testing

All **25 manual test cases passed**. Coverage includes:

| Area                        | Test Cases      |
| --------------------------- | --------------- |
| Login (positive & negative) | TC_001 – TC_003 |
| Dashboard                   | TC_004          |
| Inventory CRUD              | TC_005 – TC_009 |
| Issue Management            | TC_010 – TC_012 |
| Return Management           | TC_013 – TC_015 |
| Email Functionality         | TC_016 – TC_018 |
| Reports                     | TC_019 – TC_021 |
| Navigation & Security       | TC_022 – TC_025 |

**Test environment:** Windows, Google Chrome, Selenium, Browser DevTools

---

## Known Limitations & Future Enhancements

### Current Limitations

- Role enforcement is primarily frontend-side — backend currently uses `permitAll()` for all endpoints
- Login returns the full user object including BCrypt hash (no JWT implemented yet)
- OTP generation uses `java.util.Random` — should be upgraded to `SecureRandom`
- CORS is open to all origins — too permissive for production
- DB credentials stored in `application.properties` — should use AWS Secrets Manager
- No rate limiting on the login endpoint
- Limited mobile responsiveness

### Planned Enhancements

- Implement JWT authentication and enforce server-side RBAC
- Advanced analytics and reporting dashboard
- Full audit logging for all user activities
- Bulk import/export of inventory records
- Mobile-responsive UI redesign
- Barcode/QR scanning support
- Asset depreciation tracking
- Integration with university ERP and procurement systems

---

## References

1. [React Documentation](https://react.dev)
2. [Spring Boot Documentation](https://spring.io/projects/spring-boot)
3. [Tailwind CSS Documentation](https://tailwindcss.com)
4. [PostgreSQL Documentation](https://www.postgresql.org/docs/)
5. [AWS Documentation](https://docs.aws.amazon.com)
6. [Selenium Testing Documentation](https://www.selenium.dev/documentation/)
7. [Java Documentation](https://docs.oracle.com/javase/)
8. [MDN Web Docs](https://developer.mozilla.org)

---

<p align="center">
  Made with ❤️ by the IMS Team — Faculty of Engineering, University of Jaffna
</p>

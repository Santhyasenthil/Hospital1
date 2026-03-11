# 🏥 MediCare+ Hospital Appointment & Doctor Scheduling System

A professional full-stack hospital management system built with **Spring Boot**, **React**, and **MySQL (XAMPP)**.

---

## 🗂️ Project Structure

```
hospital-system/
├── backend/          ← Spring Boot (Java 17)
├── frontend/         ← React + Vite
├── database/         ← SQL setup scripts
└── README.md
```

---

## 🚀 Local Setup (XAMPP)

### Prerequisites
- Java 17+
- Maven 3.6+
- Node.js 18+
- XAMPP (MySQL running on port 3306)

### Step 1: Database Setup
1. Open XAMPP Control Panel → Start **MySQL**
2. Open phpMyAdmin → `http://localhost/phpmyadmin`
3. Run the SQL in `database/setup.sql`
   OR simply start the backend — JPA will auto-create the `hospital_db` database and tables.

### Step 2: Backend Setup
```bash
cd backend
mvn clean install -DskipTests
mvn spring-boot:run
```
Backend starts at: `http://localhost:8080`

> **Default Credentials (auto-seeded on first run):**
> - Admin: `admin@hospital.com` / `Admin@123`
> - Sample Doctors (5 pre-loaded): password `Doctor@123`

### Step 3: Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Frontend starts at: `http://localhost:5173`

---

## 🌐 Deployment

### Backend → Render

1. Push `backend/` folder to a GitHub repo
2. Go to [render.com](https://render.com) → New Web Service
3. Connect your repo, set:
   - **Build Command:** `mvn clean install -DskipTests`
   - **Start Command:** `java -Dspring.profiles.active=prod -jar target/hospital-system-0.0.1-SNAPSHOT.jar`
4. Add Environment Variables on Render:
   ```
   DATABASE_URL=jdbc:mysql://<your-mysql-host>:3306/hospital_db?useSSL=true&serverTimezone=UTC
   DATABASE_USERNAME=<db_user>
   DATABASE_PASSWORD=<db_password>
   JWT_SECRET=YourSuperSecretJWTKeyForProductionUse2024MustBe256Bits
   CORS_ORIGINS=https://your-vercel-app.vercel.app
   ```
5. For MySQL on production, use [PlanetScale](https://planetscale.com) or [Railway](https://railway.app) (free MySQL hosting)

### Frontend → Vercel

1. Push `frontend/` folder to GitHub
2. Go to [vercel.com](https://vercel.com) → New Project → Import repo
3. Add Environment Variable:
   ```
   VITE_API_URL=https://your-render-app.onrender.com
   ```
4. Deploy!

---

## 👥 User Roles

| Role | Capabilities |
|------|-------------|
| **PATIENT** | Search doctors, book appointments, view/cancel own appointments |
| **DOCTOR** | Add/manage availability slots, confirm/complete appointments |
| **ADMIN** | View all users, all appointments, cancel any appointment, dashboard stats |

---

## 📋 Business Rules

- ✅ Cannot book overlapping time slots
- ✅ Doctor must be available (slot must exist)
- ✅ Patient cannot book multiple appointments at same time
- ✅ Only DOCTOR can confirm appointment
- ✅ Only ADMIN can cancel after confirmation
- ✅ Appointment flow: `BOOKED → CONFIRMED → COMPLETED → CANCELLED`

---

## 🔌 API Endpoints

### Auth
| Method | Endpoint | Access |
|--------|----------|--------|
| POST | `/api/auth/register` | Public |
| POST | `/api/auth/login` | Public |
| GET | `/api/auth/health` | Public |

### Doctors / Slots
| Method | Endpoint | Access |
|--------|----------|--------|
| GET | `/api/doctors` | Public |
| GET | `/api/doctors/{id}` | Public |
| GET | `/api/specializations` | Public |
| GET | `/api/slots/{doctorId}/available` | Public |
| POST | `/api/doctor/slots` | Doctor |
| GET | `/api/doctor/slots` | Doctor |
| DELETE | `/api/doctor/slots/{id}` | Doctor |

### Appointments
| Method | Endpoint | Access |
|--------|----------|--------|
| POST | `/api/appointments/book` | Patient |
| GET | `/api/appointments/my` | Auth |
| PATCH | `/api/appointments/{id}/confirm` | Doctor |
| PATCH | `/api/appointments/{id}/complete` | Doctor |
| PATCH | `/api/appointments/{id}/cancel` | Auth |
| GET | `/api/appointments/all` | Admin |
| GET | `/api/appointments/dashboard` | Admin |

### Admin
| Method | Endpoint | Access |
|--------|----------|--------|
| GET | `/api/admin/patients` | Admin |
| GET | `/api/admin/doctors` | Admin |

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Spring Boot 3.2, Spring Security, Spring Data JPA |
| Frontend | React 18, React Router v6, Axios |
| Database | MySQL (XAMPP locally) |
| Auth | JWT (jjwt 0.11.5) |
| Styling | Custom CSS with CSS Variables |
| Build | Maven (backend), Vite (frontend) |
| Deploy | Render (backend), Vercel (frontend) |

---

## 🎨 Design

- **Aesthetic:** Professional medical/healthcare — Navy + Teal + Cream palette
- **Fonts:** Playfair Display (headings) + DM Sans (body)
- **Role-based sidebar navigation**
- **Responsive design** (mobile-friendly)
- **Toast notifications** for all actions

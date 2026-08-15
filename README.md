# CODEPILOT
### Adaptive Technical Skill Assessment & Interview Readiness Platform

CODEPILOT is a production-grade technical interview preparation platform. Built with **Spring Boot 3.x** and **React.js (Vite)**, the platform uses an **Adaptive Quiz Engine** and a **Multi-Round Mock Interview State Machine** to evaluate candidate readiness, analyze mistakes, and align candidate skill levels against targets for industry-standard job roles (Java Developer, Backend Developer, Full Stack, and Software Developer).

---

## 🛠️ Tech Stack & Specifications

### Backend (Spring Boot 3.3.2 + Java 21)
- **Framework**: Spring Boot Web, Spring Data JPA, Spring Security (Stateless JWT token validation)
- **Database**: MySQL 8.x
- **Build Tool**: Apache Maven (v3.9.6)
- **Dependencies**: Lombok 1.18.40 (JDK 25 compatible), JJWT 0.12.5 (JSON Web Tokens), Validation API

### Frontend (React.js + JavaScript + CSS3 Modules)
- **Build Engine**: Vite + React
- **Router**: React Router DOM (v6.x)
- **Charts**: Recharts (for radar skill profiling & wrong answers statistics)
- **Icons**: Lucide React
- **API Client**: Axios

---

## 🏗️ System Architecture & Mechanics

### 1. Adaptive Question Selection Algorithm
Our `AdaptiveEngineService` computes candidate category proficiency to generate targeted quiz sheets:
- **Weighted Roulette Wheel Selection**: 
  - Topics with accuracy $< 50\%$ (or unattempted) are tagged **High Priority** (60% selection chance).
  - Topics with accuracy between $50\%$ and $70\%$ are tagged **Medium Priority** (30% selection chance).
  - Topics with accuracy $> 70\%$ are tagged **Low Priority** (10% selection chance).
- **Difficulty Shift Gates**:
  - **Escalation**: If a candidate answers the last 3 consecutive questions correctly for a topic, difficulty increases (`EASY` $\to$ `MEDIUM` $\to$ `HARD`).
  - **De-escalation**: If a candidate answers the last 2 consecutive questions incorrectly for a topic, difficulty decreases (`HARD` $\to$ `MEDIUM` $\to$ `EASY`).
- **Repetition Safeguard**: Excludes the last 20 questions answered by the candidate.

### 2. Multi-Round Mock Interview
The mock interview evaluates candidate knowledge across four distinct stages of 5 questions each:
1. **Round 1**: Java Core & Object-Oriented Principles
2. **Round 2**: SQL & Database Transactions
3. **Round 3**: Data Structures & Algorithms (DSA)
4. **Round 4**: Mixed General Technical & System Design Questions

### 3. Aggregate Readiness Score
Calculates overall interview readiness using:
$$\text{Readiness} = (\text{Java} \times 0.25) + (\text{SQL} \times 0.20) + (\text{DSA} \times 0.30) + (\text{Mock} \times 0.20) + (\text{Consistency} \times 0.05)$$
- **Consistency**: Computed based on calendar active days within the last 14 days ($7 \text{ days active} = 100\%$).

---

## 🗄️ Database Design (Normalized 3NF Schema)
Comprises 15 entities executing relational mapping:
- `roles` / `users` / `user_roles` (Many-to-Many RBAC)
- `topics` / `questions` (One-to-Many question banks)
- `quiz_attempts` / `quiz_answers` / `wrong_answers` (Mistake and historical logging)
- `user_profiles` / `user_skills` / `user_topic_progress` (Real-time dashboard metrics)
- `mock_interviews` / `mock_interview_answers` (State machine cache)
- `job_roles` / `job_role_skills` (Role comparisons)
- `recommendations` (Action items)

---

## 🚀 Setup & Launch Instructions

Before launching, make sure **MySQL** is running locally.

### Step 1: Database Setup
1. Create a database in MySQL named `codepilot`:
   ```sql
   CREATE DATABASE codepilot;
   ```
2. Database tables will automatically populate on backend boot via Hibernate DDL.
3. Over 150 technical seed questions will auto-run from `backend/src/main/resources/data.sql`.

### Step 2: Launch Backend Server
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Build and run using the portable Maven command:
   ```bash
   C:\Users\admin\maven\apache-maven-3.9.6\bin\mvn.cmd clean spring-boot:run
   ```
   *The server launches at `http://localhost:8080`.*

### Step 3: Launch React Frontend
1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
   *The app opens at `http://localhost:5173`.*

---

## 🧪 Running Automated Tests
To run unit tests validating JWT filters, difficulty shifts, and score calculations:
```bash
cd backend
C:\Users\admin\maven\apache-maven-3.9.6\bin\mvn.cmd clean test
```

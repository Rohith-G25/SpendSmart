# SpendSmart ✨

SpendSmart is a modern, fun, bold, and Gen-Z coded full-stack expense tracker application. It is built to help you track your coins without being broke! 💸

## 🎯 Features

- **Auth Page**: Seamless switch between Sign In and Sign Up. Feeds you playful error and success feedback messages.
- **Dashboard**: 
  - Summary cards for **Total Balance**, **Monthly Income**, and **Monthly Expenses**.
  - Interactive **Donut Chart** showing category-wise monthly expenses.
  - Interactive **Area Chart** displaying your 7-day spending trend.
  - **Recent Transactions** preview card.
  - **Overspending Banner Alert**: *"bro your wallet said 'not today' 💀"* if your balance goes negative or monthly expenses exceed income.
- **Transactions Page**:
  - Full searchable, filterable list of all income and expense flows.
  - Advanced filters: Date ranges, Categories, and Transaction Types.
  - Edit and Delete options per transaction.
- **Settings Page**:
  - **Currency Selector**: Dynamically change currency codes (₹, $, €, £, ¥, etc.) and see the updates reflect across the entire app instantly.
  - **Category Control Room**: View custom categories, delete unused ones, and add new ones with a custom emoji list and custom color palette.
  - **Profile Settings**: Update account name, email, and password.

---

## 🖥️ Tech Stack

- **Frontend**: React, Tailwind CSS (v4 compatible), Recharts (data visualizations), Framer Motion (micro-animations), Lucide React (icons), React Router DOM, Axios.
- **Backend**: Node.js + Express.js REST API, express-validator.
- **Database**: MongoDB (via Mongoose ODM, connection string `mongodb://localhost:27017/spendsmart`).
- **Auth**: JWT-based authentication with bcrypt password hashing.

---

## 🛠️ Setup Instructions

### Prerequisites
Make sure you have:
1. [Node.js](https://nodejs.org/) installed (v18+ recommended).
2. [MongoDB Compass](https://www.mongodb.com/products/tools/compass) or local MongoDB Community Server running.

### 1. Database Setup
- Open MongoDB Compass and connect to the local server using the default URI: `mongodb://localhost:27017`.
- Create a database called `spendsmart` (this will automatically be initialized by Mongoose when the server starts).

### 2. Run Backend API Server
1. Navigate to the backend folder:
   ```bash
   cd backend
   ```
2. The dependencies are already initialized. If needed, run:
   ```bash
   npm install
   ```
3. Start the development server (runs on `http://localhost:5000`):
   ```bash
   npm run dev
   ```

### 3. Run Frontend Client
1. Open a new terminal and navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. The dependencies are already initialized. If needed, run:
   ```bash
   npm install
   ```
3. Start the Vite React client (runs on `http://localhost:5173`):
   ```bash
   npm run dev
   ```
4. Open [http://localhost:5173](http://localhost:5173) in your browser!

---

## 🔒 Environment Configuration (`backend/.env`)

The backend requires a `.env` configuration file (which is already created for you in `backend/.env`) with the following fields:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/spendsmart
JWT_SECRET=super_secret_genz_key_1337
```

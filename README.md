
# 🛍️ Ecommerce API

**Ecommerce API** is a secure, scalable, and modular back-end service for e-commerce applications, built with **Express.js** and **MySQL**. It provides robust functionality for managing users, products, orders, and payments, along with powerful authentication and role-based access controls.

With **JWT-based authentication**, **Stripe payment integration**, and raw SQL queries for optimized database performance, this API is ideal for powering real-world e-commerce platforms.

---

## 🚀 Key Features

- 🔐 **Authentication & Authorization** – JWT-based authentication with Role-Based Access Control (RBAC) for `admin`, `seller`, and `user` roles.
- 🛒 **Product Management** – Full CRUD operations for products, categories, and inventory tracking.
- 📦 **Order Management** – Place, update, and track orders with automatic processing through Stripe webhooks.
- 💳 **Payment Processing** – Seamless integration with **Stripe** for secure checkout and real-time payment events.
- 🧾 **Raw SQL Optimization** – Improved performance with custom SQL queries and well-managed relational schemas.
- 🧑‍🤝‍🧑 **User Roles & Permissions** – Admins manage everything, sellers handle their listings, and users can shop and checkout.
- 🔄 **Webhooks Support** – Automatically process orders after successful payments via Stripe webhooks.

---

## 🛠️ Technologies Used

- **Node.js**
- **Express.js**
- **MySQL**
- **Sequelize (ORM)**
- **JWT (JSON Web Tokens)**
- **Stripe API**
- **WebSockets (planned/optional)**
- **Postman (for API testing)**

---

## ⚙️ Getting Started

### 📌 Prerequisites

Make sure you have the following installed:

- Node.js v18+
- MySQL
- Postman (optional, for testing)
- A Stripe account (for payment functionality)

---

### 🧑‍💻 Installation

```bash
git clone https://github.com/mohamed-abobakr73/Ecommerce-API.git
cd Ecommerce-API
npm install
```

---

### ⚙️ Environment Configuration

Create a `.env` file in the root directory and add your variables:

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=ecommerce_db

JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
```

---

### ▶️ Running the Server

```bash
npm run dev
```

The server will start on `http://localhost:5000`.

---

## 🤝 Contributing

Contributions are welcome! Feel free to fork the repo and submit a pull request. Bug fixes, new features, and improvements are always appreciated.

---

## 📃 License

This project is open-source and available under the [MIT License](LICENSE).

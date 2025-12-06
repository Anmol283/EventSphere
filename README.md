<h1 align="center">📅🎯 EventSphere</h1>
</br>
<div align="center"> 
  <img src="https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExd2tvcml6bml2MHVqajJvd2FkbGN4dzZhaWt4dDBobzBiMWtqZDBibSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/J6Ukx0azkxCBGUn846/giphy.gif" alt="Event GIF" width="300" height="300">
</div>
</br>
<div align="center"> <i> Connect, Discover, and Celebrate Events Effortlessly.</i> </div>

---

## ✨ Overview

EventSphere is a full-stack web application designed to simplify event discovery, registration, and management. Built with Node.js, Express, EJS, and MongoDB Atlas, it offers an intuitive platform where users can explore events, register online, and receive real-time updates.

The system features secure JWT and session-based authentication, Redis-backed caching, and WebSocket-powered live notifications for a seamless interactive experience.

Organizers can efficiently create, update, and manage events, while HTTPS support via SSL certificates ensures safe and encrypted communication throughout the platform.

---

## 🌟 Features

- **👤 User Authentication**
  - Sign up and login functionality
  - Role-based access (USER and ORGANIZER)
  - Session-based authentication with Redis caching
  - JWT-based authentication for API and mobile clients
  - Secure password hashing using bcrypt

- **🎟️ Event Management**
  - Organizers can create, edit, or delete events
  - Users can browse upcoming events and view details

- **📅 Event Registration**
  - Users can register for events online
  - Receive confirmation emails and QR code tickets

- **🔔 Notifications**
  - WebSocket-based live updates
  - Real-time notifications for event updates
  - Email reminders for registered events

- **💾 Storage & Caching**
  - MongoDB for database storage
  - Local storage for client-side persistence
  - Redis for caching sessions and reducing server load
    
- **🔒 HTTPS / SSL**
  - Supports SSL certificates for secure HTTPS communication
  - Built for production deployment on platforms like Render, Railway, AWS, etc.

---

## 🛠️ Tech Stack

| Category          | Technologies                                                                                                                                                                                                                       |
| ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Backend**       | <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white" /> <img src="https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white" /> <img src="https://img.shields.io/badge/WebSockets-000000?style=for-the-badge&logo=socketdotio&logoColor=white" /> <img src="https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white" /> |
| **Frontend**      | <img src="https://img.shields.io/badge/EJS-2C3E50?style=for-the-badge&logo=ejs&logoColor=white" /> <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" /> <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" />|
| **Database**      |<img src="https://img.shields.io/badge/MongoDB_Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white" />                                                                                                                       |
| **Testing**       | <img src="https://img.shields.io/badge/Jest-C21325?style=for-the-badge&logo=jest&logoColor=white" />                                                                                                                            |
| **Storage & Cache** | <img src="https://img.shields.io/badge/LocalStorage-FF6F00?style=for-the-badge&logo=javascript&logoColor=white" /> <img src="https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white" />        |
| **Security** | <img src="https://img.shields.io/badge/SSL-FFFFFF?style=for-the-badge&logo=letsencrypt&logoColor=black" /> <img src="https://img.shields.io/badge/bcrypt-3388FF?style=for-the-badge&logo=security&logoColor=white" />  |
| **Deployment** | <a href="https://your-beanstalk-url.com"><img src="https://img.shields.io/badge/AWS_Elastic_Beanstalk-FF9900?style=for-the-badge&logo=amazonaws&logoColor=white" /></a> <a href="https://your-render-url.com"><img src="https://img.shields.io/badge/Render-46E3B7?style=for-the-badge&logo=render&logoColor=white" /></a>  |
---

## 📁 Directory Structure
```
EventSphere/
├── backend/
│ ├── controllers/
│ │ ├── authController.js
│ │ ├── eventController.js
│ │ └── registrationController.js
│ ├── models/
│ │ ├── User.js
│ │ ├── Event.js
│ │ └── Registration.js
│ ├── routes/
│ │ ├── authRoutes.js
│ │ ├── eventRoutes.js
│ │ └── registrationRoutes.js
│ ├── middleware/
│ │ └── authMiddleware.js
│ └── server.js
├── frontend/
│ ├── public/
│ ├── views/
│ │ ├── partials/
│ │ ├── index.ejs
│ │ ├── login.ejs
│ │ ├── register.ejs
│ │ └── events.ejs
├── .gitignore
├── package.json
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js & npm
- MongoDB
- Redis (for session caching)

### Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/Anmol_283/EventSphere
   cd EventSphere
2. **Install Dependencies:**:
   ```bash
   npm install
   ```
3. **Configure Environment Variables:**:
   ```
    PORT=3000

    # MongoDB (Atlas)
    MONGODB_URI=your-mongodb-atlas-uri
    DB_NAME=eventsphere
    EVENTS_COLLECTION=events
    CONTACTS_COLLECTION=contacts
    USERS_COLLECTION=users
    
    # Redis (Cloud)
    REDIS_HOST=your-redis-host
    REDIS_PORT=your-redis-port
    REDIS_PASSWORD=your-redis-password
    
    # Security
    SESSION_SECRET=your-session-secret
    JWT_SECRET=your-jwt-secret
    JWT_EXPIRES=1h

   ```
4. **Run the Application:**:
   ```
    npm start
   ```
   
---

## 🔒 Security And Session Features

- Session-based authentication with Redis caching
- Role-based access `(USER and ORGANIZER)`
- Password hashing with bcrypt
- Protected API routes

- Optional JWT authentication for API clients: obtain a Bearer token from `/api/auth/login` (returns `token`) and send it in the `Authorization: Bearer <token>` header to access protected API/admin endpoints.

---

## 🤝 Contributing

1. Fork the repository
2. Create a new branch (`git checkout -b feature-branch`)
3. Make your changes and commit (`git commit -m "Add feature"`)
4. Push to the branch (`git push origin feature-branch`)
5. Create a Pull Request

---

## 📜 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

⭐ **Star this repository if you find it useful!** ⭐

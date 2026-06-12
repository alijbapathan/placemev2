# 🚀 Placeme - Placement & Career Management Platform

## 📌 Overview

Placeme is a centralized Placement & Career Management Platform designed to simplify the campus recruitment process for students, recruiters, and placement officers.

The platform enables students to apply for placement drives, manage profiles and resumes, track applications, and access career development resources, while recruiters and placement officers can efficiently manage recruitment activities.

---

## ✨ Features

### 👨‍🎓 Student

* User Registration & Login
* Profile Management
* Resume Upload
* Project Showcase
* Placement Drive Applications
* Application Tracking
* Notifications
* Training Programs

### 🏢 Recruiter

* Company Management
* Placement Drive Creation
* Applicant Management
* Recruitment Workflow Tracking

### 👨‍💼 Placement Officer

* Student Management
* Drive Management
* Placement Monitoring
* Notifications & Announcements

---

## 🛠 Tech Stack

### Frontend

* React.js
* Vite
* Tailwind CSS
* Zustand
* Axios

### Backend

* Django
* Django REST Framework
* JWT Authentication

### Database

* SQLite

### Version Control

* Git
* GitHub

---

## 📂 Project Structure

```text
placeme/
│
├── placeme-frontend/                # React Frontend
│   ├── public/                      # Static assets
│   ├── src/
│   │   ├── components/              # Reusable UI components
│   │   ├── pages/                   # Application pages
│   │   ├── layouts/                 # Layout components
│   │   ├── services/                # API integration
│   │   ├── context/                 # Authentication & state management
│   │   ├── hooks/                   # Custom React hooks
│   │   └── App.jsx                  # Main application entry
│   ├── package.json
│   └── vite.config.js
│
├── placeme/                         # Django Backend
│   ├── users/                       # Authentication & user management
│   ├── placement/                   # Companies, drives & applications
│   ├── career/                      # Student profiles & projects
│   ├── training/                    # Courses & training modules
│   ├── notifications/               # Notification management
│   ├── placeme/                     # Django project settings
│   ├── media/                       # Uploaded resumes & profile images
│   ├── manage.py
│   └── requirements.txt
│
├── README.md
└── .gitignore
```

```

---

## ⚙️ Installation

### Clone Repository

```bash
git clone <repository-url>
cd placeme
```

### Backend Setup

```bash
python -m venv .venv
.venv\Scripts\activate

pip install -r requirements.txt

python manage.py migrate
python manage.py runserver
```

### Frontend Setup

```bash
cd placeme-frontend

npm install

npm run dev
```

---

## 🔐 Authentication

Placeme uses JWT (JSON Web Token) Authentication for secure login and role-based access control.

---

## 🚀 Future Scope

* ATS Resume Analyzer
* Resume vs Job Description Matching
* AI Job Recommendations
* Skill Gap Analysis
* Career Assistant Chatbot
* LinkedIn & GitHub Integration

---

## 👥 Team

Developed as a collaborative project for placement and career management.

---

## 📄 License

This project is developed for educational and academic purposes.

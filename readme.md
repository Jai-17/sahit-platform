# 🌸 Sahit — Empowering Women Through Technology

**Sahit** is a real-world women empowerment platform developed and maintained under **InMobi**. It connects women in need with verified NGOs offering legal, medical, emotional, and employment assistance. Sahit is designed with safety, clarity, and trust at its core, featuring dedicated dashboards for women, NGOs, and super administrators.

> 🏢 This platform is an official InMobi initiative aimed at driving social impact through technology.


## 🌐 Live Demo


---

## 🚀 Features

### 👩 Women Dashboard
- Submit detailed help requests (multi-step form)
- View request status and history
- Accept or decline NGO offers
- Chat securely with NGO volunteers
- Track progress of ongoing help

### 🏢 NGO Dashboard
- View incoming help requests relevant to their domain/location
- Accept, view, and manage assigned requests
- Contact women via preferred modes (WhatsApp, Call, In-app)
- Status tracking and performance analytics

### 🛡️ Super Admin Panel
- Monitor all activity across the platform
- Approve, deactivate, or verify NGOs
- View analytics on requests, response rates, and impact

---

## 🧠 Architecture Overview

- **Event-driven queue** system for request matching
- Role-based access (JWT Auth: Woman, NGO, Admin)
- Real-time chat & notifications system
- Built for scalability, safety, and empathy

---

## 🛠 Tech Stack

### Frontend
- **Next.js** (App Router)
- **Tailwind CSS** for UI
- **Redux Toolkit** + **RTK Query** for state management and API integration

### Backend
- **Node.js + Express**
- **PostgreSQL** with **Prisma ORM**
- **Redis** with **BullMQ** for asynchronous request-matching queue
- **Zod** / **Joi** for request validation

### Infra & Dev Tools
- **Socket.io** (for chat)
- **Cloudinary / S3** (media upload)
- **Docker** (for local setup)
- **Vercel + Railway / Render** for deployment

---

## 🧩 Matching Logic (Behind the Scenes)

1. Woman submits a help request.
2. The request is added to a **Redis queue**.
3. A background **Node worker** fetches matching NGOs based on category, location, and availability.
4. NGOs receive notifications and can respond.
5. Woman chooses which NGO to accept help from.

---

## 📸 Screenshots

> - Woman Dashboard  
> - NGO Dashboard  
> - Admin Panel  
> - Chat / Request View

---

## 📦 Getting Started

### Clone the repo
```bash
git clone https://github.com/yourusername/sahit-platform.git
cd sahit-platform
```

> **Ownership**: This platform is developed, managed, and maintained by **InMobi** as part of its ongoing commitment to social impact and responsible innovation.

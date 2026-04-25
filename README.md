# LiveKeralam: God's Own Heritage & Events Discovery 🌴

![LiveKeralam Banner](https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&q=80&w=1200)

LiveKeralam is a high-fidelity heritage platform dedicated to preserving and promoting the cultural essence of Kerala. It connects travelers and locals with authentic temple festivals, sacred rituals, and hidden architectural landmarks through a modern, intelligence-driven interface.

## ✨ Signature Features

- **🧠 Heritage Matchmaker**: A proprietary AI-driven engine that matches your cultural personality with upcoming festivals and rituals.
- **🏮 Authentic Event Discovery**: Real-time schedule of verified traditions (Theyyam, Kathakali, Pooram) with interactive maps.
- **🗺️ Sacred Landmark Explorer**: A curated collection of historical sites, rock-cut temples, and colonial heritage spots across all 14 districts.
- **💬 Community Pulse**: Real-time event-specific chat rooms allowing travelers to share live updates and shared experiences.
- **🛡️ Moderated Ecosystem**: A dedicated Admin Command Center for verifying cultural facts, managing event status, and community moderation.
- **📱 Magazine-Quality UI**: Premium aesthetics using a "Heritage Emerald & Gold" color palette, parallax effects, and typography optimized for storytelling.

## 🛠️ Technology Stack

- **Frontend**: [React.js](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Backend**: [Node.js](https://nodejs.org/) + [Express](https://expressjs.com/)
- **Database**: [MongoDB Atlas](https://www.mongodb.com/) (NoSQL)
- **Real-time**: [Socket.io](https://socket.io/) for community chat and live alerts.
- **Security**: Express 5 ready with custom NoSQL & XSS sanitization middlewares.
- **SEO**: Dynamic Meta tags and JSON-LD structured data for high visibility in heritage-related searches.

## 🏗️ Project Architecture

```
Livekeralam/
├── backend/          # Node/Express API with manual security sanitizers
│   ├── src/          # Controllers, Models, Routes, Middlewares
│   └── tests/        # Jest/Supertest suite for API reliability
└── frontend/         # React application with custom Design System
    ├── src/          # Context API, Custom Hooks, Components, Pages
    └── public/       # Optimized assets & SEO manifest
```

## 📥 Installation

1. **Clone the Project**:
   ```bash
   git clone https://github.com/your-username/livekeralam.git
   ```

2. **Backend Setup**:
   ```bash
   cd backend
   npm install
   # Configure .env (MONGO_URI, JWT_SECRET, RAZORPAY_KEY)
   npm start
   ```

3. **Frontend Setup**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

## 🔒 Production Hardening

LiveKeralam is built with a "Production-First" mindset:
- **Rate Limiting**: Protects sensitive Auth and Public routes.
- **Error Handling**: Standardized response objects and centralized error boundaries.
- **Image Performance**: Cloudinary auto-optimization (`f_auto`, `q_auto`) and lazy-loading across all cards.
- **Typography Scale**: Consolidated font sizes for maximum accessibility and visual premium.

---

LiveKeralam — *The Soul of God's Own Country, Digitized.* 🛶

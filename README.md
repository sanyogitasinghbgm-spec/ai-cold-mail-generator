# ColdMail.ai — AI-Powered Cold Outreach Campaign Generator

ColdMail.ai is a full-stack monorepo application designed to generate highly personalized, high-converting cold outreach campaigns in seconds. From a single natural-language prompt, the platform leverages the high-speed **Groq LPU Inference Engine** running **Llama-3.3-70b-versatile** to craft a comprehensive outreach sequence consisting of a **Cold Email (Subject + Body)**, a **LinkedIn Connection DM**, and a polite **Follow-Up Email**.

The application is built as a modular monorepo, running both the backend server and frontend client concurrently with a single command.

---

## 🌟 Key Features

- **Multi-Channel Sequences**: Generate a cohesive cold email, a direct LinkedIn DM (under 300 characters), and a sequence follow-up email from one prompt.
- **Outreach Customization**: Choose between specialized target audiences (Hiring Managers, Engineering Leads, Potential Clients, Executives) and distinct tone profiles (Professional, Persuasive, Casual, Bold, Creative).
- **Secure Account Verification**: OTP registration using Nodemailer and Gmail SMTP to protect user history and configuration logs.
- **Outreach Archive / History**: Search, filter, and expand details of all your previous campaign generations in a sleek visual dashboard archive.
- **Fail-Safe Dynamic Backup**: Automatic fallback system that generates customized templates matching your specific prompt parameters in case of API outages.
- **Premium Cosmic-Dark UI**: Designed with glassmorphism, glowing borders, Outfit & Inter typography, and smooth micro-animations.

---

## 🛠️ Technology Stack

### Backend Server (`server/`)
- **Runtime**: Node.js & Express.js (following MVC architecture)
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens) & Password hashing with `bcryptjs`
- **AI Inference**: Groq SDK (`llama-3.3-70b-versatile`)
- **Mailer**: Nodemailer SMTP relay

### Frontend Client (`client/`)
- **Framework**: React.js (Vite template SPA)
- **Styling**: Tailwind CSS v4 & PostCSS (glowing cosmic dark theme)
- **Routing**: React Router DOM (protected workspace route walls)
- **API Client**: Axios (with interceptors to auto-inject session JWT tokens)
- **Icons**: Lucide React

---

## 🚀 Getting Started

### 📋 Prerequisites
- **Node.js** (v16.x or higher)
- **MongoDB** (running locally on `mongodb://localhost:27017` or a MongoDB Atlas cloud URI)
- A **Groq API Key** (from [Groq Console](https://console.groq.com/keys))

### 🔧 Installation
1. Clone the project to your local machine.
2. In the root directory, create a `.env` file based on `.env.example`:

```env
# Server Configuration
PORT=5000
MONGODB_URI=your-mongodb-connection-string

# JWT Secret
JWT_SECRET=your-super-secure-jwt-secret-key

# Nodemailer Configuration (Gmail SMTP)
USE_MOCK_EMAIL=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-gmail-app-password

# Groq AI API Configuration
GROQ_API_KEY=gsk_your-groq-api-key-here
```

3. Install all dependencies for root, client, and server folders in sequence by running:
```bash
npm run install-all
```

---

## 💻 Running the Application

### Start Concurrently (Backend + Frontend)
To launch the backend server (`port 5000`) and the Vite client (`port 3000`) together:
```bash
npm run start
```
Open your browser and navigate to **`http://localhost:3000`** to access the application!

### Running Separately

**Backend Server only**:
```bash
npm run server
```

**Frontend Client only**:
```bash
npm run client
```

---

## ☁️ Live Deployment

### Backend / Server (e.g., Render.com)
The backend is prepared for monolithic deployment. It serves static assets compiled from the frontend build:
1. Build the production client bundle:
   ```bash
   npm run build
   ```
2. Deploy the `server/` directory. Configure the environment variables on your server host.
3. Serve the app using `npm start --prefix server`.

---

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## ✍️ Authors

- **App Development and Documentation**: **Sanyogita Singh**

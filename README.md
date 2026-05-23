<p align="center">
  <img src="./shegaplaces_logo.png" alt="ShegaPlaces Logo" width="120" />
</p>

<h1 align="center">ShegaPlaces</h1>

<p align="center">
  <strong>Discover and share the places that matter to you.</strong>
</p>

<p align="center">
  ShegaPlaces is a beautifully crafted full-stack MERN application that brings people and locations together. Whether it's a hidden cafe, a breathtaking viewpoint, or your favorite local park, ShegaPlaces lets you upload, showcase, and map these spots securely.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white" alt="React" />
  <img src="https://img.shields.io/badge/Node.js-22-339933?logo=node.js&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Express-5-000000?logo=express&logoColor=white" alt="Express" />
  <img src="https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Deployed-Vercel%20%2B%20Render-black?logo=vercel&logoColor=white" alt="Deployed" />
</p>

---

## 🌟 What You Can Do (User Experience)

ShegaPlaces is built with the user in mind. Here’s what you experience when using the app:

### 👤 Create a Custom Profile
Sign up securely with just your name, email, strong password, and an avatar image. As soon as you join, you appear on the global community board where anyone can see how many amazing places you've shared.

### 📍 Drop a Pin on the World
Add your favorite locations by providing a title, a short description, an image, and simply typing an address. **Behind the scenes**, ShegaPlaces intelligently converts your address into precise latitude and longitude coordinates and drops a pin on the global map.

### 🗺️ Explore Interactive Maps
Browsing a friend's profile? Click **"VIEW ON MAP"** on any place they've shared. A beautiful, glass-morphism style modal will pop up, rendering a fully interactive OpenStreetMap (powered by React-Leaflet) centered exactly on their chosen destination. 

### 📸 Showcase Beautiful Imagery
Every place and profile picture you upload is instantly and securely delivered via Cloudinary's lightning-fast Content Delivery Network, ensuring high-quality, instantly loaded images for everyone browsing.

### 🔐 Secure & Recoverable Accounts
Accidentally forgot your password? No problem. Simply enter your email, and you'll receive a secure, limited-time reset link directly in your inbox (gracefully delivered by Resend). Click the link, set a new password full of uppercase, lowercase, numbers, and symbols, and get right back to exploring.

### ✏️ Retain Full Control
You are in complete control of your data. Edit titles and descriptions of your existing places, or permanently delete them with a single click. When you delete a place, its associated images are automatically unlinked and cleaned up from the cloud servers.

---

## 🏗️ Technical Architecture & Stack

### Frontend App
The sleek user interface runs on **React 19** and uses **React Router 7** with code splitting (lazy-loading pages!) to ensure lightning-fast navigation. 
- **Mapping:** `react-leaflet` to render OpenStreetMap tiles.
- **Styling:** Custom, modular CSS highlighting modern glassmorphism panels, loading spinners, and beautiful modals.
- **Hosting:** Blazing fast deployments on **Vercel**.

### Backend API
A highly secure, robust RESTful API built on **Node.js** & **Express 5**.
- **Database:** **MongoDB Atlas** managed by **Mongoose 9** using complex cross-referenced schemas and transactions to ensure users and their places stay perfectly linked.
- **File Handling:** **Multer** grabs incoming images, bypassing the local server completely and uploading directly to **Cloudinary**.
- **Emails:** **Resend** powers completely isolated, transactional password reset flows to bypass common cloud mailing restrictions.
- **Security:** Layered protection using `helmet` for HTTP headers, `express-rate-limit` to prevent spam, `express-validator` to ensure clean incoming data, and `bcryptjs` + `jsonwebtoken` for bullet-proof sessions.
- **Hosting:** Resilient deployments on **Render**.

---

## 📂 Inside The Code

```text
share-ur-place/
├── Frontend/                   # The Interactive React User Interface
│   ├── src/
│   │   ├── places/             # All things related to Locations
│   │   │   ├── pages/          # Add Place, Edit Place, View User's Places
│   │   │   └── components/     # Individual Place Cards, Map Modals
│   │   ├── users/              # All things related to Authentication & Community
│   │   │   ├── pages/          # Login/Signup, Global User List, Password Recovery
│   │   │   └── components/     # User Profile Cards
│   │   ├── share/              # Global lifelines
│   │   │   ├── components/     # Adaptive Navbars, Modals, Maps, Animated Spinners
│   │   │   ├── Context/        # System-wide Auth context
│   │   │   ├── hooks/          # Custom hooks (useHttpClient, useForm) to manage heavy-lifting
│   │   │   └── util/           # Strict password and text validators
│   │   ├── App.jsx             # The master router where it all begins
│   └── package.json
│
├── Backend/
│   └── Server/                 # The Engine Room (Express API)
│       ├── controllers/        # The brains (handling login limits, hashing passwords, geocoding)
│       ├── models/             # Mongoose blueprints (User shapes, Place shapes)
│       ├── routes/             # API gateways limiting who can enter what route
│       ├── middleware/         # Checkpoints (Verify JWT, Catch Images)
│       ├── util/               # Background tools (Nominatim Geocoding API)
│       ├── server.js           # Core server booting sequence, error catching, and DB linking
│       └── package.json
│
└── README.md
```

---

## 🚀 Setting Up Your Own Instance

Want to run ShegaPlaces on your own machine? It’s surprisingly simple.

### Prerequisites

- **Node.js** v18+ ([download](https://nodejs.org))
- **MongoDB** — local instance or [MongoDB Atlas](https://www.mongodb.com/atlas) cluster
- **Cloudinary** account — [sign up free](https://cloudinary.com)
- **Resend** account *(for password reset emails)* — [sign up free](https://resend.com)

### 1. Clone the Project

```bash
git clone https://github.com/afgjr/ShegaPlaces.git
cd ShegaPlaces
```

### 2. Ignite the Backend

```bash
cd Backend/Server
npm install
```

Create a secret `.env` file in `Backend/Server/` and configure your API keys:

```env
# The link to your MongoDB Cluster
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/shegaplaces

# Your custom encryption signature
JWT_SECRET=super_secret_jwt_key
JWT_EXPIRES_IN=1h

# Where your uploaded images live
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# The email sending engine (To securely reset forgotten passwords)
RESEND_API_KEY=re_your_api_key
RESEND_FROM_EMAIL=ShegaPlaces Team <onboarding@resend.dev>

# Identifying the frontend to prevent Cross-Origin errors
FRONTEND_URL=http://localhost:5173

# Local listener
PORT=3000
```

Fire it up:

```bash
npm run dev     # Watches for changes and auto-reloads
```

### 3. Launch the Frontend

Open a new terminal tab and prepare the user interface:

```bash
cd Frontend
npm install
```

Create a `.env` file in `Frontend/` mapping it to the backend you just started:

```env
VITE_BACKEND_URL=http://localhost:3000/api
# Used to switch between dev backend and prod backend seamlessly
```

Start the client:

```bash
npm run dev
```

Open your browser to **http://localhost:5173** and start sharing! 🎉

---

## 🌐 How the APIs Talk

Curious about how the Frontend talks to the Backend? Here is the secure route map.

### Identity & Access (Authentication)

| Method | Endpoint | What it does | Secured? |
|--------|----------|-------------|------|
| `GET` | `/api/users` | Pulls the public list of registered community members | ❌ No |
| `POST` | `/api/users/signup` | Registers a new member, uploads their avatar, and hands out a JWT | ❌ No |
| `POST` | `/api/users/login` | Validates credentials and hands out a JWT access pass | ❌ No |
| `POST` | `/api/users/forgot-password` | Generates a 1-hour secure token and fires an email via Resend | ❌ No |
| `POST` | `/api/users/reset-password/:token` | Accepts the emailed token and overwrites the old encrypted password | ❌ No |

### Location Operations (Places)

| Method | Endpoint | What it does | Secured? |
|--------|----------|-------------|------|
| `GET` | `/api/places/:pid` | Fetches details of a specific mapped location | ❌ No |
| `GET` | `/api/places/user/:uid` | Fetches the full portfolio of places owned by a specific user | ❌ No |
| `POST` | `/api/places` | Validates JWT, intercepts image, checks address validity, saves location | ✅ Yes |
| `PATCH` | `/api/places/:pid` | Validates JWT, verifies strict ownership, and overwrites text data | ✅ Yes |
| `DELETE` | `/api/places/:pid` | Validates JWT, verifies ownership, unlinks from User, deletes DB record, deletes Cloudinary image | ✅ Yes |

*(Protected routes cleanly reject anyone without `Authorization: Bearer <Your_JWT_Token>`)*

---

## 🤝 Open Source Community

Want to make the interface cleaner or add a new backend route? We welcome contributions! Let's build together:

1. **Fork** the repository.
2. Build something inside a new branch: `git checkout -b feature/awesome-addition`
3. Lock it in: `git commit -m 'Added interactive street views!'`
4. Send it back up: `git push origin feature/awesome-addition`
5. Open a **Pull Request**.

---

<p align="center">
  Released under the <a href="LICENSE">MIT License</a>. <br>
  Built with ❤️, Passion, and the mighty MERN Stack.
</p>

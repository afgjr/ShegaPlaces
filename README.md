# Shega Places

<p align="center">
  ShegaPlaces is a beautifully crafted full-stack MERN application that brings people and locations together. Whether it's a hidden cafe, a breathtaking viewpoint, or your favorite local park, ShegaPlaces lets you upload, showcase, and map these spots securely.
</p>


<p align="center">
  <img src="./shegaplaces_logo.png" alt="ShegaPlaces Logo" width="120" />
</p>

🔗 Live demo → ([Shega Places](https://shega-places.vercel.app/)) 


## Core features

*   **Interactive Maps** to view shared places using OpenStreetMap and React-Leaflet
*   **Geocode converting** automatically translates addresses into map coordinates
*   **Image Storage Cloud** using Cloudinary for fast and secure photo uploads
*   **Password Reset Engine** using Brevo API for temporary secure tokens [1]
*   **JWT Authentication** for secure login, registration, and session management
*   **Full CRUD controls** so you can create, edit, browse, and delete your favorite spots.

## Experience features

*   **Global community board** to discover what places other users are sharing
*   **Interactive Modal previews** to inspect map data without losing your place on the page
*   **Robust error handling** so you never have to guess what went wrong when logging in
*   **Automatic Image isolation** meaning deleting a place cleans up its data across all servers

## Customization & UI

*   **Modern minimal interface** built with React 19
*   **Responsive design** for easy browsing across all devices
*   **Glassmorphism UI components** for a high-quality visual aesthetic
*   **Code-split architecture** for blazing-fast initial page loads

## Quick start

### Option 1: Use Hosted Version

Navigate to the live deployment ([Shega Places](https://shega-places.vercel.app/)) and simply sign up for a free account.

### Option 2: Self-hosted Deployment

1. Set up your **MongoDB Atlas** database, **Cloudinary** account, and **Resend** account.
2. Clone the repository and configure `.env` in both `Frontend` and `Backend/Server` folders.
3. Run `npm install` and `npm run dev` in both workspaces to boot up the local instance!

---
## Footnotes
[1]: If you are self-hosting for local development, you'll need to supply your own Brevo API key for password reset emails to fire successfully!

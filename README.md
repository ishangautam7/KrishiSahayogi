# Krishi Sahayogi (कृषि सहयोगी)

**Krishi Sahayogi** is a comprehensive AI-powered agricultural platform designed to empower Nepali farmers. It bridges the gap between traditional farming and modern technology by providing real-time data, expert advice, and direct market access.

##  Key Features

*   **Smart Farming Advisor:** Optimized crop and fertilizer recommendations using ML (Random Forest).
*   **Disease Detection:** Instant plant disease identification using Computer Vision (ResNet9) with Gemini-powered cure suggestions.
*   **Price Prediction:** Market price forecasting using localized historical data (XGBoost).
*   **Direct Marketplace:** Connecting farmers directly to buyers to eliminate middlemen.
*   **Networking:** A community platform for farmers to share knowledge.
*   **Multilingual:** Full support for English and Nepali.

##  Project Structure

Verified ecosystem containing:

*   **[`/frontend`](./frontend):** Next.js 14 web application (PWA ready).
*   **[`/backend`](./backend):** Node.js/Express server for user management, marketplace, and forums.
*   **[`/models`](./models):** Python/Flask AI microservice hosting ML models and Gemini integration.
*   **[`/mobile`](./mobile):** React Native mobile application for on-the-go access.

##  Tech Stack

*   **Frontend:** Next.js, Tailwind CSS, Redux Toolkit, Framer Motion
*   **Backend:** Node.js, Express, MongoDB (assumed)
*   **AI/ML:** Python, Flask, PyTorch, Scikit-Learn, XGBoost, Google Gemini API
*   **Mobile:** React Native (Expo)

##  Quick Start

To run the entire ecosystem locally:

1.  **Backend:** `cd backend` -> `npm install` -> `npm run dev`
2.  **AI Server:** `cd models` -> `pip install -r requirements.txt` -> `python app.py`
3.  **Frontend:** `cd frontend` -> `npm install` -> `npm run dev`
4.  **Mobile:** `cd mobile` -> `npx expo install` -> `npx expo start `

##  Team DIMA

- Darpan Giri
- Ishan Gautam
- Mahesh Bhandari
- Alex Shrestha

# Towntask Backend

This is the backend for the Location-Based Local Skill & Work Matching Platform, built with Node.js, Express.js, and MongoDB.

## Getting Started

1.  **Install dependencies:**
    ```bash
    npm install
    ```
2.  **Set up environment variables:**
    Create a `.env` file in the `backend` directory with the following content:
    ```
    PORT=5000
    MONGO_URI=your_mongodb_atlas_connection_string
    JWT_SECRET=your_jwt_secret
    FRONTEND_URL=http://localhost:5173
    ```
    Replace `your_mongodb_atlas_connection_string` with your actual MongoDB Atlas connection string and `your_jwt_secret` with a strong, random secret key.

3.  **Run the development server:**
    ```bash
    npm run dev
    ```
4.  **Run the production server:**
    ```bash
    npm start
    ```

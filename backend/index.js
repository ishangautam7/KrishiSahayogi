import dotenv from "dotenv";
import http from "http";
import app from "./server.js";
import connectDB from "./db/index.js";
import { initSocket } from "./lib/socket.js";

dotenv.config({ path: './.env' });

connectDB().then(() => {
    const server = http.createServer(app);
    initSocket(server);

    const PORT = process.env.PORT || 7000;
    server.listen(PORT, '0.0.0.0', () => {
        console.log(`Server is running on port ${PORT}`);
    });
})
    .catch((error) => {
        console.log("Database connection Error", error);
        process.exit(1);
    });
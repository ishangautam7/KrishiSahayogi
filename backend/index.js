import dotenv from "dotenv";
import http from "http";
import app from "./server.js";
import connectDB from "./db/index.js";
import { initSocket } from "./lib/socket.js";

dotenv.config({ path: './.env' });

connectDB().then(() => {
    const server = http.createServer(app);
    initSocket(server);

    server.listen(process.env.PORT, () => {
        console.log(`Server is running on port ${process.env.PORT}`);
    });
})
    .catch((error) => {
        console.log("Database connection Error", error);
        process.exit(1);
    });
import { Server } from "socket.io";

let io;

export const initSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: ["http://localhost:3000", "http://localhost:3001", "http://localhost:3002"],
            credentials: true,
        },
    });

    io.on("connection", (socket) => {
        console.log("A user connected:", socket.id);

        socket.on("join", (userId) => {
            socket.join(userId);
            console.log(`User ${userId} joined their private room`);
        });

        socket.on("disconnect", () => {
            console.log("User disconnected");
        });
    });

    return io;
};

export const getIO = () => {
    if (!io) {
        throw new Error("Socket.io not initialized!");
    }
    return io;
};

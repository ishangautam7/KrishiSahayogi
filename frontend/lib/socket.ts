import { io } from "socket.io-client";

const SOCKET_URL = "http://localhost:7000";

export const socket = io(SOCKET_URL, {
    withCredentials: true,
    autoConnect: false,
});

export const connectSocket = (userId: string) => {
    if (!socket.connected) {
        socket.connect();
    }

    // Always listen for connect to join, covering initial and reconnects
    socket.on("connect", () => {
        console.log("Socket connected:", socket.id);
        socket.emit("join", userId);
    });

    // If already connected, emit join immediately as well (idempotent-ish)
    if (socket.connected) {
        socket.emit("join", userId);
    }
};

export const disconnectSocket = () => {
    if (socket.connected) {
        socket.disconnect();
    }
};

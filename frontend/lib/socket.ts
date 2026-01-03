import { io } from "socket.io-client";

const SOCKET_URL = "http://localhost:7000";

export const socket = io(SOCKET_URL, {
    withCredentials: true,
    autoConnect: false,
});

export const connectSocket = (userId: string) => {
    if (!socket.connected) {
        console.log("Connecting socket...");
        socket.connect();
    }

    // Use .off to avoid multiple listeners if connectSocket is called multiple times
    socket.off("connect");
    socket.on("connect", () => {
        console.log("Socket connected! ID:", socket.id);
        console.log("Emitting join with userId:", userId);
        socket.emit("join", userId);
    });

    if (socket.connected) {
        console.log("Socket already connected. Emitting join with userId:", userId);
        socket.emit("join", userId);
    }
};

export const disconnectSocket = () => {
    if (socket.connected) {
        socket.disconnect();
    }
};

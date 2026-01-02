import { io } from "socket.io-client";

const SOCKET_URL = "http://localhost:7000";

export const socket = io(SOCKET_URL, {
    withCredentials: true,
    autoConnect: false,
});

export const connectSocket = (userId: string) => {
    if (!socket.connected) {
        socket.connect();
        socket.emit("join", userId);
    }
};

export const disconnectSocket = () => {
    if (socket.connected) {
        socket.disconnect();
    }
};

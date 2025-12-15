import { io } from "socket.io-client";

// get env variables
const API_URL = import.meta.env.VITE_SOCKET_URL || import.meta.env.VITE_API_URL || "http://localhost:3000";

// Clean the URL (remove trailing slash)
const BASE_URL = API_URL.replace(/\/$/, "");

// Create the socket instance
const socket = io(BASE_URL, {
  transports: ["websocket"],     // Force WebSocket (most stable)
  withCredentials: true,         // allow cookies with WS
  autoConnect: false,            // you manually call socket.connect()
  reconnection: true,            // auto-reconnect enabled
  reconnectionAttempts: 10,
  reconnectionDelay: 500,
});

// Debug logs (optional but useful)
socket.on("connect", () => {
  console.log("🔌 Socket connected:", socket.id);
});

socket.on("disconnect", (reason) => {
  console.log("❌ Socket disconnected:", reason);
});

socket.on("connect_error", (err) => {
  console.log("⚠️ Socket connection error:", err.message);
});

export default socket;

import { createContext, useContext, useEffect } from "react";
import { getSocket } from "./socket";

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
    const socket = getSocket();

  useEffect(() => {
    socket.connect();

    return () => {
        socket.disconnect();
    }
  }, [socket])

  return (
    <SocketContext.Provider value={socket}>
        {children}
    </SocketContext.Provider>
  )
}

export const useSocket = () => useContext(SocketContext);
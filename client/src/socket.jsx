import io from "socket.io-client";
import { ws_server } from "./constant/config.js";
import { createContext, useContext, useMemo } from "react";

// eslint-disable-next-line react-refresh/only-export-components
const SocketContext = createContext();

// eslint-disable-next-line react-hooks/rules-of-hooks
const getSocket = () => useContext(SocketContext);

// eslint-disable-next-line react/prop-types
const SocketProvider = ({ children }) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const socket = useMemo(() => io(ws_server, { withCredentials: true }), []);
  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export { SocketProvider, getSocket };

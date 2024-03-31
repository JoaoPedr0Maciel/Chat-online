import {io} from "socket.io-client"

export const socket = () => io("https://chat-online-dev.onrender.com")
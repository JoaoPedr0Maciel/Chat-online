import {io} from "socket.io-client"

export const socket = () => io("http://hotelsystem.linxycorporation.com.br:8382")
import { Injectable } from "@nestjs/common";
import { io } from "socket.io-client";

@Injectable()
export class SocketService {
    socket: any = null;
    constructor() {
        const socket = io("http://46.62.205.241:9000", {
            // query: { phone: userInfo?.phone },
            secure: true,
        })
        socket.on('connect', () => {
            console.log('Connected to server admin page!.')
        })
        socket.on('error', (error) => {
            console.error('Socket connection error:', error)
        })
        socket.on('disconnect', () => {
            console.log('Disconnected from socket')
        })
        this.socket = socket
    }

    emit(key: string, payload: any) {
        return this.socket.emit(key, payload)
    }
}
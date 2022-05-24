import socketio  from "socket.io-client";
import { api } from './api'
import { IBoard } from "./boards.service";

const socket = socketio(api, {
    autoConnect: false
})

const connect = (token: string) => {
    socket.io.opts.query = { token }
    socket.connect()
}

export {
    connect,
    socket
}
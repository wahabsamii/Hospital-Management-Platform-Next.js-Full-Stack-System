import { io } from 'socket.io-client';
export const socket = io('http://localhost:5000', {
    autoConnect: false, auth: localStorage.getItem('user'), token: localStorage.getItem('token')
});

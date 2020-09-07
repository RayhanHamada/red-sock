/**
 * initialize temporary server for testing
 */
import socketio from "socket.io";

const io = socketio(3000);

io.on('connection', client => {
    console.log(`client with socket id of ${client.id} connected !`);
})





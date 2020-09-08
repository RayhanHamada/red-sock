/**
 * initialize temporary server for testing
 */
import { createServer } from 'http';
import socketio from 'socket.io';

export const server = createServer();
const io = socketio(server);

io.on('connection', client => {
  //   console.log(`client with socket id of ${client.id} connected !`);

  client.on('ping', () => {
    io.to(client.id).emit('pong', 'pong');
  });

  client.on('inc', () => {
    io.to(client.id).emit('inc');
  });

  client.on('dec', () => {
    io.to(client.id).emit('dec');
  });

  client.on('async-inc', () => {
    io.to(client.id).emit('async-inc');
  });

  client.on('inc-by', (by: number) => {
    io.to(client.id).emit('inc-by', by);
  });

  client.on('dec-by', (by: number) => {
    io.to(client.id).emit('dec-by', by);
  });
});

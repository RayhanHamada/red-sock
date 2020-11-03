const socketio = require('socket.io');

const io = socketio(3000);

io.on('connection', client => {
  client.on('activate_increment', () => {
    setTimeout(() => {
      client.emit('increment');
    }, 1000);
  });

  client.on('activate_decrement', () => {
    setTimeout(() => {
      client.emit('decrement');
    }, 1000);
  });
});

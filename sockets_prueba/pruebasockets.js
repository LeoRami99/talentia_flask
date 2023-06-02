const io = require('socket.io-client');

const socket = io('http://localhost:5000/curso/get-cursos'); // Reemplaza la URL con la dirección de tu servidor Flask

socket.on('connect', () => {
  console.log('Conectado al servidor');

  // Emitir un evento al servidor
  socket.emit('my_event', { message: 'Hola, servidor!' });
});

socket.on('cursosObtenidos', (data) => {
  console.log('Cursos obtenidos:', data);
});

socket.on('disconnect', () => {
  console.log('Desconectado del servidor');
});

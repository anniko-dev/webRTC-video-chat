const express = require('express'); // Import Express
const http = require('http'); // Import HTTP module

const app = express(); // Create an Express app
const server = http.createServer(app); // Create a server using the HTTP module

const cors = require('cors');
const io = require('socket.io')(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }
});

app.use(cors()); // Apply CORS middleware

const PORT = process.env.PORT || 8080;

app.get('/', (req, res) =>{
  res.send('server is running');
});

io.on('connection', (socket) => {
  socket.emit('me', socket.id);

  socket.on('disconnect', () => {
    socket.broadcast.emit('callended');
  });

  socket.on('calluser', ({ userToCall, signalData, from, name }) => {
    io.to(userToCall).emit('calluser', {
      signal: signalData,
      from,
      name
    })
  });

  socket.on('answercall', (data) => {
    io.to(data.to).emit('callaccepted', data.signal)
  });
})

server.listen(PORT, () => {
  console.log(`Server is listening on ${PORT}`);
});

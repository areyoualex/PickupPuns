'use strict';

//Use modules express and http
const express = require('express');
const app = express();
const http = require('http').Server(app);

//Use socketIO and path
const socketIO = require('socket.io');
const path = require('path');

//Variables for server port (for heroku) and index.html
const PORT = process.env.PORT || 3000;
const INDEX = path.join(__dirname, 'index.html');

//Sends index.html
app.get('/', (req, res) => {
  res.sendFile(INDEX);
})

//Sends static files like CSS, JS, images, etc.
app.use(express.static('.'));

//Listen on port 3000 or whatever port the app is running on
http.listen(PORT, ()=> {
  console.log('listening on *:'+ PORT + ' o3o');
})

//socketIO stuff
const io = socketIO(http);

//Create timer
var timer = 180;
setInterval(()=>{
  if (timer > 0) timer--;
  else {
    timer = 180;
    io.emit('timer', timer);
  }
}, 1000);

//Start the socket connection
io.on('connection', function(socket){
  //Console debug - leave commented out
  //console.log('a user connected');

  //Give time on connect
  socket.emit('timer', timer);

  //What to do upon receiving a pun
  socket.on('pun', function(msg){
    //Output to console
    console.log('pun: ' + msg);

    //Emit to all connected clients except sender
    socket.broadcast.emit('pun', msg);
  });
});

setInterval(() => io.emit('time', new Date().toTimeString()), 1000);

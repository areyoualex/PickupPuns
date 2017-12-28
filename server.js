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

//Array of rooms
var rooms = [];

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

  //Variable for this sockets current room index
  var i;

  //Give time on connect
  socket.emit('timer', timer);

  //What to do upon receiving a pun
  socket.on('pun', function(username, msg){
    //Output to console
    console.log('pun by '+username+': ' + msg);

    //Emit to all connected clients except sender
    socket.to(Object.keys(socket.rooms)[1]).emit('pun', username, msg);
  });

  //On receiving a join game message
  socket.on('join game', function(name, username){
    //Join the room
    socket.join(name);

    var hasRoom = false;

    //Find room; if it doesn't exist yet, add it
    rooms.find((element)=>{
      if (element == name) hasRoom = true;
    });
    if(!hasRoom) rooms.push(name);

    /*
    //Debug output
    console.log(name);
    console.log("joined by " + username);
    io.in(name).clients((error, clients)=>{
      console.log(clients);
    });
    console.log(Object.keys(socket.rooms));
    */
  });
});

setInterval(() => io.emit('time', new Date().toTimeString()), 1000);

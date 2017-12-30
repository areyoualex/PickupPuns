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
  var uname = "";
  var uroom = "";

  //Give time on connect
  socket.emit('timer', timer);

  //Upon a request for the room list
  socket.on('rooms', function(){
    socket.emit('rooms', rooms);
  });

  //Upon a player leaving a room
  socket.on('leave game', function(){
    socket.leave(uroom);
    var roomIndex = rooms.findIndex(r => r == uroom);

    io.in(uroom).clients((error, clients)=>{
      //If this is the last person in the room, remove the room from the list
      if (clients.length == 0)
        if(roomIndex != -1)
          rooms.splice(roomIndex, 1);
    });

    //Update rooms list for connected clients
    io.emit('rooms', rooms);

    io.in(uroom).emit('leave game', uname);
    uroom = "";
  });

  //Upon receiving a pun
  socket.on('pun', function(msg){
    //Output to console
    //console.log('pun by '+uname+' to '+uroom+': ' + msg);

    //Emit to everyone in the room
    io.in(uroom).emit('pun', uname, msg);
  });

  //Upon a new user joining the game
  socket.on('join game', function(name, username){
    //Join the room
    socket.join(name);

    //Set username and room variable
    uname = username;
    uroom = name;

    //Tell everyone that the user has joined
    io.in(name).emit('new user', username);

    //Find room; if it doesn't exist yet, add it
    var hasRoom = false;

    rooms.find((element)=>{
      if (element == name) hasRoom = true;
    });
    if(!hasRoom) rooms.push(name);

    //Emit rooms list
    io.emit('rooms', rooms);

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

  //Upon a user disconnecting
  socket.on('disconnect', function(reason){
    var roomIndex = rooms.findIndex(r => r == uroom);

    io.in(uroom).clients((error, clients)=>{
      //If this is the last person in the room, remove the room from the list
      if (clients.length == 0)
        if(roomIndex != -1)
          rooms.splice(roomIndex, 1);
    });

    //Send a disconnect message
    socket.to(uroom).emit('user disconnected', uname);

    //Update rooms list for connected clients
    io.emit('rooms', rooms);
  });

});

//Timer
setInterval(() => io.emit('time', new Date().toTimeString()), 1000);

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

  //Variable for this sockets current room index
  var i;

  //Give time on connect
  socket.emit('timer', timer);

  //Upon a request for the room list
  socket.on('rooms', function(){
    socket.emit('rooms', rooms);
  });

  //Upon receiving a pun
  socket.on('pun', function(username, msg){
    //Output to console
    console.log('pun by '+username+': ' + msg);

    //Emit to everyone in the room
    io.in(Object.keys(socket.rooms)[1]).emit('pun', uname, msg);
  });

  //Upon a new user joining the game
  socket.on('join game', function(name, username){
    //Join the room
    socket.join(name);

    //Set username variable
    uname = username;

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

  //On the socket disconnecting
  socket.on('disconnecting', function(reason){
    var room = Object.keys(socket.rooms)[1];
    io.in(room).clients((error, clients)=>{
      //If this is the last person in the room, remove the room from the list
      if (clients.length == 1)
        rooms.find((element, index)=>{
          if (element == room) rooms.splice(index, 1);
        });
    });
    
    //Send a disconnect message
    socket.to(room).emit('user disconnected', uname);

    //Update rooms list for connected clients
    io.emit('rooms', rooms);
  });

});

setInterval(() => io.emit('time', new Date().toTimeString()), 1000);

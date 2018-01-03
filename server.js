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

var rooms = []; //Array of rooms

//Create timer
setInterval(()=>{
  for(var i = 0; i<rooms.length; i++){
    if (rooms[i].timer > 0) rooms[i].timer--;
    else {
      rooms[i].timer = (rooms[i].state == 'punning') ? 60 : 180;
      rooms[i].state = (rooms[i].state == 'punning') ? 'judging' : 'punning';
      io.in(rooms[i].name).emit('state', rooms[i].state);
      io.in(rooms[i].name).emit('timer', rooms[i].timer);
    }
  }
}, 1000);

//Start the socket connection
io.on('connection', function(socket){
  //Console debug - leave commented out
  //console.log('a user connected');
  var uname = "";
  var uroom = "";

  //Upon a request for the room list
  socket.on('rooms', function(){
    socket.emit('rooms', rooms);
  });

  //Upon receiving a pun
  socket.on('pun', function(msg){
    if(rooms.find(r => r.name == uroom)){
      if(rooms[rooms.findIndex(r => r.name == uroom)].state == 'punning')
        //Emit to everyone in the room
        io.in(uroom).emit('pun', uname, msg);
    }
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
      if (element.name == name) hasRoom = true;
    });
    if(!hasRoom) {
      rooms.push(createRoom(name));
    }

    var index = rooms.findIndex(r => r.name == uroom);

    //Add user to list of users
    rooms[index].users.push(username);

    io.emit('rooms', rooms); //Emit rooms list
    io.in(uroom).emit('users', rooms[index].users); //Emit user list
    socket.emit('timer', rooms[index].timer); //Emit timer
    socket.emit('state', rooms[index].state);
  });

  //Upon a player leaving a room
  socket.on('leave game', function(){
    var index = rooms.findIndex(r => r.name == uroom);

    socket.leave(uroom);

    leaveCleanup();

    io.in(uroom).emit('leave game', uname);
    io.in(uroom).emit('users', rooms[index].users);
    uroom = "";
  });

  //Upon a user disconnecting
  socket.on('disconnect', function(reason){
    leaveCleanup();
    //Send a disconnect message
    socket.to(uroom).emit('user disconnected', uname);
  });

  //Handle room arrays when someone leaves a room
  function leaveCleanup(){
    var index = rooms.findIndex(r => r.name == uroom);
    //Handle user list
    if(index != null && rooms[index] != undefined)
      var userIndex = rooms[index].users.findIndex(u => u==uname)
    else var userIndex = -1;
    if(userIndex != -1){
      rooms[index].users.splice(userIndex, 1);
      io.in(uroom).emit('u}sers', rooms[index].users);
    }

    io.in(uroom).clients((error, clients)=>{
      //If this is the last person in the room, remove the room from the list
      if (clients.length == 0)
        if(index != -1){
            rooms.splice(index, 1);
          }
    });

    //Update rooms list for connected clients
    io.emit('rooms', rooms);
  }
});

//Room constructor
function createRoom(name){
  var obj = {};
  obj.name = name;
  obj.timer = 180;
  obj.state = 'punning';
  obj.users = [];
  obj.judgeIndex = 0;
  return obj;
}

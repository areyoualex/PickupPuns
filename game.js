$(function () {
  //Creating new game
  $('#createGame').click(function(){
    switchView(views.start, views.signIn);
  });

  //Joining existing game
  $('#joinGame').click(function(){
    socket.emit('rooms'); //Ask for rooms list
    switchView(views.start, views.rooms);
  });

  //Leaving current game
  $('#leave').click(function(){
    game.leave(); //Tell server to leave the room
    switchView(views.game, views.start); //Show the start screen
  });

  //Upon a room button being clicked
  views.rooms.delegate(".room", "click", function(){
    var username = $('#rooms > input').val();
    var room = $(this).html();

    game.join(username, room);
    switchView(views.rooms, views.game); //Show game and hide rooms list
    }
  });

  //Function to show game after sign-in
  $('#signin').submit(function(e){
    e.preventDefault(); //Prevent page refresh
    switchView(views.signIn, views.game); //Make pungame visible

    var username = $('#signin input[text]:eq(0)');
    var room = $('#signin input[text]:eq(1)');
    game.join(username, room); //Send username and room to server
  });

  //Upon sending a pun
  views.game.input.submit(function(e){
    e.preventDefault(); //Don't refresh the page
    game.submitPun(); //Send the pun to the server
    return false;
  });

  //Upon receiving a pun from the server
  socket.on('pun', (username, msg)=> {
    game.show("<p>"username+"said: </p>"+msg);
  });

  //Upon receiving message that a user has disconnected
  socket.on('user disconnected', (username)=>{
    game.show("<p>"username+"has disconnected. </p>");
  });

  //Upon receiving message that a user has left
  socket.on('leave game', (username)=>{
    game.show("<p>"username+"has left the game. </p>");
  });

  //Upon receiving message that a new user has joined
  socket.on('new user', (username)=>{
    game.show("<p>"username+"has joined. </p>");
  });
});

  //Upon receiving the rooms list
  socket.on('rooms', (rooms)=>{
    $('#rooms p:gt(0)').remove();
    rooms.forEach((room)=>{
       views.rooms.append("<p> <button class='room'>" + room + "</button> </p>")
    });

    //Clear rooms list if empty
    if (rooms.length == 0)
      views.rooms.append("<p>No one's playing right now... Make a new game!</p>");
  });

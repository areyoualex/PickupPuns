//Timer variable
window.timer;

//Server connection variable
var socket = io();

//Username variable
var username;

//This will send the pun to the server upon the form being submitted
//It's a JQueryblock
$(function () {
  //Creating new game
  $('#createGame').click(function(){
    $('#signin').css({"display":"block"});
    $('#start').css({"display":"none"})
  });

  //Joining existing game
  $('#joinGame').click(function(){
    //Ask for rooms list
    socket.emit('rooms');
    $('#start').css({"display":"none"});
    $('#rooms').css({"display":"block"});
  });

  //Leaving current game
  $('#leave').click(function(){
    //Tell server to leave the room
    socket.emit('leave game');

    //Clear the message list
    $('#punlist').html("");
    //Show the start screen
    
    $('#pungame').css({"display":"none"});
    $('#start').css({"display":"flex"});
  });

  //Upon a room button being clicked
  $('#rooms').delegate(".room", "click", function(){
    var username = $('#rooms > input').val();
    if (username == "")
      alert("Please enter a username.");
    else {
      socket.emit('join game', $(this).html(), username);
      //Show game and hide rooms list
      $('#pungame').css({"display":"block"});
      $('#rooms').css({"display":"none"});
    }
  });

  //Function to show game after sign-in
  $('#signin').submit(function(e){
    //Prevent page refresh
    e.preventDefault();

    //Make pungame visible
    document.getElementById('signin').style.display = "none";
    document.getElementById('pungame').style.display = "block";

    //Send username and room to server
    var elements = document.getElementById('signin').getElementsByTagName('input');
    socket.emit('join game', elements[1].value, elements[0].value);
    username = elements[0].value;
  });

  //Get pun <ul> element
  var puns = document.getElementById('punlist');

  //Upon sending a pun
  $('#puninput').submit(function(e){
    //Don't refresh the page
    e.preventDefault();

    /*
    //Add the pun the user sent to the punlist
    puns.innerHTML = puns.innerHTML + "<li> <p>"+username+" said: </p>"
      + document.getElementById('text').value + "</li>";
    */

    //Scroll to the bottom of the punlist
    puns.scrollTop = puns.scrollHeight;

    //Send the pun to the server
    socket.emit('pun', $('#text').val());
    $('#text').val('');
    return false;
  });

  //Upon receiving a pun from the server
  socket.on('pun', (username, msg)=> {
    puns.innerHTML = puns.innerHTML + "<li> <p>"+username+" said: </p>" + msg + "</li>"
    puns.scrollTop = puns.scrollHeight;
  });

  //Upon receiving the rooms list
  socket.on('rooms', (rooms)=>{
    var roomHTML = "<p>Enter your name:</p><input type='text'>";
    $('#rooms').html("");
    rooms.forEach((room)=>{
      roomHTML = roomHTML + "<p> <button class='room'>" + room + "</button> </p>";
    });

    //Update list
    $('#rooms').html(roomHTML);

    //Clear rooms list if empty
    if (rooms.length == 0)
      $('#rooms').html("<p>No one's playing right now... Make a new game!</p>");
  });

  //Upon receiving message that a user has disconnected
  socket.on('user disconnected', (username)=>{
    puns.innerHTML = puns.innerHTML + "<li> <p>"+username+" has disconnected. </p> </li>"
    puns.scrollTop = puns.scrollHeight;
  });

  //Upon receiving message that a user has left
  socket.on('leave game', (username)=>{
    puns.innerHTML = puns.innerHTML + "<li> <p>"+username+" has left the game. </p> </li>"
    puns.scrollTop = puns.scrollHeight;
  });

  //Upon receiving message that a new user has joined
  socket.on('new user', (username)=>{
    puns.innerHTML = puns.innerHTML + "<li> <p>"+username+" has joined. </p> </li>"
    puns.scrollTop = puns.scrollHeight;
  });
});




//Handle display of timer
/*
setInterval(()=>{
  //Display time on website
  if(window.minutes != 1 && window.minutes != 0 && window.minutes >=0 && typeof window.minutes !== 'undefined' && window.seconds >= 0 && typeof window.seconds !== 'undefined'){
    //regular print with >1 minutes
    document.getElementById('time').innerHTML = window.minutes + " minutes " + window.seconds + " seconds";
    window.timer--;
  } else if (window.minutes == 0 && typeof window.minutes !== 'undefined' && window.seconds >= 0 && typeof window.seconds !== 'undefined'){
    //printing with no minutes
    document.getElementById('time').innerHTML = window.seconds + " seconds";
    window.timer--;
  } else if (window.minutes == 1 && window.minutes >=0 && typeof window.minutes !== 'undefined' && window.seconds >= 0 && typeof window.seconds !== 'undefined'){
    //printing with 1 minute
    document.getElementById('time').innerHTML = window.minutes + " minute " + window.seconds + " seconds";
    window.timer--;
  }

  window.minutes = Math.floor(window.timer/60);
  window.seconds = window.timer%60
  if(window.timer == 0){ io(); }
}, 1000);



//Upon receiving the time
socket.on('timer', (t)=> { timer = t; });
*/

//Alert user if they try to copy-paste a pun
function pasteNotice(){
  alert("Please don't paste pick up lines! Naughty!");
}

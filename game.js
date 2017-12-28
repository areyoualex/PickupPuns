//Timer variable
window.timer;

//Server connection variable
var socket = io();

//Username variable
var username;

//This will send the pun to the server upon the form being submitted
//It's a JQuery block
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
    $('#rooms').css({"display":"block"});
    $('#start').css({"display":"none"})
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

  //Upon submitting the form
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
    socket.emit('pun', username, $('#text').val());
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
    //Update list
    $('#rooms > ul').html(()=>{
      var ret = "";
      rooms.forEach((room)=>{
        ret = ret + "<li> <button class='room'>" + room + "</button> </li>";
      });
      return ret;
    });
  });

  //Upon receiving message that a user has disconnected
  socket.on('user disconnected', (username)=>{
    puns.innerHTML = puns.innerHTML + "<li> <p>"+username+" has disconnected. </p> </li>"
  })

  //Upon receiving message that a new user has joined
  socket.on('new user', (username)=>{
    puns.innerHTML = puns.innerHTML + "<li> <p>"+username+" has joined. </p> </li>"
  })
});

//Handle display of timer
setInterval(()=>{
  //Display time on website
  if(Math.floor(window.minutes) != 1 && Math.floor(window.minutes) != 0){
    document.getElementById('time').innerHTML = Math.floor(window.minutes) + " minutes " + window.seconds + " seconds";
    window.timer--;
  } else if (Math.floor(window.minutes) == 0){
    document.getElementById('time').innerHTML = window.seconds + " seconds";
    window.timer--;
  } else {
    document.getElementById('time').innerHTML = Math.floor(window.minutes) + " minute " + window.seconds + " seconds";
    window.timer--;
  }

  window.minutes = window.timer/60;
  window.seconds = window.timer%60
  if(window.timer == 0){ io(); }
}, 1000);


//Upon receiving the time
socket.on('timer', (t)=> { timer = t; });

//Alert user if they try to copy-paste a pun
function pasteNotice(){
  alert("Please don't paste pick up lines! Naughty!");
}

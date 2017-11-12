//Timer variable
var timer;

$(function () {
  var puns = document.getElementById('punlist');

  var socket = io();

  $('form').submit(function(e){
    e.preventDefault();

    puns.innerHTML = puns.innerHTML + "<li> <p>You said: </p>"
      + document.getElementById('text').value + "</li>";

    socket.emit('pun', $('#text').val());
    $('#text').val('');

    return false;
  });

  //Get the time
  socket.emit('get time', 'true');

  //Upon receiving the time
  socket.on('timer', (t)=> { timer = t; });

  //Upon receiving a pun from the server
  socket.on('pun received', (msg)=> {
    puns.innerHTML = puns.innerHTML + "<li> <p>They said: </p>" + msg + "</li>"
  });
});

setInterval(()=>{
  document.getElementById('time').innerHTML = timer + " seconds";
  timer++;
}, 1000);

function pasteNotice(){
  alert("Please don't paste pick up lines! Naughty!");
}

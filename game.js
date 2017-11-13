//Timer variable
var timer;

$(function () {
  var puns = document.getElementById('punlist');

  var socket = io();

  $('form').submit(function(e){
    e.preventDefault();

    puns.innerHTML = puns.innerHTML + "<li> <p>You said: </p>"
      + document.getElementById('text').value + "</li>";
      
    puns.scrollTop = puns.scrollHeight;

    socket.emit('pun', $('#text').val());
    $('#text').val('');

    return false;
  });

  //Get the time
  socket.emit('get time', 'true');

  //Upon receiving the time
  socket.on('timer', (t)=> { timer = t; });

  //Upon receiving a pun from the server
  socket.on('pun', (msg)=> {
    puns.innerHTML = puns.innerHTML + "<li> <p>They said: </p>" + msg + "</li>"
    puns.scrollTop = puns.scrollHeight;
  });
});

setInterval(()=>{
  document.getElementById('time').innerHTML = window.minutes + " minutes " + window.seconds + " seconds";
  timer--;
  if(timer == 0){ io(); }
}, 1000);

  window.minutes = timer/60;
  window.seconds = timer%60

function pasteNotice(){
  alert("Please don't paste pick up lines! Naughty!");
}

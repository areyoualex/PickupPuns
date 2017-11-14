//Timer variable
window.timer;

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



function pasteNotice(){
  alert("Please don't paste pick up lines! Naughty!");
}

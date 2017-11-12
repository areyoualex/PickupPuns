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

  //Upon receiving a pun from the server
  socket.on('pun received', (msg)=> {
    puns.innerHTML = puns.innerHTML + "<li> <p>They said: </p>" + msg + "</li>"
  });
});

function pasteNotice(){
  alert("Please don't paste pick up lines! Naughty!");
}

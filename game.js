$(function () {
  var socket = io();

  $('form').submit(function(e){
    e.preventDefault();

    var puns = document.getElementById('punlist');
    puns.innerHTML = puns.innerHTML + "<li>" + document.getElementById('text').value + "</li>";

    socket.emit('pun', $('#text').val());
    $('#text').val('');

    return false;
  });
});

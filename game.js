//Timer variable
var timer;

//Start a connection to the server
var socket = io();

//This will send the pun to the server upon the form being submitted
//It's a JQuery block
$(function () {
  //Get pun <ul> element
  var puns = document.getElementById('punlist');

  //Upon submitting the form
  $('form').submit(function(e){
    //Don't refresh the page
    e.preventDefault();

    //Add the pun the user sent to the punlist
    puns.innerHTML = puns.innerHTML + "<li> <p>You said: </p>"
      + document.getElementById('text').value + "</li>";

    //Scroll to the bottom of the punlist
    puns.scrollTop = puns.scrollHeight;

    //Send the pun to the server
    socket.emit('pun', $('#text').val());
    $('#text').val('');
    return false;
  });
});

//Handle display of timer
setInterval(()=>{
  //Gets the minutes and seconds
  window.minutes = Math.floor(timer/60);
  window.seconds = timer%60

  //Display time on website
  if(minutes == 0){
    document.getElementById('time').innerHTML = window.seconds + " seconds";
  }
  document.getElementById('time').innerHTML = window.minutes + " minutes " + window.seconds + " seconds";
  //Subtract from the timer
  timer--;

}, 1000);

//Upon receiving the time
socket.on('timer', (t)=> { timer = t; });

//Upon receiving a pun from the server
socket.on('pun', (msg)=> {
  puns.innerHTML = puns.innerHTML + "<li> <p>They said: </p>" + msg + "</li>"
  puns.scrollTop = puns.scrollHeight;
});

//Alert user if they try to copy-paste a pun
function pasteNotice(){
  alert("Please don't paste pick up lines! Naughty!");
}

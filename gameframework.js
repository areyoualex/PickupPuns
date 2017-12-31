//Variables/aliases for interacting with the game
var game = {};
var game.socket = io(); //Server connection variable
var game.timer, game.username;

//Aliases for the document
var views = {};
var views.signIn = $('#signIn');
var views.start = $('#start');
var views.rooms = $('#rooms');
var views.game = $('#pungame');
var views.puns = $('#punlist');
var views.game.input = $('#puninput');


//Functions for interacting with the game
var game.leave = function(){
  game.username = '';
  views.puns.empty(); //Clear the message list
  socket.emit('leave game');
}, game.join = function(username, room){
  game.username = username;
  socket.emit('join game', room, username);
}, game.sendPun = function(){
  //Send the pun to the server
  socket.emit('pun', $('#puninput textarea').val());
  $('#text').val('');
}, game.show = function(message){
  views.puns.append("<li>"+message+"</li>");
  views.puns.scrollTop(views.game.list.prop('scrollHeight'));
}


//Functions for interacting with the document

//Switch currently visible view
function switchView(hideBlock, showBlock){
  showBlock.show();
  hideBlock.hide();
}
//Textarea submitting snippet
$("#text").keypress(function (e) {
  if(e.which == 13 && !e.shiftKey) {
      $(this).closest("form").submit();
      e.preventDefault();
      return false;
  }
});

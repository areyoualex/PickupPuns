function addPun(){
  var puns = document.getElementById('punlist');
  puns.innerHTML = puns.innerHTML + "<li>" + document.getElementById('text').value + "</li>";
  return false;
}

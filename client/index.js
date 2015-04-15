'use strict';

$(document).ready(init);

var root, user, tasks;

function init(){
  $('#set-name').click(setName);
  root = new Firebase('https://mj-todo.firebaseio.com/');
  user = root.child('user');
  tasks = root.child('tasks');
}

function setName(){
  var name = $('#name').val();
}

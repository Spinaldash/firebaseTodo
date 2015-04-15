'use strict';

$(document).ready(init);

var root, user, tasks;

function init(){
  $('#set-name').click(setName);
  root = new Firebase('https://mj-todo.firebaseio.com/');
  user = root.child('user');
  tasks = root.child('tasks');
  user.on('value', userChanged);
  $('#create-task').on('click', createTask);
}

function createTask(){
  var title = $('#title').val();
  var dueDate = $('#due-date').val();
  dueDate = new Date(dueDate); // turns it into a date object from a string
  dueDate = dueDate.getTime(); // turns it into a number from a date
  var priority = $('#priority').val();
  var isComplete = false;
  var createdAt = Firebase.ServerValue.TIMESTAMP;

  var task = {
    title: title,
    dueDate: dueDate,
    priority: priority,
    isComplete: isComplete,
    createdAt: createdAt
  };

  tasks.push(task);
}

function userChanged(snapshot){
  var name = snapshot.val();
  $('#header').text('Welcome to Todo : ' + name);
  console.log(snapshot.val());
}

function setName(){
  var name = $('#name').val();
  $('#name').val('');
  user.set(name);
}

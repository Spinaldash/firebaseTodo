'use strict';

$(document).ready(init);

var root, user, tasks;

function init(){
  $('#set-name').click(setName);
  root = new Firebase('https://mj-todo.firebaseio.com/');
  user = root.child('user');
  tasks = root.child('tasks');
  user.on('value', userChanged);
  tasks.on('child_added', taskAdded);
  tasks.on('child_removed', taskRemoved);
  tasks.on('child_changed', taskChanged);
  $('#create-task').on('click', createTask);
  $('#toDos').on('click', '.delete', deleteTask);
  $('#toDos').on('change', 'input[type="checkbox"]', toggleComplete);

}

function taskChanged(snapshot){
  var key = snapshot.key();
  var task = snapshot.val();
  var $tr = $('tr[data-key="' + key +'"]');
  var checked = task.isComplete ? 'checked' : '';
  $tr.removeClass().addClass(checked);
  $tr.find('input[type=checkbox]').attr('checked', !!checked);
}

function toggleComplete(){
  var key = $(this).closest('tr').data('key');
  var checked = !!$(this).attr('checked')
  tasks.child(key).update({isComplete: !checked});
}

function taskRemoved(snapshot){
  //find the Tr and .remove() him
  var key = snapshot.key(); // This is how you get the key
  $('tr[data-key="'+key+'"]').remove() // This is how you jquery select by data-attribute
}

function deleteTask(){
  var key = $(this).closest('tr').data('key')
  var task = tasks.child(key);
  task.remove();
}

function taskAdded(snapshot){
  var task = snapshot.val();
  var key = snapshot.key();
  var checked = task.isComplete ? 'checked' : '';
  var tr = '<tr class="'+checked+'" data-key="'+key+'"><td><button class="delete">&times;</button></td><td><input type="checkbox" ' + checked + '></td><td>'+task.title+'</td><td>'+task.dueDate+'</td><td>'+task.priority+'</td><td>'+task.createdAt+'</td></tr>';
  $('#toDos').append(tr);
}

function createTask(){
  var title = $('#title').val();
  var dueDate = $('#due-date').val();
  dueDate = new Date(dueDate); // turns it into a date object from a string
  dueDate = dueDate.getTime(); // turns it into a number from a date
  dueDate = moment(dueDate).format('MMMM Do YYYY');
  var priority = $('#priority').val();
  var isComplete = false;
  var createdAt = Firebase.ServerValue.TIMESTAMP;
  createdAt = moment(createdAt).format('MMMM Do YYYY');

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
}

function setName(){
  var name = $('#name').val();
  $('#name').val('');
  user.set(name);
}

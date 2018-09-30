var socket = io();

const url = new URL(window.location);
const user = url.searchParams.get('user');
const room = url.searchParams.get('room');
const isSM = url.searchParams.get('scrum-master');

socket.emit('join', {user,room,isSM}, function(err){
  if (err){
    alert(err);
    window.location.href = '/';
  }else{
    console.log('No error');
  }
})


socket.on('updateUserList', function(users){
  console.log('Received update users');
  console.log(users);
  $('#userList').html(users.map((item) => {
    return generateAvatar(item.color,item.name)
  }))
})

socket.on('activeTaskUpdate', function(task){
  console.log('Task updated');
})

socket.on('taskListUpdate', function(tasks){
  console.log('Task received');
  console.log(tasks)
  $('#taskList').html(tasks.map((task) => {
    return `<li class="taskListItem">${task.taskName}</li>`
  }))
  attachListHandlers(isSM)
})

$('#newTaskSubmit').click(() => {
  console.log('Clicked')
  const taskName = $('#newTaskInput').val();
  if(taskName.trim().length === 0){
    return alert('Task name cannot be empty');
  }

  socket.emit('newTask', taskName, (err) => {
    if(err){return false}
    $('#newTaskInput').val('');
  })
})


socket.on('updateActiveTask', updateActiveTask);


function updateActiveTask(activeTask){
  $('.taskListItem').each(function(index,item){
    if($(item).html() !== activeTask){
      $(item).removeClass('activeTask');
    }else{
      $(item).addClass('activeTask');
    };
  })
}

function attachListHandlers(isSM){
  $('.taskListItem').each(function(index,item){
    if(isSM === 'on'){
      $(item).click(function(e){
        socket.emit('changeActiveTask',$(e.target).html())
    	})
    }
  });
}

function generateAvatar(color,name){
  return `<li><span class="avatar" style="color:${color}">${name.toUpperCase()}</span><br/></li>`
}

  // $('li.taskListItem').addClass('activeTask');

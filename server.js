var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

const path = require('path')
const {Users} = require('./src/users.js');
let users = new Users();
app.use(express.static(path.join(__dirname, '/public')));

//
// app.get('/', function(req, res){
//   res.sendFile(__dirname + '/public/index.html');
// });

io.on('connection', function(socket){
  console.log('a user connected');

  socket.on('join', (params, callback) => {

    console.log('params');
    console.log(params)

  socket.join(params.room);
  users.removeUser(socket.id);
  users.addUser(socket.id, params.user, params.room, params.isSM);
  //console.log(users);
  io.to(params.room).emit('updateUserList', users.getUserList(params.room));
  callback();
});


  socket.on('newTask', (taskName, callback) => {
    const {room} = users.getUser(socket.id);
    users.addTask({taskName,room,voteResult:{}});
    io.to(room).emit('taskListUpdate', users.getTaskList(room));
    callback();
  })

  socket.on('changeActiveTask', (taskName) => {
    const {room} = users.getUser(socket.id);
    io.to(room).emit('updateActiveTask', taskName);
  })

  socket.on('disconnect', () => {
    console.log('user disconnected')
    var user = users.removeUser(socket.id);
    if(user){
    io.to(user.room).emit('updateUserList', users.getUserList(user.room));
    }
  })
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});

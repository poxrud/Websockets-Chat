var express = require('express');
var app = express();

app.use("/", express.static(__dirname + '/public'));


var io = require('socket.io').listen(app.listen(3001));

var users = {};

io.sockets.on('connection', function (socket) {

  socket.emit('connected');

  socket.on('join', function(data){
    users[socket.id] = data.username;

    io.sockets.emit('announcement', {message: "User " + data.username + " has joined the room."});
    io.sockets.emit('user_list', users);
  });
  
  socket.on('message', function(data) {
    
    io.sockets.emit("message", data);

  });


  socket.on('disconnect', function() {
    
    var deletedUser = users[socket.id];
    delete users[socket.id];

    io.sockets.emit('announcement', {message: "User " + deletedUser + " has left the room."});
    io.sockets.emit('user_list', users);
    
  });

});


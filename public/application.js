window.onload = function() {
  
  var enterChat = document.getElementById("enter-chat-button");
  var chatRoom  = document.getElementById("chatroom");

  enterChat.onclick = function () {
    var userName = document.getElementById("user").value;

    if (!userName) {
      alert("Please Enter a Username");
      return;
    }

    document.getElementById("username").className = "is-disabled";
    chatRoom.style.display = "block";

    startChatroom(userName);

  };

  var startChatroom = function (userName) {

    var socketio = io.connect();

    socketio.on("connected", function() {
      updateStatus("Connected");
      socketio.emit("join", {"username": userName});

      document.getElementById('message').disabled = false;
    });

    socketio.on("message", function(data) {
      var recvMessage = JSON.parse(data);

      updateChatWindow(recvMessage.username + ": " + recvMessage.message);
    });

    socketio.on("announcement", function(data) {
      updateChatWindow("*** " + data.message);
    });

    socketio.on("user_list", function(data) {
      updateUsersList(data);
    });

    document.getElementById('message').onkeypress = function(e) {
      
      if(this.value === "")
        return;

      if (e.keyCode == '13' || e.which == '13') {
        var sendMessage = this.value;
        socketio.emit('message', JSON.stringify({username: userName, message: sendMessage}));        
        this.value = "";

      }
    }
    
    setInterval(checkConnectionStatus, 10000);

    function checkConnectionStatus() {
      if (!socketio.socket.connected) {
        updateStatus("Disconnected");
        document.getElementById('message').disabled = true;
      }
    }

   };

  
  var updateStatus = function (status) {
    var element = document.getElementById('connection-status');

    element.innerHTML = "Connection Status: " + status;
  }

  var updateChatWindow = function (new_data) {
    var chatWindow = document.getElementById('chat-window');
    chatWindow.value += new_data + '\n';
    chatWindow.scrollTop = chatWindow.scrollHeight;
  }

  var updateUsersList = function (newList) { 
    var usersWindow = document.getElementById('users-list');
    usersWindow.innerHTML = "";

    var users = "";

    for(var key in newList)
      users += newList[key] + "\n";

    usersWindow.value = users;


  }

};
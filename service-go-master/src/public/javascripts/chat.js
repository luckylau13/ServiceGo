const socket = io("");
const messageContainer = document.getElementById("send-container");
const messageForm = document.getElementById("send-container");
const messageInput = document.getElementById("message-input");

const name = document.getElementById("name-of-user").value;
console.log(name);
appendMessage(`${name} joined`);
socket.emit("new-user", name);

socket.on("chat-message", data => {
  appendMessage(`${data.name}: ${data.message}`);
});

socket.on("user-connected", name => {
  appendMessage(`${name} connected`);
});

socket.on("user-disconnected", name => {
  appendMessage(`${name} disconnected`);
});

messageForm.addEventListener("submit", e => {
  e.preventDefault();

  const message = messageInput.value;
  appendMessage(`You: ${message}`);
  socket.emit("send-chat-message", message);
  messageInput.value = "";
});

function appendMessage(message) {
  const messageElement = document.createElement("div");
  messageElement.innerText = message;
  messageContainer.append(messageElement);
}

let hide = false;
const showChat = () => {
  switch (hide) {
    case true:
      document.getElementById("show-chat").style.display = "none";
      hide = false;
      break;
    case false:
      document.getElementById("show-chat").style.display = "block";
      hide = true;
      break;

    default:
      document.getElementById("show-chat").style.display = "block";
      break;
  }
};

/*
// Handle Output
socket.on('output', function(data){
  //console.log(data);
  if(data.length){
    for(var x = 0;x < data.length;x++){
      // Build out message div
      var message = document.createElement('div');
      message.setAttribute('class', 'chat-message');
      message.textContent = data[x].name+": "+data[x].message;
      messages.appendChild(message);
      messages.insertBefore(message, messages.firstChild);
     }
  }
});

// Handle Input
textarea.addEventListener('keydown', function(event){
  if(event.which === 13 && event.shiftKey == false){
      // Emit to server input
      socket.emit('input', {
          name:username.value,
          message:textarea.value
      });
      event.preventDefault();
  }
})
*/

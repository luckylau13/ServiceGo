
"use strict";

const _http = require("http");
const fs = require('fs');
const path = require('path');  
const _server = _interopRequireDefault(require("../server"));
const imgChunks = [];

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

require("dotenv").config();

const PORT = process.env.PORT || 4000;
const server = (0, _http.createServer)(_server.default);

const io = require("socket.io")(server);    

const users = {}; //This is test

io.on("connection", socket => {
  socket.on("new-user", name => {
    users[socket.id] = name;
    socket.broadcast.emit("user-connected", name);
  });
  socket.on("send-chat-message", message => {
    socket.broadcast.emit("chat-message", {
      message: message,
      name: users[socket.id]
    });
  });
  socket.on("disconnect", () => {
    socket.broadcast.emit("user-disconnected", users[socket.id]);
    delete users[socket.id];
  });
  
  var readStream = fs.createReadStream(path.resolve(__dirname, './beach.jpg'),{
    encoding:'binary'
  }), chunks = [], delay = 0;
  readStream.on('readable', function(){
    console.log('Image loading');
  });
  readStream.on('data', function (chunk){
    chunks.push(chunk);
    socket.emit('image-chunk', chunk);
  });
  readStream.on('end', function(){
    console.log('Image loaded');
  });
  socket.on('img-chunk', function(chunk){
    var img = document.getElementById('img-stream2');
    imgChunks.push(chunk);
    img.setAttribute('src', 'data:image/jpeg;base64,' + window.btoa(imgChunks)); 
  });
  
  
});



server.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
//# sourceMappingURL=index.js.map



const express = require("express");
const ejs = require('ejs');
const { v4: uuidv4 } = require('uuid');

const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server)
const { ExpressPeerServer } = require('peer');
const peerServer = ExpressPeerServer(server, {
    debug: true
});






app.use('/peerjs', peerServer);
app.set('view engine', 'ejs');
app.use(express.static('public'));

const uniqueID = uuidv4()

app.get("/", function(req,res){
    res.redirect(`/${uniqueID}`);
})



app.get("/:room",function(req,res){
    res.render('room', {roomId: req.params.room})

})

io.on('connection', socket => {
    socket.on('join-room', (roomId, userId) => {
      socket.join(roomId)
      socket.to(roomId).broadcast.emit('user-connected', userId);
      socket.on('message', message =>{
          io.to(roomId).emit('createMessage', message)
      })
    })
})













server.listen(3030, function(req,res){
    console.log("Server started at port 3030")
});
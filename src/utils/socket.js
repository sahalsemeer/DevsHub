const socket = require("socket.io");

const initSocket = (server) => {
  const io = socket(server, {
    cors: {
      origin: "http://localhost:5173",
    },
  });

  io.on('connection',socket => {
    socket.on('joinChat',({userId,RecieveruserId}) => {
      const room = [userId,RecieveruserId].sort().join('_')
      socket.join(room)

    })

    socket.on('sendMessage',({name,userId,RecieveruserId,text}) => {
      const room = [userId,RecieveruserId].sort().join('_')
      console.log(room);
      console.log(name+':'+text);
      io.to(room).emit('message recieved:',{name,text})

    })

    socket.on('disconnect',() => {})
})
};



module.exports = { initSocket };

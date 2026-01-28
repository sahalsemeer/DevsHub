const socket = require("socket.io");
const chatModel = require("../models/chat");

const initSocket = (server) => {
  const io = socket(server, {
    cors: {
      origin: "http://localhost:5173",
    },
  });

  io.on("connection", (socket) => {
    socket.on("joinChat", ({ userId, RecieveruserId }) => {
      const room = [userId, RecieveruserId].sort().join("_");
      socket.join(room);
    });

    socket.on("sendMessage", async ({ name, userId, RecieveruserId, text }) => {
      const room = [userId, RecieveruserId].sort().join("_");
      try {
        let chats = await chatModel.findOne({
          participants: { $all: [userId, RecieveruserId] },
        });
        console.log(chats);

        if (!chats) {
          chats = new chatModel({
            participants: [userId, RecieveruserId],
            messages:[]
          });
        }
        chats.messages.push({
          senderId:userId,
          text,
          recieverId:RecieveruserId
          
        })

          console.log(chats);
          await chats.save();
        
      } catch (error) {
        console.log(error.message);
      }
      io.to(room).emit("messageReceived", { name, text });
    });

    socket.on("disconnect", () => {});
  });
};

module.exports = { initSocket };

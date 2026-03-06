const socket = require("socket.io");
const chatModel = require("../models/chat");
const ConnectionsRequests = require("../models/connectionRequests");
const jwt = require("jsonwebtoken");

const initSocket = (server) => {
  const io = socket(server, {
    cors: {
      origin: "http://localhost:5173",
    },
  });

  io.use((socket, next) => {
    const { token } = socket.handshake.auth;
    try {
      if (token) {
        const verifyToken = jwt.verify(token, process.env.JWT_SECRET);
        const { id } = verifyToken;
        socket.userId = id;
        next();
      } else {
        return next(new Error("Authentication Error:Token missing!"));
      }
    } catch (error) {
      next(new Error("Authentication Error:Token Invalid Token!"));
    }
  });

  const onlineUsers = new Map();


  io.on("connection", (socket) => {
    console.log('Socket connected succesfully!');
    
    const { userId } = socket;

    onlineUsers.set(userId, socket.id);

    socket.emit("getAllOnlineUsersID", Array.from(onlineUsers.keys()));

    socket.broadcast.emit("user_status_changed", {
      userId: userId,
      isOnline: true,
    });

    // console.log(`socket: ${socket.id}`);
    socket.on("joinChat", ({ userID, RecieveruserId }) => {
      const room = [userID, RecieveruserId].sort().join("_");
      socket.join(room);
    });

    socket.on("leaveChat", ({ userID, RecieveruserId }) => {
      const room = [userID, RecieveruserId].sort().join("_");
      socket.leave(room);
    });
    // console.log("Online:", onlineUsers);

    socket.on("sendMessage", async ({ name, userId, RecieveruserId, text, timestamp }) => {
      const room = [userId, RecieveruserId].sort().join("_");
      console.log('send room:', room);

      console.log('name:', name);

      try {
        const friends = await ConnectionsRequests.findOne({
          $or: [
            {
              FromUserId: userId,
              ToUserId: RecieveruserId,
              status: "accepted",
            },
            {
              FromUserId: RecieveruserId,
              ToUserId: userId,
              status: "accepted",
            },
          ],
        });

        // console.log(friends);

        if (!friends) {
          console.log("You cant send message to not in the friend list!");
          return;
        }

        let chats = await chatModel.findOne({
          participants: { $all: [userId, RecieveruserId] },
        });
        // console.log(chats);

        if (!chats) {
          chats = new chatModel({
            participants: [userId, RecieveruserId],
            messages: [],
          });
        }

        chats.messages.push({
          senderId: userId,
          text,
          recieverId: RecieveruserId,
        });

        console.log("new chat:", chats);
        await chats.save();
      } catch (error) {
        console.log(error.message);
      }
      io.to(room).emit("messageReceived", { name, text, senderId: userId, receiverId: RecieveruserId });
    });

    socket.on("disconnect", () => {
      console.log(`${userId} disconnected!`);
      onlineUsers.delete(userId);

      socket.broadcast.emit("user_status_changed", {
        userId: userId,
        isOnline: false,
      });
    });
  });
};

module.exports = { initSocket };

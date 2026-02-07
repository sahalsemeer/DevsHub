import React, { useEffect, useState } from "react";
import { creatSocketConnection } from "../utils/socket";
import { useParams, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { BASE_API } from "../utils/constants";
import axios from "axios";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const user = useSelector((state) => state.user.user);
  const { RecieveruserId } = useParams();
  const userId = user?._id;

  console.log(messages);

  const getChats = async () => {
    try {
      const data = await axios.get(`${BASE_API}/chats/${RecieveruserId}`, {
        withCredentials: true,
      });

      const fetchMessages = data?.data?.chats?.messages;

      // console.log(fetchMessages);

      if (fetchMessages) {
        const formatMessages = fetchMessages.map((message) => {
          console.log(message._id, message.text, message.senderId.firstName);
          return {
            id: message._id,
            text: message.text,
            sender: `${message.senderId.firstName} ${message.senderId.lastName}`,
          };
        });
        console.log('Format: ',formatMessages);

        setMessages(formatMessages);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getChats();
  }, []);

  useEffect(() => {
    // console.log(userId);

    const socket = creatSocketConnection();

    socket.emit("joinChat", { userId, RecieveruserId });

    // socket.on('getAllOnlineUsersId',(onlineUsers) => {
    //   console.log(onlineUsers);
    // })

    socket.on("messageReceived", ({ name, text }) => {
      console.log(`${name}:${text}`);

      const newMessage = {
        id: Date.now(),
        text: text,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        sender: name,
      };

      setMessages((messages) => [...messages, newMessage]);
    });

    return () => {
      socket.disconnect();
    };
  }, [userId, RecieveruserId]);

  const handleSendMessage = (e) => {
    e.preventDefault();

    if (inputMessage.trim() === "") return;
    
    const socket = creatSocketConnection();
    
    socket.emit("sendMessage", {
      name: user.firstName,
      userId,
      RecieveruserId,
      text: inputMessage,
    });

   

    setInputMessage("");
  };

  return (
    <div className="flex flex-col h-150 m-20  max-w-3xl mx-auto border border-none rounded-xl overflow-hidden bg-white shadow-lg">
      {/* Chat Header */}
      <div className="bg-gray-800 text-white p-5  shadow-md">
        <h2 className="text-2xl font-semibold m-0">Chat</h2>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-5 bg-gray-700 flex flex-col gap-3">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-white text-base">
            <p className="m-0">No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((message) => (
            <div key={message.id} className="flex justify-end animate-slideIn">
              <p>{message.sender}</p>
              <div className="max-w-[70%] px-4 py-3 rounded-2xl bg-gray-800 text-white shadow-md">
                <p className="m-0 mb-1 wrap-break-word leading-relaxed">
                  {message.text}
                </p>
                <span className="text-xs opacity-80 block text-right"></span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Message Input */}
      <form
        className="flex p-4 bg-gray-800 border-none gap-3"
        onSubmit={handleSendMessage}
      >
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 px-4 py-3 border border-none rounded-full text-white outline-none focus:border-gray-600 transition-colors"
        />
        <button
          type="submit"
          className="px-6 py-3 bg-green-800 text-white border-none rounded-full text-base font-semibold cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 shadow-md"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default Chat;

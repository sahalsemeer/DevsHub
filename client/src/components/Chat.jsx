import React, { useEffect, useState } from "react";
import { creatSocketConnection } from "../utils/socket";
import { useParams, useSearchParams } from "react-router-dom";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const user = useSearchParams((state) => state.user);
  const { RecieveruserId } = useParams();
  const userId = user?._id;

  useEffect(() => {
    const socket = creatSocketConnection();

    socket.emit("joinChat", { userId, RecieveruserId });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleSendMessage = (e) => {
    e.preventDefault();

    if (inputMessage.trim() === "") return;

    const newMessage = {
      id: Date.now(),
      text: inputMessage,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      sender: "user",
    };

    setMessages([...messages, newMessage]);
    setInputMessage("");
  };

  return (
    <div className="flex flex-col h-150 m-20  max-w-3xl mx-auto border border-none rounded-xl overflow-hidden bg-white shadow-lg">
      {/* Chat Header */}
      <div className="bg-gray-800 text-white p-5  shadow-md">
        <h2 className="text-2xl font-semibold m-0">Chat</h2>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-5 bg-gray-50 flex flex-col gap-3">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-400 text-base">
            <p className="m-0">No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((message) => (
            <div key={message.id} className="flex justify-end animate-slideIn">
              <div className="max-w-[70%] px-4 py-3 rounded-2xl bg-gray-800 text-white shadow-md">
                <p className="m-0 mb-1 wrap-break-word leading-relaxed">
                  {message.text}
                </p>
                <span className="text-xs opacity-80 block text-right">
                  {message.timestamp}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Message Input */}
      <form
        className="flex p-4 bg-white border-t border-gray-200 gap-3"
        onSubmit={handleSendMessage}
      >
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 px-4 py-3 border border-gray-200 rounded-full text-gray-600 outline-none focus:border-gray-600 transition-colors"
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

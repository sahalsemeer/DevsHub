import { useState, useEffect } from "react";
import axios from "axios";
import { BASE_API } from "../utils/constants";
import { useSelector } from "react-redux";

const useChat = (targetUserId, socket) => {
  const [messages, setMessages] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const user = useSelector((state) => state.user.user);
  const userID = user?._id;

  const getChats = async (pageNum = 1) => {
    if (!targetUserId) return;
    setLoading(true);
    try {
      const data = await axios.get(
        `${BASE_API}/chats/${targetUserId}?page=${pageNum}&limit=20`,
        { withCredentials: true },
      );

      const fetchMessages =
        data?.data?.messages || data?.data?.chats?.messages || [];
      setHasMore(fetchMessages.length === 20);

      const formatMessages = fetchMessages.map((message) => {
        return {
          id: message._id,
          text: message.text,
          sender: `${message.senderId.firstName} ${message.senderId.lastName}`,
          senderId: message.senderId._id,
          timestamp: new Date(message.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        };
      });

      if (pageNum === 1) {
        setMessages(formatMessages);
      } else {
        setMessages((prev) => [...formatMessages, ...prev]);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
    setHasMore(true);
    setMessages([]);
    getChats(1);
  }, [targetUserId]);

  useEffect(() => {
    if (!socket || !userID) return;

    const handleMessageReceived = ({ name, text, senderId, receiverId }) => {
      // Defensively filter messages to ensure they belong to the current active chat
      const isRelevant =
        senderId === targetUserId ||
        (senderId === userID && receiverId === targetUserId);

      if (!isRelevant) return;

      const newMessage = {
        id: Date.now(),
        text: text,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        sender: name,
        senderId: senderId,
      };
      setMessages((prev) => [...prev, newMessage]);
    };

    socket.on("messageReceived", handleMessageReceived);

    return () => {
      socket.off("messageReceived", handleMessageReceived);
    };
  }, [socket, userID, targetUserId]);

  const sendMessage = (text) => {
    if (text.trim() === "" || !targetUserId || !userID) return;

    if (socket) {
      socket.emit("sendMessage", {
        name: user?.firstName,
        userId: userID,
        RecieveruserId: targetUserId,
        text: text,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      });
    }
  };

  return { messages, loading, hasMore, page, setPage, getChats, sendMessage };
};

export default useChat;

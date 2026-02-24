import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { BASE_API } from "../utils/constants";

import useSocket from "../hooks/useSocket";
import useChat from "../hooks/useChat";
import ChatSidebar from "./ChatSidebar";
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";

const Chat = () => {
  const { targetUserId } = useParams();
  console.log('target:',targetUserId);
  
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.user);
  const userID = user?._id;

  const [connections, setConnections] = useState([]);
  const [connectionsLoading, setConnectionsLoading] = useState(true);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);

  // Custom Hooks
  // useSocket now returns { socket, onlineUsers }
  const { socket, onlineUsers } = useSocket(targetUserId);

  // useChat now accepts (targetUserId, socket)
  const { messages, loading, hasMore, page, getChats, sendMessage, } = useChat(
    targetUserId,
    socket,
  );

  // Window Resize Logic
  useEffect(() => {
    const handleResize = () => setIsMobileView(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch Connections (Sidebar)
  const getConnections = async () => {
    try {
      const res = await axios.get(BASE_API + "/user/requests/connections", {
        withCredentials: true,
      });
      setConnections(res?.data?.data || []);
    } catch (error) {
      console.error("Error fetching connections:", error);
    } finally {
      setConnectionsLoading(false);
    }
  };

  useEffect(() => {
    getConnections();
    
  }, []);

  // Render Logic
  const showSidebar = !isMobileView || !targetUserId;
  const showChat = !isMobileView || targetUserId;
  const isOnline = targetUserId && onlineUsers.includes(targetUserId);

  const activeUser = connections.find((c) => c._id === targetUserId);

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden bg-base-200">
      {/* Sidebar */}
      {showSidebar && (
        <div
          className={`${
            isMobileView ? "w-full" : "w-1/3 max-w-sm"
          } bg-base-100 border-r border-base-300 flex flex-col`}
        >
          <ChatSidebar
            connections={connections}
            loading={connectionsLoading}
            onlineUsers={onlineUsers}
            targetUserId={targetUserId}
            onSelectUser={(id) => navigate(`/chat/${id}`)}
          />
        </div>
      )}

      {/* Chat Window */}
      {showChat && (
        <div className="flex-1 flex flex-col h-full bg-base-100 relative">
          {targetUserId ? (
            <>
              {/* Header */}
              <div className="p-4 bg-base-100 border-b border-base-300 shadow-sm flex items-center gap-3 sticky top-0 z-10">
                {isMobileView && (
                  <button
                    onClick={() => navigate("/chat")}
                    className="p-2 mr-2 rounded-full hover:bg-base-200 font-bold text-base-content"
                  >
                    ←
                  </button>
                )}
                <div className="flex items-center gap-3">
                  {activeUser ? (
                    <>
                      <img
                        src={activeUser.photoURL}
                        alt="avatar"
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <h2 className="font-semibold text-base-content leading-tight">
                          {activeUser.firstName} {activeUser.lastName}
                        </h2>
                        {isOnline && (
                          <span className="text-xs text-success font-medium">
                            Online
                          </span>
                        )}
                      </div>
                    </>
                  ) : (
                    <h2 className="font-semibold text-base-content">Chat</h2>
                  )}
                </div>
              </div>

              {/* Messages */}
              <ChatMessages
                messages={messages}
                loading={loading}
                userID={userID}
                hasMore={hasMore}
                page={page}
                loadMore={() => getChats(page + 1)}
              />

              {/* Input */}
              <ChatInput onSendMessage={sendMessage} />
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-base-content/50">
              <p className="text-lg font-medium">Select a conversation</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Chat;

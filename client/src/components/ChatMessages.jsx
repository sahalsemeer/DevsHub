import React, { useEffect, useRef } from "react";
import ShimmerChat from "./ShimmerChat";

const ChatMessages = ({
  messages,
  loading,
  userID,
  hasMore,
  loadMore,
  page,
}) => {
  const chatContainerRef = useRef(null);

  const handleScroll = () => {
    if (
      chatContainerRef.current &&
      chatContainerRef.current.scrollTop === 0 &&
      hasMore &&
      !loading
    ) {
      const currentHeight = chatContainerRef.current.scrollHeight;
      loadMore().then(() => {
        // Restore scroll position
        setTimeout(() => {
          if (chatContainerRef.current) {
            const newHeight = chatContainerRef.current.scrollHeight;
            chatContainerRef.current.scrollTop = newHeight - currentHeight;
          }
        }, 0);
      });
    }
  };

  // Auto scroll to bottom on new message (if near bottom or first load)
  // Simplified for now: scroll to bottom on new messages if page is 1
  useEffect(() => {
    if (page === 1 && chatContainerRef.current) {
      setTimeout(() => {
        if (chatContainerRef.current) {
          chatContainerRef.current.scrollTop =
            chatContainerRef.current.scrollHeight;
        }
      }, 100);
    }
  }, [messages, page]);

  return (
    <div
      ref={chatContainerRef}
      onScroll={handleScroll}
      className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 pb-20 bg-base-200/50"
    >
      {loading && page > 1 && (
        <div className="text-center text-xs text-base-content/50 py-2">
          Loading more...
        </div>
      )}
      {loading && page === 1 && messages.length === 0 ? (
        <ShimmerChat />
      ) : messages.length === 0 ? (
        <div className="flex items-center justify-center h-full text-base-content/50">
          <p>Say hello! 👋</p>
        </div>
      ) : (
        messages.map((message, index) => {
          const isMe = String(message.senderId) === String(userID);
          return (
            <div
              key={index}
              className={`chat ${isMe ? "chat-end" : "chat-start"}`}
            >
              <div className="chat-header">
                {message.sender}
                <time className="text-xs opacity-50 ml-1">
                  {message.timestamp}
                </time>
              </div>
              <div
                className={`chat-bubble ${
                  isMe ? "chat-bubble-primary" : "chat-bubble-secondary"
                }`}
              >
                {message.text}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default ChatMessages;

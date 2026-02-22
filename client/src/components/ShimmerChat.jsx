import React from 'react';

const ShimmerChat = () => {
  return (
    <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 pb-20 bg-base-200/50">
      {/* Sender Message Skeleton */}
      <div className="chat chat-start animate-pulse">
        <div className="chat-header h-4 w-20 bg-base-300 rounded mb-1"></div>
        <div className="chat-bubble chat-bubble-secondary w-48 h-10 bg-base-300 opacity-50"></div>
      </div>

      {/* Receiver Message Skeleton */}
      <div className="chat chat-end animate-pulse">
        <div className="chat-header h-4 w-20 bg-base-300 rounded mb-1 ml-auto"></div>
        <div className="chat-bubble chat-bubble-primary w-64 h-16 bg-base-300 opacity-50"></div>
      </div>

      {/* Sender Message Skeleton */}
      <div className="chat chat-start animate-pulse">
        <div className="chat-header h-4 w-16 bg-base-300 rounded mb-1"></div>
        <div className="chat-bubble chat-bubble-secondary w-32 h-8 bg-base-300 opacity-50"></div>
      </div>

      {/* Receiver Message Skeleton */}
      <div className="chat chat-end animate-pulse">
        <div className="chat-header h-4 w-24 bg-base-300 rounded mb-1 ml-auto"></div>
        <div className="chat-bubble chat-bubble-primary w-56 h-12 bg-base-300 opacity-50"></div>
      </div>
       
       {/* Sender Message Skeleton */}
      <div className="chat chat-start animate-pulse">
        <div className="chat-header h-4 w-20 bg-base-300 rounded mb-1"></div>
        <div className="chat-bubble chat-bubble-secondary w-40 h-10 bg-base-300 opacity-50"></div>
      </div>
    </div>
  );
};

export default ShimmerChat;

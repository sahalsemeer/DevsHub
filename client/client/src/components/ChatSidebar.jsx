import React from "react";
import ShimmerConnections from "./ShimmerConnections";

const ChatSidebar = ({
  connections,
  loading,
  onlineUsers,
  targetUserId,
  onSelectUser,
  isMobileView,
}) => {
  if (loading) return <ShimmerConnections />;

  if (connections.length === 0) {
    return (
      <p className="p-4 text-center text-base-content/70">
        No connections yet.
      </p>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      {connections.map((conn) => {
        const isUserOnline = onlineUsers.includes(conn._id);
        const isActive = conn._id === targetUserId;
        return (
          <div
            key={conn._id}
            onClick={() => onSelectUser(conn._id)}
            className={`flex items-center gap-3 p-4 cursor-pointer hover:bg-base-200 transition-colors ${
              isActive ? "bg-base-200 border-l-4 border-primary" : ""
            }`}
          >
            <div className="relative">
              <img
                src={conn.photoURL}
                alt={conn.firstName}
                className="w-12 h-12 rounded-full object-cover"
              />
              {isUserOnline && (
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-success rounded-full border-2 border-base-100"></div>
              )}
            </div>
            <div>
              <h3 className="font-semibold text-base-content">
                {conn.firstName} {conn.lastName}
              </h3>
              <p className="text-xs text-base-content/70 truncate w-40">
                {conn.about || "Available"}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ChatSidebar;

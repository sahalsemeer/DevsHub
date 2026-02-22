import React, { useState } from "react";

const ChatInput = ({ onSendMessage }) => {
  const [inputMessage, setInputMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputMessage.trim()) {
      onSendMessage(inputMessage);
      setInputMessage("");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-3 bg-base-100 border-t border-base-300 flex gap-2 w-full absolute bottom-0"
    >
      <input
        type="text"
        value={inputMessage}
        onChange={(e) => setInputMessage(e.target.value)}
        placeholder="Type a message..."
        className="input input-bordered flex-1 rounded-full focus:outline-none"
      />
      <button
        type="submit"
        disabled={!inputMessage.trim()}
        className="btn btn-primary btn-circle shadow-md"
      >
        <span className="sr-only">Send</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-5 h-5"
        >
          <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
        </svg>
      </button>
    </form>
  );
};

export default ChatInput;

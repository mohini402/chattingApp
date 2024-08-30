import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import { useParams, useLocation } from "react-router-dom";
import "./chatApp.css";

const ChatApp = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const { roomId } = useParams();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const username = query.get("username") || "Guest";

  const socketRef = useRef(null);

  useEffect(() => {
    // Initialize socket connection
    const socketUrl =  ('http://localhost:3001'); // Backend URL;
    socketRef.current = io(socketUrl);

    const socket = socketRef.current;

    // Join room on connection
    socket.emit("joinRoom", roomId, username);

    // Handle incoming messages
    const handleReceiveMessage = (msg) => {
      //console.log("Received message:", msg);
      setMessages((prevMessages) => [...prevMessages, msg]);
    };

    socket.on("receiveMessage", handleReceiveMessage);

    return () => {
      socket.disconnect();
    };
  }, [roomId, username]);

  const handleSendMessage = () => {
    if (message.trim()) {
      const messageData = { username, message };
      const socket = socketRef.current;

      socket.emit("sendMessage", messageData);
      setMessage("");
    }
  };

  // Auto-scroll to the bottom of the chat messages
  const messageEndRef = useRef(null);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="chat-container">
      <h2>Welcome {username}</h2>
      <div className="messages-container">
        <div className="messages">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`userMessage ${msg.username === username ? "sender" : "receiver"}`}
            >
              {msg.username}: {msg.message}
              <div className="timestamp">{msg.timestamp}</div>
            </div>
          ))}
          <div ref={messageEndRef} />
        </div>
        <div className="input-container">
          <textarea
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message"
          ></textarea>
          <button onClick={handleSendMessage}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
              <path d="M498.1 5.6c10.1 7 15.4 19.1 13.5 31.2l-64 416c-1.5 9.7-7.4 18.2-16 23s-18.9 5.4-28 1.6L284 427.7l-68.5 74.1c-8.9 9.7-22.9 12.9-35.2 8.1S160 493.2 160 480l0-83.6c0-4 1.5-7.8 4.2-10.8L331.8 202.8c5.8-6.3 5.6-16-.4-22s-15.7-6.4-22-.7L106 360.8 17.7 316.6C7.1 311.3 .3 300.7 0 288.9s5.9-22.8 16.1-28.7l448-256c10.7-6.1 23.9-5.5 34 1.4z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatApp;

"use client";
import React, { useState } from "react";
import ReactMarkdown from "react-markdown";  
type ChatbotProps = {
  headerText?: string;
  themeColor?: string;
  onSendMessage?: (message: string) => void;
};

const Chatbot: React.FC<ChatbotProps> = ({
  headerText = "Generate Insight!",
  themeColor = "#4CAF50",
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const [messages, setMessages] = useState<
    { text: string; sender: "user" | "bot" }[]
  >([]);
  const [input, setInput] = useState("");
  const [loader, setLoader] = useState(false);

  const toggleChat = () => setIsOpen(!isOpen);

  const sendMessageToServer = async (message: string) => {
    const url = `/api/chat`;
    try {
      const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify({ inputValue: message }),
      });

      const responseMessage = await response.json();
      if (!response.ok) {
        throw new Error(
          `${response.status} ${response.statusText} - ${JSON.stringify(
            responseMessage
          )}`
        );
      }
      return responseMessage;
    } catch (error) {
      console.error("Request Error:", error);
    }
  };
  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { text: input, sender: "user" as const };
    setLoader(true);
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    const response = await sendMessageToServer(input);
    const responseMessage = { text: response?.message, sender: "bot" as const };
    setLoader(false);
    setMessages((prev) => [...prev, responseMessage]);
  };

  return (
    <div>
      {/* Floating Button */}
      <button
        onClick={toggleChat}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          backgroundColor: themeColor,
          color: "#fff",
          borderRadius: "50%",
          width: "60px",
          height: "60px",
          border: "none",
          cursor: "pointer",
        }}
      >
        💬
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div
          style={{
            position: "fixed",
            bottom: "80px",
            right: "20px",
            width: "450px",
            height: "500px",
            backgroundColor: "#fff",
            border: `2px solid ${themeColor}`,
            borderRadius: "10px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Header */}
          <div
            style={{
              backgroundColor: themeColor,
              color: "#fff",
              padding: "10px",
              borderRadius: "10px 10px 0 0",
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            {headerText}
          </div>

          {/* Messages */}
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "10px",
            }}
          >
            {messages.map((message, index) => (
              <div
                key={index}
                style={{
                  textAlign: message.sender === "user" ? "right" : "left",
                  marginBottom: "10px",
                }}
              >
                <span
                  style={{
                    display: "inline-block",
                    padding: "8px 12px",
                    borderRadius: "15px",
                    backgroundColor:
                      message.sender === "user" ? themeColor : "#f1f1f1",
                    color: message.sender === "user" ? "#fff" : "#000",
                    maxWidth: "80%",
                  }}
                >
                  <ReactMarkdown > 
                    {message.text}
                  </ReactMarkdown>
                </span>
              </div>
            ))}
            {loader && (
              <div
                style={{
                  textAlign: "left",
                  marginBottom: "10px",
                }}
              >
                <span
                  style={{
                    display: "inline-block",
                    padding: "8px 12px",
                    borderRadius: "15px",
                    backgroundColor: "#f1f1f1",
                    color: "#000",
                    maxWidth: "80%",
                  }}
                >
                  <ChatLoader />
                </span>
              </div>
            )}
          </div>

          {/* Input */}
          <div
            style={{
              display: "flex",
              padding: "10px",
              borderTop: `1px solid ${themeColor}`,
            }}
          >
            <input
              type="text"
              placeholder="Type a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              style={{
                flex: 1,
                padding: "10px",
                border: `1px solid ${themeColor}`,
                borderRadius: "5px",
                marginRight: "10px",
              }}
            />
            <button
              onClick={handleSendMessage}
              style={{
                backgroundColor: themeColor,
                color: "#fff",
                border: "none",
                borderRadius: "5px",
                padding: "10px 15px",
                cursor: "pointer",
              }}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;

const ChatLoader = () => {
  return (
    <div className="flex items-center space-x-2">
      <div className="w-1 h-1 bg-gray-600 rounded-full animate-ping"></div>
      <div className="w-1.5 h-1.5 bg-gray-600 rounded-full animate-ping animation-delay-200"></div>
      <div className="w-2 h-2 bg-gray-600 rounded-full animate-ping animation-delay-400"></div>
    </div>
  );
};

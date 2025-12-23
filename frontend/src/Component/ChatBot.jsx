import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { getApiUrl, API_BASE_URL } from "../config/api";
import "../assets/ChatBot.css";

function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      text: "مرحباً! أنا مساعدك الشخصي من الشركة المصرية للري وشبكات المياه. كيف يمكنني مساعدتك اليوم؟",
      isBot: true,
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isConnected, setIsConnected] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    const checkConnection = async () => {
      try {
        await axios.get(getApiUrl("api/products"));
        setIsConnected(true);
      } catch {
        setIsConnected(false);
      }
    };

    checkConnection();
  }, []);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleInputChange = (e) => {
    setInputMessage(e.target.value);
  };

  const sendMessage = async () => {
    if (inputMessage.trim() === "") return;

    const userMessage = { text: inputMessage, isBot: false };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    const currentInput = inputMessage;
    setInputMessage("");
    setIsTyping(true);

    try {
      console.log("Sending message to chatbot API:", currentInput);

      const response = await axios.post(getApiUrl("api/chatbot"), {
        message: currentInput,
        history: messages.map((msg) => ({
          role: msg.isBot ? "assistant" : "user",
          content: msg.text,
        })),
      });

      console.log("Received response from chatbot API:", response.data);

      if (response.data && response.data.reply) {
        const botMessage = { text: response.data.reply, isBot: true };
        setMessages((prevMessages) => [...prevMessages, botMessage]);
        setIsConnected(true);
      } else {
        console.error("Invalid response format:", response.data);
        throw new Error("لم يتم استلام رد صحيح من الخادم");
      }
    } catch (error) {
      console.error("Error communicating with chatbot:", error);
      console.error("Error details:", error.response?.data || error.message);

      setIsConnected(false);
      const errorMessage = {
        text:
          error.response?.data?.reply ||
          "عذراً، حدثت مشكلة في الاتصال. يرجى المحاولة مرة أخرى.",
        isBot: true,
      };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  const suggestions = [
    "ما هي أنظمة الري الأكثر كفاءة؟",
    "أحتاج مساعدة في اختيار شبكة مياه",
    "ما هي خدمات الصيانة المتوفرة؟",
    "كيف يمكنني طلب استشارة فنية؟",
  ];

  return (
    <div className="chatbot-container">
      {/* زر فتح المحادثة */}
      <button
        className={`chat-toggle-button ${
          !isConnected ? "chat-disconnected" : ""
        }`}
        onClick={toggleChat}
        aria-label={isOpen ? "إغلاق المحادثة" : "فتح المحادثة"}
      >
        {isOpen ? (
          <i className="bi bi-x-lg"></i>
        ) : (
          <i className="bi bi-chat-dots-fill"></i>
        )}
      </button>

      {/* نافذة المحادثة */}
      {isOpen && (
        <div className="chat-window">
          <div className="chat-header">
            <h3>
              المساعد الذكي{" "}
              {!isConnected && (
                <span className="connection-status">(غير متصل)</span>
              )}
            </h3>
            <button
              className="close-button"
              onClick={toggleChat}
              aria-label="إغلاق المحادثة"
            >
              <i className="bi bi-x"></i>
            </button>
          </div>

          <div className="chat-messages">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`message ${message.isBot ? "bot" : "user"}`}
              >
                {message.isBot && (
                  <div className="bot-avatar">
                    <i className="bi bi-robot"></i>
                  </div>
                )}
                <div className="message-content">{message.text}</div>
              </div>
            ))}
            {isTyping && (
              <div className="message bot">
                <div className="bot-avatar">
                  <i className="bi bi-robot"></i>
                </div>
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* اقتراحات */}
          <div className="chat-suggestions">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                className="suggestion-button"
                onClick={() => {
                  setInputMessage(suggestion);
                  // يمكن تفعيل الإرسال التلقائي باختيار الاقتراح
                  setTimeout(() => sendMessage(), 100);
                }}
              >
                {suggestion}
              </button>
            ))}
          </div>

          <div className="chat-input">
            <input
              type="text"
              placeholder="اكتب رسالتك هنا..."
              value={inputMessage}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              disabled={!isConnected && !inputMessage}
            />
            <button
              onClick={sendMessage}
              aria-label="إرسال"
              disabled={inputMessage.trim() === "" || isTyping || !isConnected}
            >
              <i className="bi bi-send-fill"></i>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ChatBot;
